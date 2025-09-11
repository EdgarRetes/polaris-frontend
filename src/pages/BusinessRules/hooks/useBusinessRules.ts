import { useState, useEffect } from "react";
import BusinessRule from "@/types/BusinessRuleDto";
import { createBusinessRule, getBusinessRules } from "@/services/businessRulesService";
import { uploadAndParseFile } from "@/services/fileParsersService"
import { uploadFileToOpenAI, mapPaymentFileToJSON, PaymentMapping, getJSONValues} from "@/services/openAiService";

export function useBusinessRules(initialData: BusinessRule[] = []) {
  const [data, setData] = useState<BusinessRule[]>(initialData);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const rules = await getBusinessRules();
        setData(rules);
      } catch (err) {
        console.error("Error fetching rules:", err);
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
      return parsedData ?? [];
    } catch (error) {
      console.error("Error parseando el archivo:", error);
      return [];
    }
  }

  const getAIJsonFromFile = async (parsedData: any): Promise<PaymentMapping[] | null> => {
    setLoading(true);
    try {
      // const fileId = await uploadFileToOpenAI(file);
      const jsonResult = await mapPaymentFileToJSON(parsedData);

      return jsonResult;
    } catch (err) {
      console.error("Error procesando archivo con OpenAI:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };


  const addBusinessRule = async (rule: Partial<BusinessRule>) => {
    setLoading(true);
    try {
      const created = await createBusinessRule(rule);
      setData((prev) => [...prev, created]);
      setIsFormOpen(false);
    } catch (err) {
      console.error("Error creating rule:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    isFormOpen,
    openForm: () => setIsFormOpen(true),
    closeForm: () => setIsFormOpen(false),
    addBusinessRule,
    getAIJsonFromFile,
    parseFile
  };
}
