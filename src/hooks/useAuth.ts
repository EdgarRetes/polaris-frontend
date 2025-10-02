// hooks/useAuth.ts
import { useState, useEffect } from "react";

export function useAuth() {
  // Estado de autenticación
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Inicializa a true si hay token al cargar el hook por primera vez
    return !!localStorage.getItem("token");
  });

  // Escucha cambios en localStorage (útil si tienes varias pestañas abiertas)
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Función para login: guarda token y actualiza estado
  const login = (token: string) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  // Función para logout: elimina token y actualiza estado
  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout };
}
