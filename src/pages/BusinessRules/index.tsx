import { useState } from "react";
import { BusinessRulesDataTable } from "./components/DataTable";
import { BusinessRuleForm } from "./components/Form";
import { BusinessRuleDetails } from "./components/BusinessRuleDetails";
import { columns } from "./components/Columns";
import { useBusinessRules } from "./hooks/useBusinessRules";
import { SecondaryColors } from "@/helpers/colors";
import BusinessRule from "@/types/BusinessRuleDto";

export default function BusinessRules() {
  const {
    data,
    isFormOpen,
    isDetailsOpen,
    openForm,
    closeForm,
    removeBusinessRule,
    openDetails,
    closeDetails,
  } = useBusinessRules();

  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  // Estado para la regla seleccionada
  const [selectedRule, setSelectedRule] = useState<BusinessRule | null>(null);

  const handleRowClick = (ruleId: string | number) => {
    const rule = data.find((r) => r.id === ruleId);
    if (rule) {
      setSelectedRule(rule);
      openDetails(); 
    }
  };

  const handleCloseDetails = () => {
    setSelectedRule(null);
      closeDetails();
  };

  return (
    <div
      className="rounded-lg py-1 px-4"
      style={{ background: SecondaryColors.background_3 }}
    >
      <div
        className="text-4xl font-bold mb-4 mt-4"
        style={{ color: SecondaryColors.dark_gray }}
      >
        Reglas de Negocio
      </div>

      {isFormOpen ? (
        <BusinessRuleForm onSubmit={openForm} onCancel={closeForm} />
      ) : selectedRule ? (
        <BusinessRuleDetails rule={selectedRule} onClose={handleCloseDetails} />
      ) : (
        <BusinessRulesDataTable
          columns={columns(setRowSelection)}
          data={data}
          onOpenForm={openForm}
          onDelete={removeBusinessRule}
          onRowClick={handleRowClick}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
        />
      )}
    </div>
  );
}
