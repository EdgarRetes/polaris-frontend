import { ColumnDef } from "@tanstack/react-table";
import AuditLog from "@/types/AuditLogDto";
import { AdditionalColors, PrimaryColors } from "@/helpers/colors";
import { act } from "react";

type ChangeItem = { key: string; before: any; after: any; type: "created" | "deleted" | "updated" }[];

export const columns: ColumnDef<AuditLog>[] = [
  { accessorKey: "entityName", header: "Entidad" },
  { accessorKey: "recordId", header: "Registro ID" },

  // Acción con color de fondo según tipo
  {
    accessorKey: "action",
    header: "Acción",
    cell: ({ row }) => {
      const action = row.original.action?.toUpperCase() ?? "";
      let bgColor = "";

      switch (action) {
        case "CREATE":
          bgColor = AdditionalColors.success; // verde
          break;
        case "DELETE":
          bgColor = PrimaryColors.red; // rojo
          break;
        case "UPDATE":
          bgColor = AdditionalColors.warnings; // amarillo
          break;
      }

      return (
        <span
          style={{
            backgroundColor: bgColor,
            padding: "2px 6px",
            borderRadius: 4,
            fontWeight: "bold",
          }}
        >
          {action}
        </span>
      );
    },
  },

  { accessorFn: (row) => new Date(row.createdAt).toLocaleString(), id: "createdAt", header: "Fecha" },
  { accessorFn: (row) => (row.userId ? `Usuario #${row.userId}` : "Sistema"), id: "userId", header: "Usuario" },

  // Cambios: solo mostrar diffs para "updated"
  {
    id: "changes",
    header: "Cambio",
    accessorFn: (row): ChangeItem => {
      const changes: ChangeItem = [];

      if (row.before && row.after) {
        Object.keys(row.after)
          .filter(k => k !== "updatedAt")
          .forEach(key => {
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
      if (!diffs.length) return null; // no mostrar nada si no hay updates

      return (
        <div className="flex flex-col gap-1">
          {diffs.map(diff => (
            <div key={diff.key}>
              <span>
                {diff.key}: {diff.before} → {diff.after}
              </span>
            </div>
          ))}
        </div>
      );
    },
  },
];
