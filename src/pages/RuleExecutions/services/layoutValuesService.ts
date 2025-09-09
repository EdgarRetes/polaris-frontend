import axios from "axios";
import LayoutValue from "../types/LayoutValueDto";

import { API_BASE_URL } from "@/helpers/backend";

export const createLayoutValue = async (file: Partial<LayoutValue>) => {
  const response = await axios.post(`${API_BASE_URL}/layout-values`, file);
  return response.data;
};

export const getLayoutValueByFileId = async (fileId: number): Promise<LayoutValue[]> => {
  const response = await axios.get(`${API_BASE_URL}/layout-values/file/${fileId}`,);
  return response.data;
};
