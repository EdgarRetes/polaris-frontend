import { useState } from "react";
import BusinessRule from "../types/BusinessRuleDto";

export function useBusinessRules(initialData: BusinessRule[]) {
  const [data, setData] = useState<BusinessRule[]>(initialData);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const addRule = (rule: BusinessRule) => {
    setData((prev) => [...prev, rule]);
    setIsFormOpen(false);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  }

  return {
    data,
    isFormOpen,
    openForm: () => setIsFormOpen(true),
    closeForm: () => setIsFormOpen(false),
    addRule,
  };
}
