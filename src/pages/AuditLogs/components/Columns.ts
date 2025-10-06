import { ColumnDef } from "@tanstack/react-table";
import AuditLog from "@/types/AuditLogDto";

export const columns: ColumnDef<AuditLog>[] = [
  {
    accessorKey: "entityName",
    header: "Entidad",
  },
  {
    accessorKey: "recordId",
    header: "Registro ID",
  },
  {
    accessorKey: "action",
    header: "Acción",
  },
  {
    accessorFn: (row) => new Date(row.createdAt).toLocaleString(),
    id: "createdAt",
    header: "Fecha",
  },
  {
    accessorFn: (row) =>
      row.userId ? `Usuario #${row.userId}` : "Sistema",
    id: "userId",
    header: "Usuario",
  },
];
