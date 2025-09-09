import axios from "axios";
import LayoutField from "../pages/RuleExecutions/types/LayoutFieldDto";

import { API_BASE_URL } from "@/helpers/backend";

export const getLayoutFields = async (): Promise<LayoutField[]> => {
  const response = await axios.get(`${API_BASE_URL}/layout-fields`);
  return response.data;
};
