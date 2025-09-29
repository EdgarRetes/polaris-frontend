import { BusinessRulesDataTable } from "./components/DataTable";
import { BusinessRuleForm } from "./components/Form";
import { columns } from "./components/Columns";
import { useBusinessRules } from "./hooks/useBusinessRules";
import { SecondaryColors } from "@/helpers/colors";


export default function BusinessRules() {
  const { data, isFormOpen, openForm, closeForm, removeBusinessRule } =
    useBusinessRules();

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
      ) : (
        <>
          <BusinessRulesDataTable
            columns={columns}
            data={data}
            onOpenForm={openForm}
            onDelete={removeBusinessRule}
          />
        </>
      )}
    </div>
  );
}
