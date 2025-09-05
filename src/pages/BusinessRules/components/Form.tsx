import React, { useState } from "react";
import BusinessRule from "../types/BusinessRuleDto";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  PrimaryColors,
  SecondaryColors,
  AdditionalColors,
} from "@/helpers/colors";
import { useBusinessRules } from "../hooks/useBusinessRules";

interface BusinessRuleFormProps {
  onSubmit: (rule: BusinessRule) => void;
  onCancel: () => void;
}

export const BusinessRuleForm: React.FC<BusinessRuleFormProps> = ({
  onSubmit,
  onCancel
}) => {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState<BusinessRule["status"]>("Activa");

  const handleSubmit = () => {
    if (!name.trim() || !company.trim()) return;
    onSubmit({ id: Date.now(), name, company, status });
    setName("");
    setCompany("");
    setStatus("Activa");
  };

  return (
    <div
      className="p-6 rounded-lg shadow-sm bg-white space-y-4"
      style={{ background: SecondaryColors.background_3 }}
    >
      <h2
        className="text-xl font-semibold"
        style={{ color: SecondaryColors.dark_gray }}
      >
        Crear Nueva Regla
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          className="border-0"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ background: SecondaryColors.background_2 }}
        />
        <Input
          className="border-0"
          placeholder="Compañía"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          style={{ background: SecondaryColors.background_2 }}
        />
        <select
          className="rounded px-3 py-2 w-full border-0"
          value={status}
          onChange={(e) => setStatus(e.target.value as BusinessRule["status"])}
          style={{ background: SecondaryColors.background_2 }}
        >
          <option value="Activa">Activa</option>
          <option value="Borrador">Borrador</option>
          <option value="Inactiva">Inactiva</option>
        </select>
      </div>

      <div>
        <Input
          className="border-0"
          placeholder='Para la compañía "A" el mappeo de los campos es...'
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{ background: SecondaryColors.background_2 }}
        />
      </div>

      <div className="flex justify-end gap-x-2">
        <Button onClick={onCancel} className="font-semibold"style={{ background: SecondaryColors.content_4 }}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} className="font-semibold" style={{ background: PrimaryColors.red, color: SecondaryColors.background_3 }}>
          Crear
        </Button>
      </div>
    </div>
  );
};
