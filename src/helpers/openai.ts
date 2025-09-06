import axios from "axios";

export const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
export const OPENAI_BASE_URL = "https://api.openai.com/v1";

export const openAiClient = axios.create({
    baseURL: OPENAI_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
});
