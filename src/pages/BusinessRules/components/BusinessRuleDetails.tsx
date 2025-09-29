import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SecondaryColors, PrimaryColors } from "@/helpers/colors";
import BusinessRule from "@/types/BusinessRuleDto";
import { useBusinessRules } from "../hooks/useBusinessRules";

interface BusinessRuleDetailsProps {
  rule: BusinessRule;
  onClose: () => void;
}

export const BusinessRuleDetails: React.FC<BusinessRuleDetailsProps> = ({
  rule,
  onClose,
}) => {
  const { updateRule, openDetails, closeDetails } = useBusinessRules(); // <--- aquí

  const [editedName, setEditedName] = useState(rule.name || "");
  const [editedCompany, setEditedCompany] = useState(rule.company || "");
  const [editedDefinition, setEditedDefinition] = useState(
    rule.definition || []
  );

  const [isChanged, setIsChanged] = useState(false);
  const [saving, setSaving] = useState(false);

  // Abrimos detalle al montar y cerramos al desmontar
  useEffect(() => {
    openDetails();
    return () => {
      closeDetails();
    };
  }, [openDetails, closeDetails]);

  // Detectar cambios en cualquier campo
  useEffect(() => {
    const changedName = editedName !== (rule.name || "");
    const changedCompany = editedCompany !== (rule.company || "");
    const changedDefinition =
      JSON.stringify(editedDefinition) !==
      JSON.stringify(rule.definition || []);
    setIsChanged(changedName || changedCompany || changedDefinition);
  }, [
    editedName,
    editedCompany,
    editedDefinition,
    rule.name,
    rule.company,
    rule.definition,
  ]);

  const handleDefinitionChange = (index: number, key: string, value: any) => {
    const newDef = [...editedDefinition];
    newDef[index] = { ...newDef[index], [key]: value };
    setEditedDefinition(newDef);
  };

  const handleSave = async () => {
    setSaving(true);
    await updateRule(rule.id, {
      name: editedName,
      company: editedCompany,
      definition: editedDefinition,
    });
    setIsChanged(false);
    setSaving(false);
  };

  if (!rule) return <p>No hay datos para mostrar</p>;

  return (
    <div
      className="p-6 rounded-lg shadow-md space-y-4"
      style={{ background: SecondaryColors.background_2 }}
    >
      {/* --- Título y botón de acción --- */}
      <div className="flex justify-between items-center">
        <h2
          className="text-xl font-semibold"
          style={{ color: SecondaryColors.dark_gray }}
        >
          Detalles de la regla
        </h2>
        <Button
          onClick={() => console.log("Exportar regla")}
          className="font-semibold"
          style={{
            background: SecondaryColors.dark_gray,
            color: SecondaryColors.background_3,
          }}
        >
          Exportar
        </Button>
      </div>

      {/* --- Información básica editable --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <p className="font-bold" style={{ color: SecondaryColors.dark_gray }}>
            Nombre:
          </p>
          <Input
            className="border-0"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            style={{ background: SecondaryColors.background_3 }}
          />
        </div>
        <div className="flex flex-col">
          <p className="font-bold" style={{ color: SecondaryColors.dark_gray }}>
            Empresa:
          </p>
          <Input
            className="border-0"
            value={editedCompany}
            onChange={(e) => setEditedCompany(e.target.value)}
            style={{ background: SecondaryColors.background_3 }}
          />
        </div>
      </div>

      {/* --- Campos dinámicos editables --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {editedDefinition.map((def, index) =>
          Object.entries(def).map(([key, value]) => (
            <div key={`${index}-${key}`} className="flex flex-col">
              <p
                className="font-bold"
                style={{ color: SecondaryColors.dark_gray }}
              >
                {key}:
              </p>
              <Input
                className="border-0"
                value={value ?? ""}
                onChange={(e) =>
                  handleDefinitionChange(index, key, e.target.value)
                }
                style={{ background: SecondaryColors.background_3 }}
              />
            </div>
          ))
        )}
      </div>

      {/* --- Botones --- */}
      <div className="flex justify-end gap-2 mt-4">
        <Button
          onClick={() => {
            closeDetails(); 
            onClose();
          }}
          className="font-semibold"
          style={{
            background: PrimaryColors.red,
            color: SecondaryColors.background_3,
          }}
        >
          Cerrar
        </Button>
        <Button
          onClick={handleSave}
          disabled={!isChanged || saving}
          className="font-semibold"
          style={{
            background: isChanged
              ? SecondaryColors.dark_gray
              : SecondaryColors.content_3,
            color: SecondaryColors.background_3,
          }}
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </Button>
      </div>
    </div>
  );
};

export default BusinessRuleDetails;
