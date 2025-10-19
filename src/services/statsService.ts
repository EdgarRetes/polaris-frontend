import axios from "axios";
import type { Stats } from "@/types/Stats";
import { API_BASE_URL } from "@/helpers/backend"; 

export const getStats = async (): Promise<Stats> => {
  try {
    const response = await axios.get<Stats>(`${API_BASE_URL}/stats`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching stats:", error);
    throw new Error(error?.response?.data?.message || "Failed to fetch stats");
  }
};
