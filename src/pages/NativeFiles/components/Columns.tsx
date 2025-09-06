import { ColumnDef } from "@tanstack/react-table"
import NativeFile from "../types/NativeFileDto"

export const columns: ColumnDef<NativeFile>[] = [
    {
        accessorKey: "name",
        header: "Nombre",
    },
    {
        accessorKey: "company",
        header: "Empresa",
    },
]