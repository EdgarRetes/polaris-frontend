import axios from "axios";
import AuditLog from "../types/AuditLogDto";

import { API_BASE_URL } from "@/helpers/backend";

export const getAuditLogs = async (): Promise<AuditLog[]> => {
  const response = await axios.get(`${API_BASE_URL}/audit`);
  return response.data;
};
