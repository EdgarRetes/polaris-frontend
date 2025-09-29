import axios from "axios";
import BusinessRule from "../types/BusinessRuleDto";

import { API_BASE_URL } from "@/helpers/backend";

export const getBusinessRules = async (): Promise<BusinessRule[]> => {
  const response = await axios.get(`${API_BASE_URL}/business-rules`);
  return response.data;
};

export const getBusinessRuleById = async (businessRuleId: number): Promise<BusinessRule> => {
  const response = await axios.get(`${API_BASE_URL}/business-rules/${businessRuleId}`);
  return response.data;
};

export const createBusinessRule = async (rule: Partial<BusinessRule>) => {
  const response = await axios.post(`${API_BASE_URL}/business-rules`, rule);
  return response.data;
};

export const deleteBusinessRule = async (businessRuleId: string | number): Promise<boolean> => {
  try {
    await axios.delete(`${API_BASE_URL}/business-rules/${businessRuleId}`);
    return true;
  } catch (err) {
    console.error("Error deleting business rule:", err);
    return false;
  }
};

export const updateBusinessRule = async (id: number, rule: Partial<BusinessRule>) => {
  const response = await axios.patch(`${API_BASE_URL}/business-rules/${id}`, rule);
  return response.data;
};

