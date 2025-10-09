import { ColumnDef } from "@tanstack/react-table";
import RuleExecutions from "@/types/RuleExecutionDto";
import { Badge } from "@/components/ui/badge";

export type RuleExecutionWithFile = RuleExecutions & {
  file: {
    name?: string;
  };
  executedAt?: Date | string;
};

// Map de estatus con traducción y color Tailwind
const statusMap: Record<string, { label: string; colorClass: string }> = {
  SUCCESS: { label: "Éxito", colorClass: "bg-green-600 text-white" },
  FAILED: { label: "Fallido", colorClass: "bg-red-500 text-white" },
  IN_PROGRESS: { label: "En progreso", colorClass: "bg-yellow-500 text-white" },
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
  {
    accessorKey: "status",
    id: "status",
    header: "Estatus",
    cell: ({ row }) => {
      const status = row.original.status ?? "UNKNOWN";
      const { label, colorClass } = statusMap[status] ?? {
        label: "Desconocido",
        colorClass: "bg-gray-400 text-white",
      };

      return <Badge className={colorClass}>{label}</Badge>;
    },
  },
  {
    accessorKey: "executedAt",
    id: "executedAt",
    header: "Fecha",
    cell: ({ row }) => {
      const date = row.original.executedAt;
      if (!date) return "—";
      
      const dateObj = typeof date === "string" ? new Date(date) : date;
      return new Intl.DateTimeFormat("es-MX", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(dateObj);
    },
    sortingFn: (rowA, rowB) => {
      const dateA = rowA.original.executedAt;
      const dateB = rowB.original.executedAt;
      
      if (!dateA && !dateB) return 0;
      if (!dateA) return 1;
      if (!dateB) return -1;
      
      const timeA = typeof dateA === "string" ? new Date(dateA).getTime() : dateA.getTime();
      const timeB = typeof dateB === "string" ? new Date(dateB).getTime() : dateB.getTime();
      
      return timeA - timeB;
    },
  },
];