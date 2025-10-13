import { useState, useEffect } from "react";
import NativeFile from "@/types/NativeFileDto";
import RuleExecution from "@/types/RuleExecutionDto";
import PaymentRowDto from "@/types/PaymentRow";
import LayoutValue from "@/types/LayoutValueDto";
import BusinessRule from "@/types/BusinessRuleDto";
import { createRuleExecution, getRuleExecution } from "@/services/ruleExecutionsService";
import { getLayoutFields } from "@/services/layoutFieldsService";
import { createNativeFile } from "@/services/nativeFilesService";
import { createLayoutValue } from "@/services/layoutValuesService";
import { uploadAndParseFile } from "@/services/fileParsersService";
import { getBusinessRuleById } from "@/services/businessRulesService";
import { getJSONValues, mapRowWithLLM } from "@/services/openAiService";

type PendingFile = {
  name: string;
  company: string;
  mappedRows: {
    row: number;
    values: {
      fieldName: string;
      value: string;
    }[];
  }[];
  ruleId?: number | null;
};

export function useRuleExecutions(initialData: RuleExecution[] = []) {
  const [data, setData] = useState<RuleExecution[]>(initialData);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const executions = await getRuleExecution();
        setData(executions);
      } catch (err) {
        console.error("Error fetching executions:", err);
      }
    };
    fetchRules();
  }, [isFormOpen]);

  const closeForm = () => {
    setIsFormOpen(false);
  };

  // Función auxiliar para convertir archivo del backend a File
  const convertBackendFileToFile = (backendFile: any): File | null => {
    try {
      if (!backendFile.buffer || !backendFile.buffer.data) {
        console.error("Estructura de archivo inválida");
        return null;
      }

      const uint8Array = new Uint8Array(backendFile.buffer.data);
      const blob = new Blob([uint8Array], {
        type: backendFile.mimetype || "application/octet-stream",
      });

      const file = new File([blob], backendFile.originalname || "archivo", {
        type: backendFile.mimetype || "application/octet-stream",
        lastModified: Date.now(),
      });


      return file;
    } catch (error) {
      console.error("Error convirtiendo archivo del backend:", error);
      return null;
    }
  };

  const parseFile = async (file: any): Promise<Record<string, any>[]> => {
    const filename = file.name || file.originalname;
    const ext = filename?.split(".").pop()?.toLowerCase();

    if (!ext || !["pdf", "csv", "doc", "docx", "xml", "txt"].includes(ext)) {
      console.error("Extensión no soportada:", filename);
      return [];
    }

    try {
      let fileToUpload: File | null = null;

      // Determinar el tipo de archivo que recibimos
      if (file instanceof File) {
        // Es un File nativo del navegador
        fileToUpload = file;

      } else if (file.buffer && file.buffer.data) {
        // Es un objeto del backend con buffer directo

        fileToUpload = convertBackendFileToFile(file);
      } else if (file.file && file.file.buffer) {
        // Es un objeto anidado del backend

        fileToUpload = convertBackendFileToFile(file.file);
      }

      if (!fileToUpload) {
        console.error("No se pudo procesar el archivo");
        return [];
      }

      // Llamar al servicio de parseo
      const parsedData = await uploadAndParseFile(fileToUpload);

      // Obtener los valores JSON
      const responseJson = await getJSONValues(parsedData);
      return responseJson ?? [];
    } catch (err) {
      console.error("Error parseando el archivo:", err);
      return [];
    }
  };

  const mapRowToDto = (row: Record<string, any>): PaymentRowDto[] => {
    return Object.entries(row).map(([key, value]) => ({
      key,
      value,
    }));
  };

  const getRuleJson = async (businessRuleId: number) => {
    const response: BusinessRule = await getBusinessRuleById(businessRuleId);
    return response.definition ?? [];
  };

  // Prepara los datos (sin guardar todavía)
  const prepareFileMapping = async (
    mappedData: any[],
    ruleJson: any | any[] | null
  ): Promise<PendingFile> => {
    const responseFields = await getLayoutFields();

    let mappedRows: PendingFile["mappedRows"] = [];

    const rulesArray = ruleJson
      ? Array.isArray(ruleJson)
        ? ruleJson
        : [ruleJson]
      : [];

    if (rulesArray.length > 0) {
      // --- Caso con reglas ---
      const rules = rulesArray[0]; // Tomamos el primer set de reglas

      for (const [rowIndex, row] of mappedData.entries()) {
        let rowValues: PendingFile["mappedRows"][number]["values"] = [];

        for (const field of responseFields) {
          let value = "";

          // Obtener el nombre del campo mapeado desde las reglas
          const mappedFieldName = rules[field.name];

          if (mappedFieldName) {
            // Buscar el valor en el row actual
            const dataEntry = row.find((d: any) => d.key === mappedFieldName);
            if (dataEntry) {
              value = String(dataEntry.value ?? "");
            }
          }

          rowValues.push({ fieldName: field.name, value });
        }

        mappedRows.push({ row: rowIndex + 1, values: rowValues });
      }
    } else {
      // --- Caso sin regla (con LLM) ---
      for (const [rowIndex, row] of mappedData.entries()) {
        const mapping: Record<string, string> = await mapRowWithLLM(
          row,
          responseFields
        );
        let rowValues: PendingFile["mappedRows"][number]["values"] = [];

        for (const field of responseFields) {
          const mappedKey = mapping[field.name];
          let value = "";

          if (mappedKey) {
            // Buscar en el array de row el elemento con ese key
            const dataEntry = row.find((d: any) => d.key === mappedKey);
            if (dataEntry) {
              value = String(dataEntry.value ?? "");
            }
          }

          rowValues.push({ fieldName: field.name, value });
        }

        mappedRows.push({ row: rowIndex + 1, values: rowValues });
      }
    }

    return {
      name: "Nuevo archivo",
      company: "",
      mappedRows,
    };
  };

  const saveConfirmedFile = async (
    pending: PendingFile,
    userId: number,
    multiple: boolean,
    fileId?: number
  ) => {
    const responseFields = await getLayoutFields();

    if (!multiple) {
      const newFile: Partial<NativeFile> = {
        name: pending.name,
      };

      const responseFile = await createNativeFile(newFile);

      for (const row of pending.mappedRows) {
        for (const value of row.values) {
          const field = responseFields.find((f) => f.name === value.fieldName);
          if (!field) continue;

          const valueToCreate: Partial<LayoutValue> = {
            fileId: responseFile?.id || fileId || 0,
            fieldId: field.id,
            value: value.value,
            row: row.row,
          };

          await createLayoutValue(valueToCreate);
        }
      }

      return responseFile;
    }

    // Caso múltiple
    for (const row of pending.mappedRows) {
      for (const value of row.values) {
        const field = responseFields.find((f) => f.name === value.fieldName);
        if (!field) continue;

        const valueToCreate: Partial<LayoutValue> = {
          fileId: fileId,
          fieldId: field.id,
          value: value.value,
          row: row.row,
        };

        await createLayoutValue(valueToCreate);
      }
    }
  };

  const createNewRuleExecution = async (fileId: number, ruleId?: number) => {
    const newExecution: Partial<RuleExecution> = { fileId, ruleId };
    const response = await createRuleExecution(newExecution);
    return response;
  };

  const saveFileMultiple = async (fileName: string, userId: number) => {
    const newFile: Partial<NativeFile> = {
      name: fileName,
    };
    const responseFile = await createNativeFile(newFile);
    return responseFile;
  };

  const refetchExecutions = async () => {
    try {
      const executions = await getRuleExecution();
      setData(executions);
    } catch (err) {
      console.error("Error fetching executions:", err);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      refetchExecutions();
    }, 15000); // cada 5 segundos

    return () => clearInterval(interval); // limpiar al desmontar
  }, [refetchExecutions]);

  return {
    data,
    isFormOpen,
    loading,
    openForm: () => setIsFormOpen(true),
    closeForm,
    parseFile,
    mapRowToDto,
    getRuleJson,
    prepareFileMapping,
    saveConfirmedFile,
    createNewRuleExecution,
    saveFileMultiple,
    refetchExecutions,
  };
}