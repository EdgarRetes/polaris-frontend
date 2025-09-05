import { ColumnDef } from "@tanstack/react-table"
import BusinessRule from "../types/BusinessRuleDto"

export const columns: ColumnDef<BusinessRule>[] = [
    {
        accessorKey: "name",
        header: "Nombre",
    },
    {
        accessorKey: "company",
        header: "Empresa",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
]