import { BusinessRulesDataTable } from "./components/DataTable";
import { BusinessRuleForm } from "./components/Form";
import { columns } from "./components/Columns";
import { useBusinessRules } from "./hooks/useBusinessRules";
import BusinessRule from "./types/BusinessRuleDto";
import { Button } from "@/components/ui/button";
import { SecondaryColors } from "@/helpers/colors";

const initialData: BusinessRule[] = [
  { id: 1, name: "Mappeo PEMEX", status: "Activa", company: "Pemex" },
  { id: 2, name: "Mappeo OXXO", status: "Borrador", company: "Oxxo" },
];

export default function BusinessRules() {
  const { data, isFormOpen, openForm, closeForm, addRule } =
    useBusinessRules(initialData);
    // prueba pr2

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
        <BusinessRuleForm onSubmit={addRule} onCancel={closeForm} />
      ) : (
        <>
          <BusinessRulesDataTable
            columns={columns}
            data={data}
            onOpenForm={openForm}
          />
        </>
      )}
    </div>
  );
}
