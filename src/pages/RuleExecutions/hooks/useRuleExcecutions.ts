import { useState, useEffect } from "react";
import NativeFile from "@/types/NativeFileDto";
import RuleExecution from "@/types/RuleExecutionDto";
import PaymentRowDto from "@/types/PaymentRow";
import LayoutValue from "@/types/LayoutValueDto";
import BusinessRule from "@/types/BusinessRuleDto"
import { createRuleExecution, getRuleExecution } from "@/services/ruleExecutionsService";
import { getLayoutFields } from "@/services/layoutFieldsService"
import { createNativeFile } from "@/services/nativeFilesService"
import { createLayoutValue } from "@/services/layoutValuesService"
import { uploadAndParseFile } from "@/services/fileParsersService"
import { getBusinessRuleById } from "@/services/businessRulesService"
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
  }

  const parseFile = async (file: File): Promise<Record<string, any>[]> => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext != "pdf" && ext != "csv" && ext != "doc" && ext != "docx" && ext != "xml") {
      console.error("Error parseando el archivo:");
      return [];
    }
    try {
      const parsedData = await uploadAndParseFile(file);
      const responseJson = await getJSONValues(parsedData);
      return responseJson ?? [];
    } catch (error) {
      console.error("Error parseando el archivo:", error);
      return [];
    }
  }

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

  // 1. Prepara los datos (sin guardar todavía)
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
        const mapping: Record<string, string> = await mapRowWithLLM(row, responseFields);
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

  const saveConfirmedFile = async (pending: PendingFile, userId: number) => {
    const newFile: Partial<NativeFile> = {
      name: pending.name,
      // company: pending.company,
    };
    console.log(newFile)
    const responseFile = await createNativeFile(newFile);

    const responseFields = await getLayoutFields();

    for (const row of pending.mappedRows) {
      for (const value of row.values) {
        const field = responseFields.find((f) => f.name === value.fieldName);
        if (!field) continue;
        const valueToCreate: Partial<LayoutValue> = {
          fileId: responseFile.id,
          fieldId: field.id,
          value: value.value,
          row: row.row,
        };

        await createLayoutValue(valueToCreate);
      }
    }

    return responseFile;
  };

  const createNewRuleExecution = async (fileId: number, ruleId?: number) => {
    const newExecution: Partial<RuleExecution> = { fileId, ruleId };
    await createRuleExecution(newExecution);
  }

  return {
    data,
    isFormOpen,
    openForm: () => setIsFormOpen(true),
    closeForm: () => setIsFormOpen(false),
    parseFile,
    mapRowToDto,
    getRuleJson,
    prepareFileMapping,
    saveConfirmedFile,
    createNewRuleExecution
  };
}
