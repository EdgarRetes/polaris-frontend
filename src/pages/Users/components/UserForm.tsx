// src/pages/Users/components/UserForm.tsx
import React, { useState } from "react";

interface Props {
  onSubmit: (data: {
    firstName: string;
    middleName?: string;
    lastName1: string;
    lastName2?: string;
    email: string;
    password: string;
  }) => void;
  onCancel?: () => void;
}

const UserForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName1, setLastName1] = useState("");
  const [lastName2, setLastName2] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }
    onSubmit({ firstName, middleName, lastName1, lastName2, email, password });
  };

  return (
    <form onSubmit={handle} className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <label className="block text-sm">Nombre</label>
        <input required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-3 py-2 border rounded" />
      </div>
      <div>
        <label className="block text-sm">Segundo nombre (opcional)</label>
        <input value={middleName} onChange={(e) => setMiddleName(e.target.value)} className="w-full px-3 py-2 border rounded" />
      </div>
      <div>
        <label className="block text-sm">Apellido</label>
        <input required value={lastName1} onChange={(e) => setLastName1(e.target.value)} className="w-full px-3 py-2 border rounded" />
      </div>
      <div>
        <label className="block text-sm">Segundo apellido (opcional)</label>
        <input value={lastName2} onChange={(e) => setLastName2(e.target.value)} className="w-full px-3 py-2 border rounded" />
      </div>
      <div>
        <label className="block text-sm">Correo</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded" />
      </div>
      <div>
        <label className="block text-sm">Contraseña</label>
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded" />
      </div>
      <div>
        <label className="block text-sm">Confirmar contraseña</label>
        <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full px-3 py-2 border rounded" />
      </div>

      <div className="flex gap-2 justify-end">
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded border">
            Cancelar
          </button>
        )}
        <button type="submit" className="px-4 py-2 rounded bg-red-600 text-white">
          Crear usuario
        </button>
      </div>
    </form>
  );
};

export default UserForm;
