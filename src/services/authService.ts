import axios from "axios";

const API_URL = "http://localhost:3000"; // backend URL

export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/login`, { email, password });
  return response.data; // { access_token: "..." }
};

export const register = async (userData: {
  firstName: string;
  lastName1: string;
  email: string;
  password: string;
}) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  return response.data;
};
