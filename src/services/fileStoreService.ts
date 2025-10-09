import axios from "axios";
import { API_BASE_URL } from "@/helpers/backend";
import RuleExecution from "@/types/RuleExecutionDto";

export type StoredFile = {
  id: string;
  file: File;
  execution?: RuleExecution;
};

/**
 * Subir un archivo al backend junto con su execution
 */
export const uploadFile = async (file: File, execution?: RuleExecution) => {
  const formData = new FormData();
  formData.append("file", file);
  if (execution) {
    formData.append("execution", JSON.stringify(execution));
  }

  const response = await axios.post(`${API_BASE_URL}/file-store/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

/**
 * Obtener todos los archivos en el FileStore
 */
export const getFiles = async (): Promise<StoredFile[]> => {
  const response = await axios.get(`${API_BASE_URL}/file-store`);
  return response.data;
};

/**
 * Eliminar un archivo del FileStore por nombre original
 */
export const removeFile = async (id: string) => {
  const response = await axios.delete(`${API_BASE_URL}/file-store/${id}`);
  return response.data;
};
