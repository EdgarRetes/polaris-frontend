import axios from "axios";
import LayoutValue from "../types/LayoutValueDto";

import { API_BASE_URL } from "@/helpers/backend";

export const createLayoutValue = async (value: Partial<LayoutValue>) => {
  const response = await axios.post(`${API_BASE_URL}/layout-values`, value);
  return response.data;
};

export const getLayoutValueByFileId = async (fileId: number): Promise<LayoutValue[]> => {
  const response = await axios.get(`${API_BASE_URL}/layout-values/file/${fileId}`,);
  return response.data;
};

export const saveLayoutValues = async (values: LayoutValue[]) => {
  const response = await axios.patch(`${API_BASE_URL}/layout-values/bulk`, values);
  return response.data;
};

export const validateLayout = async (fileId: number) => {
  const response = await axios.patch(`${API_BASE_URL}/layout-values/validate/${fileId}`);
  return response.data;
};



