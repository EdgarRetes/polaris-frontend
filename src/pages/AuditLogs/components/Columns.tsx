import { ColumnDef } from "@tanstack/react-table";
import AuditLog from "@/types/AuditLogDto";
import { AdditionalColors } from "@/helpers/colors";

type ChangeItem = { key: string; before: any; after: any; type: "created" | "deleted" | "updated" }[];

export const columns: ColumnDef<AuditLog>[] = [
  { accessorKey: "entityName", header: "Entidad" },
  { accessorKey: "recordId", header: "Registro ID" },
  { accessorKey: "action", header: "Acción" },
  { accessorFn: (row) => new Date(row.createdAt).toLocaleString(), id: "createdAt", header: "Fecha" },
  { accessorFn: (row) => (row.userId ? `Usuario #${row.userId}` : "Sistema"), id: "userId", header: "Usuario" },

  {
    id: "changes",
    header: "Cambio",
    accessorFn: (row): ChangeItem => {
      const changes: ChangeItem = [];

      // CREACIÓN
      if (!row.before && row.after) {
        Object.keys(row.after).filter(k => k !== "updatedAt").forEach(key => {
          const afterVal = row.after?.[key];
          if (key === "definition" && typeof afterVal === "object") {
            Object.keys(afterVal).forEach(subKey => {
              changes.push({ key: subKey, before: null, after: afterVal[subKey], type: "created" });
            });
          } else {
            changes.push({ key, before: null, after: afterVal, type: "created" });
          }
        });
      }

      // ELIMINACIÓN
      if (row.before && !row.after) {
        Object.keys(row.before).filter(k => k !== "updatedAt").forEach(key => {
          const beforeVal = row.before?.[key];
          if (key === "definition" && typeof beforeVal === "object") {
            Object.keys(beforeVal).forEach(subKey => {
              changes.push({ key: subKey, before: beforeVal[subKey], after: null, type: "deleted" });
            });
          } else {
            changes.push({ key, before: beforeVal, after: null, type: "deleted" });
          }
        });
      }

      // ACTUALIZACIÓN
      if (row.before && row.after) {
        Object.keys(row.after).filter(k => k !== "updatedAt").forEach(key => {
          const beforeVal = row.before?.[key];
          const afterVal = row.after?.[key];

          if (JSON.stringify(beforeVal) !== JSON.stringify(afterVal)) {
            if (key === "definition" && typeof beforeVal === "object") {
              Object.keys(afterVal ?? {}).forEach(subKey => {
                if (JSON.stringify(beforeVal[subKey]) !== JSON.stringify(afterVal?.[subKey])) {
                  changes.push({
                    key: subKey,
                    before: beforeVal[subKey],
                    after: afterVal?.[subKey],
                    type: "updated",
                  });
                }
              });
            } else {
              changes.push({ key, before: beforeVal, after: afterVal, type: "updated" });
            }
          }
        });
      }

      return changes;
    },
    cell: ({ getValue }) => {
      const diffs = getValue() as ChangeItem;
      if (!diffs.length) return <span>Sin cambios</span>;

      return (
        <div className="flex flex-col gap-1">
          {diffs.map(diff => {
            let color = AdditionalColors.success; // creación
            if (diff.type === "deleted") color = AdditionalColors.alerts;
            else if (diff.type === "updated") color = AdditionalColors.warnings;

            return (
              <div key={diff.key}>
                <span style={{ color }}>{diff.key}: </span>
                <span style={{ fontWeight: "bold" }}>{diff.before ?? ""}</span>
                {diff.type === "updated" && <span> → </span>}
                <span style={{ fontWeight: "bold" }}>{diff.after ?? ""}</span>
              </div>
            );
          })}
        </div>
      );
    },
  },
];
