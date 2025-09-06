import { useState, useEffect } from "react";
import NativeFile from "../types/NativeFileDto";
import RuleExecution from "../types/RuleExecutionDto";
import { createRuleExecution, getRuleExecution } from "../services/ruleExecutionsService";
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
        console.error("Error fetching rules:", err);
      }
    };
    fetchRules();
  }, []);

  const closeForm = () => {
    setIsFormOpen(false);
  }

//   const getAIJsonFromFile = async (file: File): Promise<PaymentMapping[] | null> => {
//     setLoading(true);
//     try {
//       const fileId = await uploadFileToOpenAI(file);
//       const jsonResult = await mapPaymentFileToJSON(fileId);

//       return jsonResult;
//     } catch (err) {
//       console.error("Error procesando archivo con OpenAI:", err);
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   };


  // const addNativeFile = async (rule: Partial<NativeFile>) => {
  //   setLoading(true);
  //   try {
  //     const created = await createRuleExecution(rule);
  //     setData((prev) => [...prev, created]);
  //     setIsFormOpen(false);
  //   } catch (err) {
  //     console.error("Error creating rule:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return {
    data,
    isFormOpen,
    openForm: () => setIsFormOpen(true),
    closeForm: () => setIsFormOpen(false),
    // addNativeFile,
    // getAIJsonFromFile
  };
}
