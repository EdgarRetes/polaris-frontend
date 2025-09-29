import { ConfirmModal } from "@/components/ConfirmModal";
import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getFilteredRowModel,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PrimaryColors, SecondaryColors } from "@/helpers/colors";

import { Trash } from "lucide-react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onOpenForm?: () => void;
  onRowSelect?: (id: number | null) => void;
  onDelete?: (id: string | number) => void;
}

export function BusinessRulesDataTable<
  TData extends { id: string | number },
  TValue
>({
  columns,
  data,
  onOpenForm,
  onRowSelect,
  onDelete,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [rowSelection, setRowSelection] = React.useState({});

  // --- NUEVOS ESTADOS PARA EL MODAL ---
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedRowId, setSelectedRowId] = React.useState<
    number | string | null
  >(null);

  const table = useReactTable({
    data,
    columns,
    state: { columnFilters, rowSelection },
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
  });

  const selectedIds = table
    .getSelectedRowModel()
    .rows.map((r) => r.original.id);

  React.useEffect(() => {
    if (onRowSelect) {
      onRowSelect(selectedIds.length > 0 ? Number(selectedIds[0]) : null);
    }
  }, [selectedIds, onRowSelect]);

  const handleConfirmDelete = async () => {
    if (selectedRowId != null) {
      onDelete?.(Number(selectedRowId)); // llama a removeBusinessRule
      setModalOpen(false);
    }
  };

  return (
    <div className="overflow-hidden">
      <div className="flex items-center py-4 px-2 gap-x-2">
        {/* INPUT y DROPDOWNS existentes */}
        <Input
          placeholder="Nombre..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm border-0"
          style={{
            backgroundColor: SecondaryColors.background,
            color: SecondaryColors.content_2,
          }}
        />
        {/* Filtro Empresa */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex items-center gap-2 rounded-md p-2"
            style={{
              backgroundColor: SecondaryColors.background,
              color: SecondaryColors.content_2,
            }}
          >
            <span>Empresa</span>
            <ChevronDown className="w-3 h-3" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="border-0"
            style={{
              backgroundColor: SecondaryColors.background_2,
              color: SecondaryColors.dark_gray,
            }}
          >
            <DropdownMenuItem>Pemex</DropdownMenuItem>
            <DropdownMenuItem>Oxxo</DropdownMenuItem>
            <DropdownMenuItem>ITESM</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Filtro Estado */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex items-center gap-2 rounded-md p-2"
            style={{
              backgroundColor: SecondaryColors.background,
              color: SecondaryColors.content_2,
            }}
          >
            <span>Estado</span>
            <ChevronDown className="w-3 h-3" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="border-0"
            style={{
              backgroundColor: SecondaryColors.background_2,
              color: SecondaryColors.dark_gray,
            }}
          >
            <DropdownMenuItem>Activa</DropdownMenuItem>
            <DropdownMenuItem>Inactiva</DropdownMenuItem>
            <DropdownMenuItem>Borrador</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Botón agregar */}
        <div
          className="rounded-lg align-right ml-auto"
          style={{ background: PrimaryColors.red }}
        >
          <Button
            className="font-bold"
            onClick={onOpenForm}
            style={{ color: SecondaryColors.background_3 }}
          >
            Agregar Regla
          </Button>
        </div>
      </div>

      {/* TABLA */}
      <Table
        className="rounded-md border"
        style={{ borderColor: SecondaryColors.content_4 }}
      >
        <TableHeader
          style={{ backgroundColor: SecondaryColors.content_5 }}
          className="text-xl"
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              style={{ borderColor: SecondaryColors.content_3 }}
            >
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="font-bold"
                  style={{ color: SecondaryColors.dark_gray }}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
              <TableHead
                className="font-bold"
                style={{ color: SecondaryColors.dark_gray }}
              >
                Acciones
              </TableHead>
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                style={{
                  borderColor: SecondaryColors.content_3,
                  backgroundColor: row.getIsSelected()
                    ? PrimaryColors.red
                    : SecondaryColors.background_2,
                  color: row.getIsSelected()
                    ? SecondaryColors.background_3
                    : SecondaryColors.dark_gray,
                  cursor: "pointer",
                }}
                onClick={() => setRowSelection({ [row.id]: true })}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}

                {/* --- NUEVO BOTÓN POR FILA --- */}
                <TableCell>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation(); // evita seleccionar la fila
                      setSelectedRowId(row.original.id);
                      setModalOpen(true);
                    }}
                    style={{
                      background: PrimaryColors.red,
                      color: SecondaryColors.background_3,
                    }}
                    className="font-semibold"
                  >
                    <Trash />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length + 1}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* --- MODAL --- */}
      <ConfirmModal
        isOpen={modalOpen}
        title="Borrar registro"
        onCancel={() => setModalOpen(false)}
        onConfirm={handleConfirmDelete}
      >
        ¿Deseas borrar la regla {selectedRowId}?
      </ConfirmModal>
    </div>
  );
}
