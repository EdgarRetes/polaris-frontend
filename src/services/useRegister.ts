// services/useRegister.ts
import { useState } from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_BACKEND_URL;

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (data: any, onSuccess?: () => void) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await axios.post(`${apiUrl}/auth/register`, {
        ...data,
        middleName: data.middleName || undefined,
        lastName2: data.lastName2 || undefined,
      });

      setSuccess("Registro exitoso. Ahora inicia sesión.");
      onSuccess?.(); // call callback if provided
    } catch (err: any) {
      setError(err.response?.data?.message || "Registro fallido");
    } finally {
      setLoading(false);
    }
  };

  return { handleRegister, loading, error, success };
}
