import axios from "axios";
import { API_BASE_URL } from "@/helpers/backend";

export const uploadAndParseFile = async (file: File): Promise<any[]> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(`${API_BASE_URL}/file-parsers/parse`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
};
