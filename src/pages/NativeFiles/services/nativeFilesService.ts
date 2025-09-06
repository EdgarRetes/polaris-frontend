import axios from "axios";
import NativeFile from "../types/NativeFileDto";

import { API_BASE_URL } from "@/helpers/backend";

export const getNativeFiles = async (): Promise<NativeFile[]> => {
  const response = await axios.get(`${API_BASE_URL}/native-files`);
  return response.data;
};

export const createNativeFile = async (rule: Partial<NativeFile>) => {
  const response = await axios.post(`${API_BASE_URL}/native-files`, rule);
  return response.data;
};
