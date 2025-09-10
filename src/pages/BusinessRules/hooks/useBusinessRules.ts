import { useState, useEffect } from "react";
import BusinessRule from "@/types/BusinessRuleDto";
import { createBusinessRule, getBusinessRules } from "@/services/businessRulesService";
import { uploadFileToOpenAI, mapPaymentFileToJSON, PaymentMapping } from "@/services/openAiService";

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

  const getAIJsonFromFile = async (file: File): Promise<PaymentMapping[] | null> => {
    setLoading(true);
    try {
      const fileId = await uploadFileToOpenAI(file);
      const jsonResult = await mapPaymentFileToJSON(fileId);

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
    getAIJsonFromFile
  };
}
