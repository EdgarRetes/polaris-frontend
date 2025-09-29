import { useState } from "react";
import { RuleExecutionDataTable } from "./components/DataTable";
import { NativeFilesForm } from "./components/NativeFilesForm";
import { NativeFileDetails } from "./components/NativeFileDetails";
import { columns } from "./components/Columns";
import { useRuleExecutions } from "./hooks/useRuleExcecutions";
import { SecondaryColors } from "@/helpers/colors";
import RuleExecution from "@/types/RuleExecutionDto";
import NativeFile from "@/types/NativeFileDto";
import type { RuleExecutionWithFile } from "./components/Columns";

export default function RuleExcutions() {
  const { data, isFormOpen, openForm, closeForm } = useRuleExecutions();

  // Estado para el archivo seleccionado
  const [selectedFile, setSelectedFile] = useState<NativeFile | null>(null);

  const handleRowClick = (fileId: string) => {
    const execution = data.find((d) => d.fileId.toString() === fileId);
    if (execution) {
      const file: NativeFile = {
        id: execution.fileId,
        name: `${execution.fileId}`,
        // company: "N/A"
        // createdAt: new Date().toISOString(),
        // status: execution.status || "Pendiente",
      };
      setSelectedFile(file);
    }
  };

  const handleCloseDetails = () => {
    setSelectedFile(null);
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
        Archivos
      </div>

      {isFormOpen ? (
        <NativeFilesForm onSubmit={openForm} onCancel={closeForm} />
      ) : selectedFile ? (
        <NativeFileDetails
          fileId={selectedFile.id}
          onClose={handleCloseDetails}
        />
      ) : (
        <RuleExecutionDataTable<RuleExecutionWithFile, any>
          columns={columns}
          data={data as RuleExecutionWithFile[]}
          onOpenForm={openForm}
          onRowClick={handleRowClick}
        />
      )}
    </div>
  );
}
