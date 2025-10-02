// src/pages/Users/index.tsx
import React, { useState } from "react";
import { useUsers } from "./hooks/useUsers";
import { SecondaryColors, PrimaryColors } from "@/helpers/colors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/*
  UI text in Spanish per your request.
  This component shows a simple list and an inline edit modal.
*/

export default function UsersPage() {
  const { data: users, loading, error, refresh, removeUser, updateUser } = useUsers();
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<{ firstName?: string; lastName1?: string; email?: string }>({});

  const startEdit = (u: any) => {
    setEditing(u);
    // try to fill sensible fields depending on backend shape
    setForm({
      firstName: u.firstName ?? u.name ?? "",
      lastName1: u.lastName1 ?? "",
      email: u.email ?? "",
    });
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm({});
  };

  const saveEdit = async () => {
    if (!editing) return;
    // Build payload — adapt to your backend fields
    const payload: any = {};
    if (form.firstName !== undefined) payload.firstName = form.firstName;
    if (form.lastName1 !== undefined) payload.lastName1 = form.lastName1;
    if (form.email !== undefined) payload.email = form.email;

    await updateUser(editing.id, payload);
    setEditing(null);
    setForm({});
  };

  if (loading) return <div className="p-4">Cargando usuarios...</div>;
  if (error) return (
    <div className="p-4 text-red-600">
      {error} <button onClick={refresh} className="ml-2 underline">Reintentar</button>
    </div>
  );

  return (
    <div className="rounded-lg py-1 px-4" style={{ background: SecondaryColors.background_3 }}>
      <div className="text-4xl font-bold mb-4 mt-4" style={{ color: SecondaryColors.dark_gray }}>
        Usuarios
      </div>

      {editing ? (
        <div className="p-4 mb-4 bg-white rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-3">Editar usuario</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm mb-1">Nombre</label>
              <Input value={form.firstName} onChange={(e: any) => setForm((s) => ({ ...s, firstName: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm mb-1">Apellido</label>
              <Input value={form.lastName1} onChange={(e: any) => setForm((s) => ({ ...s, lastName1: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm mb-1">Correo</label>
              <Input value={form.email} onChange={(e: any) => setForm((s) => ({ ...s, email: e.target.value }))} />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={cancelEdit} style={{ background: SecondaryColors.content_4 }}>Cancelar</Button>
            <Button onClick={saveEdit} style={{ background: PrimaryColors.red, color: SecondaryColors.background_3 }}>Guardar</Button>
          </div>
        </div>
      ) : null}

      <div className="space-y-3">
        {users.length === 0 ? (
          <div className="p-4 bg-white rounded shadow-sm">No hay usuarios registrados.</div>
        ) : users.map((u: any) => (
          <div key={u.id} className="flex items-center justify-between p-4 rounded-lg shadow-sm" style={{ background: SecondaryColors.background_2 }}>
            <div>
              <div className="font-semibold" style={{ color: SecondaryColors.dark_gray }}>
                {u.firstName ?? u.name ?? "(sin nombre)"}
              </div>
              <div style={{ color: SecondaryColors.content_2 }}>{u.email}</div>
              <div style={{ color: SecondaryColors.content_2 }}>{u.role ?? u.roleId ?? ""}</div>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => startEdit(u)} style={{ background: SecondaryColors.dark_gray, color: SecondaryColors.background_3 }}>Editar</Button>
              <Button onClick={() => { if (confirm("¿Borrar usuario?")) removeUser(u.id); }} style={{ background: PrimaryColors.red, color: SecondaryColors.background_3 }}>Borrar</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
