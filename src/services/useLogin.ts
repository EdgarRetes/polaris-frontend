import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

export const useLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${apiUrl}/auth/login`, { email, password });
      login(res.data.access_token);
      navigate("/", { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || "Login fallido");
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, loading, error };
};
