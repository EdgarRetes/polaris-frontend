import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import User from "@/types/UserDto";
import { useUsers } from "../hooks/useUsers";
import { PrimaryColors, SecondaryColors } from "@/helpers/colors";

interface UserDetailsProps {
  user: User;
  onClose: () => void;
}

export const UserDetails: React.FC<UserDetailsProps> = ({ user, onClose }) => {
  const { updateUserData, openDetails, closeDetails } = useUsers();
  const [editedName, setEditedName] = useState(user.name);
  const [editedEmail, setEditedEmail] = useState(user.email);
  const [editedRole, setEditedRole] = useState(user.role);
  const [isChanged, setIsChanged] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    openDetails();
    return () => closeDetails();
  }, [openDetails, closeDetails]);

  useEffect(() => {
    setIsChanged(
      editedName !== user.name ||
      editedEmail !== user.email ||
      editedRole !== user.role
    );
  }, [editedName, editedEmail, editedRole, user]);

  const handleSave = async () => {
    setSaving(true);
    await updateUserData(user.id, {
      name: editedName,
      email: editedEmail,
      role: editedRole,
    });
    setIsChanged(false);
    setSaving(false);
  };

  return (
    <div className="p-6 rounded-lg shadow-md space-y-4" style={{ background: SecondaryColors.background_2 }}>
      <div className="flex justify-between items-center">
        <h2 style={{ color: SecondaryColors.dark_gray }} className="text-xl font-semibold">
          Detalles del usuario
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <p className="font-bold" style={{ color: SecondaryColors.dark_gray }}>Nombre:</p>
          <Input value={editedName} onChange={(e) => setEditedName(e.target.value)} style={{ background: SecondaryColors.background_3 }} />
        </div>
        <div className="flex flex-col">
          <p className="font-bold" style={{ color: SecondaryColors.dark_gray }}>Email:</p>
          <Input value={editedEmail} onChange={(e) => setEditedEmail(e.target.value)} style={{ background: SecondaryColors.background_3 }} />
        </div>
        <div className="flex flex-col">
          <p className="font-bold" style={{ color: SecondaryColors.dark_gray }}>Rol:</p>
          <Input value={editedRole} onChange={(e) => setEditedRole(e.target.value)} style={{ background: SecondaryColors.background_3 }} />
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button onClick={() => { closeDetails(); onClose(); }} style={{ background: PrimaryColors.red, color: SecondaryColors.background_3 }}>
          Cerrar
        </Button>
        <Button onClick={handleSave} disabled={!isChanged || saving} style={{ background: isChanged ? SecondaryColors.dark_gray : Secon_
