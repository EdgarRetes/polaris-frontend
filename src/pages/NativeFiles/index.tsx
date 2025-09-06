import { NativeFilesDataTable } from "./components/DataTable";
import { NativeFilesForm } from "./components/NativeFilesForm";
import { columns } from "./components/Columns";
import { useNativeFiles } from "./hooks/useNativeFiles";
import { SecondaryColors } from "@/helpers/colors";

export default function NativeFiles() {
  const { data, isFormOpen, openForm, closeForm } = useNativeFiles();
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
          <NativeFilesDataTable
            columns={columns}
            data={data}
            onOpenForm={openForm}
          />
        </>
      )}
    </div>
  );
}
