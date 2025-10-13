import { ColumnDef } from "@tanstack/react-table";
import BusinessRule from "@/types/BusinessRuleDto";
import { Checkbox } from "@/components/ui/checkbox";

export const columns = (setRowSelection: React.Dispatch<React.SetStateAction<Record<string, boolean>>>): ColumnDef<BusinessRule>[] => [
  // Columna de selección
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
    cell: ({ row, table }) => (
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
  {
    accessorKey: "name",
    header: "Nombre",
  },
  // {
  //   accessorKey: "company",
  //   header: "Empresa",
  // },
  // {
  //   accessorKey: "status",
  //   header: "Status",
  // },
];
