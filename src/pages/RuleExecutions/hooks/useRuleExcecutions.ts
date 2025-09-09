import { useState, useEffect } from "react";
import NativeFile from "../types/NativeFileDto";
import RuleExecution from "../types/RuleExecutionDto";
import PaymentRowDto from "../types/PaymentRow";
import LayoutValue from "../types/LayoutValueDto";
import BusinessRule from "../../BusinessRules/types/BusinessRuleDto"
import { createRuleExecution, getRuleExecution } from "../services/ruleExecutionsService";
import { getLayoutFields } from "@/services/layoutFieldsService"
import { createNativeFile } from "../services/nativeFilesService"
import { createLayoutValue } from "../services/layoutValuesService"
import { parseCSV } from "../helpers/parserCsv"
import { parseXML } from "../helpers/parserXml"
import { getBusinessRuleById } from "../../BusinessRules/services/businessRulesService"
// import { uploadFileToOpenAI, mapPaymentFileToJSON, PaymentMapping } from "../services/openAiService";

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

    switch (ext) {
      case "csv":
        return parseCSV(file);
      case "xml":
        return parseXML(file);
      default:
        throw new Error("Tipo de archivo no soportado");
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

  const createNewNativeFile = async (name: string, company: string, mappedData: any[], ruleJson: any[], userId: number) => {
    const newFile: Partial<NativeFile> = { name, company };
    const responseFile = await createNativeFile(newFile);

    const responseFields = await getLayoutFields();
    
    for (const field of responseFields) {
      // Buscar en ruleJson el objeto que tiene idCode que coincide con el nombre del LayoutField
      const ruleFieldEntry = Object.entries(ruleJson[0]).find(
        ([key, val]) => key === field.name
      );
      if (!ruleFieldEntry) continue;

      const [idCode, mappedFieldName] = ruleFieldEntry;
      // mappedFieldName: el nombre que aparece en mappedData.key

      for (const row of mappedData) {
        const dataEntry = row.find((d: any) => d.key === mappedFieldName);
        if (!dataEntry) continue;

        const valueToCreate: Partial<LayoutValue> = {
          fileId: responseFile.id,
          fieldId: field.id,
          value: String(dataEntry.value),
        };
        console.log("Valor a crear:", valueToCreate);
        await createLayoutValue(valueToCreate);
      }
    }

    return responseFile;
  }

  const createNewRuleExecution = async (fileId: number, ruleId: number) => {

    const newExecution: Partial<RuleExecution> = { fileId, ruleId};
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
    // addNativeFile,
    // getAIJsonFromFile
  };
}
