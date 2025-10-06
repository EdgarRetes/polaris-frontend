// src/pages/Users/hooks/useUsers.ts
import { useState, useEffect, useCallback } from "react";
import * as userService from "@/services/usersService";

/**
 * Public type exported as `User` so other files can import it
 * Fields are permissive to match various backend shapes.
 * All UI text/in-app strings remain in Spanish elsewhere.
 */
export type User = {
  id: number;
  firstName?: string | null;
  middleName?: string | null;
  lastName1?: string | null;
  lastName2?: string | null;
  email?: string | null;
  role?: string | null;
  [key: string]: any;
};

export function useUsers() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const users = await userService.getUsers();
      setData(Array.isArray(users) ? users : []);
    } catch (err: any) {
      console.error("Error fetching users:", err);
      if (err?.response?.status === 401) setError("No autorizado. Revisa tu sesión.");
      else if (err?.response?.status === 403) setError("Acceso denegado.");
      else setError(err?.message || "Error cargando usuarios");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const refresh = useCallback(() => {
    fetch();
  }, [fetch]);

  const removeUser = useCallback(
    async (id: number | string) => {
      setLoading(true);
      try {
        await userService.deleteUser(id);
        setData((prev) => prev.filter((u) => u.id !== Number(id)));
      } catch (err: any) {
        console.error("Error deleting user:", err);
        setError("Error borrando usuario");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateUser = useCallback(
    async (id: number | string, payload: Partial<User>) => {
      setLoading(true);
      try {
        const updated = await userService.updateUser(id, payload);
        setData((prev) => prev.map((u) => (u.id === Number(id) ? updated : u)));
        return updated;
      } catch (err: any) {
        console.error("Error updating user:", err);
        setError("Error actualizando usuario");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createUser = useCallback(
    async (payload: Partial<User & { password?: string }>) => {
      setLoading(true);
      try {
        const created = await userService.createUser(payload);
        setData((prev) => [...prev, created]);
        return created;
      } catch (err: any) {
        console.error("Error creating user:", err);
        setError("Error creando usuario");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { data, loading, error, refresh, removeUser, updateUser, createUser };
}
