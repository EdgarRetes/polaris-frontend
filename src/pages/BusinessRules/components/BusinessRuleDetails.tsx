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
  const { updateRule, openDetails, closeDetails } = useBusinessRules();

  const [editedName, setEditedName] = useState(rule.name || "");
  const [editedCompany, setEditedCompany] = useState(rule.company || "");
  // Cambia el tipo inicial a objeto vacío si definition no es un array
  const [editedDefinition, setEditedDefinition] = useState<Record<string, any>>(
    rule.definition || {}
  );

  const [isChanged, setIsChanged] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    openDetails();
    return () => {
      closeDetails();
    };
  }, [openDetails, closeDetails]);

  useEffect(() => {
    const changedName = editedName !== (rule.name || "");
    const changedCompany = editedCompany !== (rule.company || "");
    const changedDefinition =
      JSON.stringify(editedDefinition) !==
      JSON.stringify(rule.definition || {});
    setIsChanged(changedName || changedCompany || changedDefinition);
  }, [
    editedName,
    editedCompany,
    editedDefinition,
    rule.name,
    rule.company,
    rule.definition,
  ]);

  const handleDefinitionChange = (key: string, value: any) => {
    setEditedDefinition({
      ...editedDefinition,
      [key]: value,
    });
  };

  const handleSave = async () => {
    setSaving(true);
    await updateRule(rule.id, {
      name: editedName,
      // company: editedCompany,
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
      <div className="flex justify-between items-center">
        <h2
          className="text-xl font-semibold"
          style={{ color: SecondaryColors.dark_gray }}
        >
          Detalles de la regla
        </h2>
        {/* <Button
          onClick={() => console.log("Exportar regla")}
          className="font-semibold"
          style={{
            background: SecondaryColors.dark_gray,
            color: SecondaryColors.background_3,
          }}
        >
          Exportar
        </Button> */}
      </div>

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
        {/* <div className="flex flex-col">
          <p className="font-bold" style={{ color: SecondaryColors.dark_gray }}>
            Empresa:
          </p>
          <Input
            className="border-0"
            value={editedCompany}
            onChange={(e) => setEditedCompany(e.target.value)}
            style={{ background: SecondaryColors.background_3 }}
          />
        </div> */}
      </div>

      {/* Campos dinámicos - itera sobre las claves del objeto */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {Object.entries(editedDefinition).map(([key, value]) => (
          <div key={key} className="flex flex-col">
            <p
              className="font-bold"
              style={{ color: SecondaryColors.dark_gray }}
            >
              {key}:
            </p>
            <Input
              className="border-0"
              value={String(value ?? "")}
              onChange={(e) =>
                handleDefinitionChange(key, e.target.value)
              }
              style={{ background: SecondaryColors.background_3 }}
            />
          </div>
        ))}
      </div>

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