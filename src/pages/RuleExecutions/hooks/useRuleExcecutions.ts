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

  const createNewNativeFile = async (
    name: string,
    company: string,
    mappedData: any[],
    ruleJson: any[] | null,
    userId: number
  ) => {
    // Crear el archivo
    const newFile: Partial<NativeFile> = { name, company };
    const responseFile = await createNativeFile(newFile);

    // Traer los campos esperados
    const responseFields = await getLayoutFields();

    if (ruleJson && ruleJson.length > 0) {
      // --- Caso con reglas ---
      for (const field of responseFields) {
        const ruleFieldEntry = Object.entries(ruleJson[0]).find(
          ([key, val]) => key === field.name
        );
        if (!ruleFieldEntry) continue;

        const [, mappedFieldName] = ruleFieldEntry;

        for (const [rowIndex, row] of mappedData.entries()) {
          const dataEntry = row.find((d: any) => d.key === mappedFieldName);
          if (!dataEntry) continue;

          const valueToCreate: Partial<LayoutValue> = {
            fileId: responseFile.id,
            fieldId: field.id,
            value: String(dataEntry.value),
            row: rowIndex + 1,
          };

          await createLayoutValue(valueToCreate);
        }
      }
    } else {
      // --- Caso sin regla: usar LLM para mapear los keys de mappedData a responseFields ---
      for (const [rowIndex, row] of mappedData.entries()) {
        const mapping: Record<string, string> = await mapRowWithLLM(row, responseFields);
        // mapping = { responseFieldName: keyEnMappedData }

        for (const field of responseFields) {
          const mappedKey = mapping[field.name];
          const value = row[mappedKey];
          if (value === undefined) continue;

          const valueToCreate: Partial<LayoutValue> = {
            fileId: responseFile.id,
            fieldId: field.id,
            value: String(value),
            row: rowIndex + 1,
          };

          await createLayoutValue(valueToCreate);
        }
      }
    }

    return responseFile;
  };

  const createNewRuleExecution = async (fileId: number, ruleId?: number) => {

    const newExecution: Partial<RuleExecution> = { fileId, ruleId };
    const response = await createRuleExecution(newExecution);

    return;
  }

  return {
    data,
    isFormOpen,
    openForm: () => setIsFormOpen(true),
    closeForm: () => setIsFormOpen(false),
    parseFile,
    mapRowToDto,
    getRuleJson,
    createNewNativeFile,
    createNewRuleExecution
  };
}
