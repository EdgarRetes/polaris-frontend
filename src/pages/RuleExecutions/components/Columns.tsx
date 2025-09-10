import { ColumnDef } from "@tanstack/react-table";
import RuleExecutions from "@/types/RuleExecutionDto";

export const columns: ColumnDef<RuleExecutions>[] = [
  {
    accessorKey: "fileId",
    header: "Archivo",
  },
  {
    accessorKey: "ruleId",
    header: "Regla",
  },
];
