import { ColumnDef } from "@tanstack/react-table";
import RuleExecutions from "@/types/RuleExecutionDto";

export type RuleExecutionWithFile = RuleExecutions & {
  file: {
    name?: string;
  };
};

export const columns: ColumnDef<RuleExecutionWithFile>[] = [
  {
    id: "fileName",
    header: "Archivo",
    accessorFn: (row) => row.file.name?.trim() || `Archivo #${row.fileId}`,
  },
  {
    accessorKey: "rule.name",
    id: "ruleName",
    header: "Regla",
  },
];
