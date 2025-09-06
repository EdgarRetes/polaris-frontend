import axios from "axios";
import RuleExecution from "../types/RuleExecutionDto";

import { API_BASE_URL } from "@/helpers/backend";

export const getRuleExecution = async (): Promise<RuleExecution[]> => {
  const response = await axios.get(`${API_BASE_URL}/file-executions`);
  return response.data;
};

export const createRuleExecution = async (rule: Partial<RuleExecution>) => {
  const response = await axios.post(`${API_BASE_URL}/file-executions`, rule);
  return response.data;
};
