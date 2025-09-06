import { RuleExecutionDataTable } from "./components/DataTable";
import { NativeFilesForm } from "./components/NativeFilesForm";
import { columns } from "./components/Columns";
import { useRuleExecutions } from "./hooks/useRuleExcecutions";
import { SecondaryColors } from "@/helpers/colors";

export default function RuleExcutions() {
  const { data, isFormOpen, openForm, closeForm } = useRuleExecutions();
  return (
    <div
      className="rounded-lg py-1 px-4"
      style={{ background: SecondaryColors.background_3 }}
    >
      <div
        className="text-4xl font-bold mb-4 mt-4"
        style={{ color: SecondaryColors.dark_gray }}
      >
        Archivos
      </div>
      {isFormOpen ? (
        <NativeFilesForm onSubmit={openForm} onCancel={closeForm} />
      ) : (
        <>
          <RuleExecutionDataTable
            columns={columns}
            data={data}
            onOpenForm={openForm}
          />
        </>
      )}
    </div>
  );
}
