// src/services/usersService.ts
import axios from "axios";

const apiUrl = import.meta.env.VITE_BACKEND_URL || "";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Try to GET users from the backend.
 * Will try /users first, if 404 then tries /auth/users.
 */
export async function getUsers(): Promise<any[]> {
  const urlsToTry = [`${apiUrl}/users`, `${apiUrl}/auth/users`];

  for (const url of urlsToTry) {
    try {
      const res = await axios.get(url, { headers: getAuthHeaders() });
      // success
      return res.data;
    } catch (err: any) {
      // If 401/403/500 -> rethrow so caller can handle auth/errors
      if (err?.response && err.response.status !== 404) {
        throw err;
      }
      // else if 404 try next url
    }
  }

  // If none matched
  throw new Error("No users endpoint available (tried /users and /auth/users)");
}

export async function createUser(payload: any): Promise<any> {
  const url = `${apiUrl}/users`;
  const res = await axios.post(url, payload, { headers: getAuthHeaders() });
  return res.data;
}

export async function updateUser(id: number | string, payload: any): Promise<any> {
  const url = `${apiUrl}/users/${id}`;
  const res = await axios.patch(url, payload, { headers: getAuthHeaders() });
  return res.data;
}

export async function deleteUser(id: number | string): Promise<boolean> {
  const url = `${apiUrl}/users/${id}`;
  const res = await axios.delete(url, { headers: getAuthHeaders() });
  return res.status >= 200 && res.status < 300;
}
