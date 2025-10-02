// src/pages/Users/components/Columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { User } from "../hooks/useUsers";

export const columns = (setRowSelection: React.Dispatch<React.SetStateAction<Record<string, boolean>>>): ColumnDef<User>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <div onClick={(e) => e.stopPropagation()}>
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => {
            const id = row.original.id.toString();
            setRowSelection({ [id]: !!value });
          }}
          aria-label="Select row"
        />
      </div>
    ),
  },
  { accessorKey: "firstName", header: "Nombre" },
  { accessorKey: "middleName", header: "Segundo nombre" },
  { accessorKey: "lastName1", header: "Apellido" },
  { accessorKey: "lastName2", header: "Segundo apellido" },
  { accessorKey: "email", header: "Correo" },
];
