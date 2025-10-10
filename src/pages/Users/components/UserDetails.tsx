import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "../hooks/useUsers";
import { PrimaryColors, SecondaryColors } from "@/helpers/colors";

interface Props {
  user: User;
  onClose: () => void;
  onSave: (id: number, payload: Partial<User>) => Promise<any>;
}

const UserDetails: React.FC<Props> = ({ user, onClose, onSave }) => {
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [middleName, setMiddleName] = useState(user.middleName || "");
  const [lastName1, setLastName1] = useState(user.lastName1 || "");
  const [lastName2, setLastName2] = useState(user.lastName2 || "");
  const [email, setEmail] = useState(user.email || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(user.id, { firstName, middleName, lastName1, lastName2, email });
    setSaving(false);
    onClose();
  };

  return (
    <div className="p-6 rounded-lg shadow-md space-y-4" style={{ background: SecondaryColors.background_2 }}>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold" style={{ color: SecondaryColors.dark_gray }}>
          Detalles de usuario
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="font-bold" style={{ color: SecondaryColors.dark_gray }}>Nombre</p>
          <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </div>
        <div>
          <p className="font-bold" style={{ color: SecondaryColors.dark_gray }}>Segundo nombre</p>
          <Input value={middleName || ""} onChange={(e) => setMiddleName(e.target.value)} />
        </div>
        <div>
          <p className="font-bold" style={{ color: SecondaryColors.dark_gray }}>Apellido</p>
          <Input value={lastName1} onChange={(e) => setLastName1(e.target.value)} />
        </div>
        <div>
          <p className="font-bold" style={{ color: SecondaryColors.dark_gray }}>Segundo apellido</p>
          <Input value={lastName2 || ""} onChange={(e) => setLastName2(e.target.value)} />
        </div>
        <div>
          <p className="font-bold" style={{ color: SecondaryColors.dark_gray }}>Correo</p>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button onClick={onClose} className="font-semibold" style={{ background: PrimaryColors.red }}>Cerrar</Button>
        <Button onClick={handleSave} disabled={saving} className="font-semibold" style={{ background: SecondaryColors.dark_gray }}>
          {saving ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>
    </div>
  );
};

export default UserDetails;
