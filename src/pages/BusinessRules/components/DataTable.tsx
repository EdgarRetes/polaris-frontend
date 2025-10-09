import { useLocation } from "react-router-dom"; // <--- Importamos
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
import { ChevronDown, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PrimaryColors, SecondaryColors } from "@/helpers/colors";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onOpenForm?: () => void;
  onRowSelect?: (id: number | null) => void;
  onDelete?: (id: string | number) => void;
  onRowClick?: (id: string | number) => void;
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
  onRowClick,
  rowSelection,
  setRowSelection,
}: DataTableProps<TData, TValue> & {
  rowSelection: Record<string, boolean>;
  setRowSelection: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
}) {
  const location = useLocation();
  const showActions = location.pathname === "/business-rules"; // solo mostrar botones en esta ruta

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedRowId, setSelectedRowId] = React.useState<
    number | string | null
  >(null);

  const table = useReactTable({
    data,
    columns,
    state: { columnFilters, rowSelection },
    getRowId: (row) => row.id.toString(),
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
  });

  const handleConfirmDelete = async () => {
    if (selectedRowId != null) {
      onDelete?.(Number(selectedRowId));
      setModalOpen(false);
    }
  };

  return (
    <div className="overflow-hidden">
      <div className="flex items-center py-4 px-2 gap-x-2">
        {/* Input y dropdowns */}
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

        {/* Botón agregar solo si estamos en /business-rules */}
        {showActions && (
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
        )}
      </div>

      {/* Tabla */}
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
              {showActions && (
                <TableHead
                  className="font-bold"
                  style={{ color: SecondaryColors.dark_gray }}
                >
                  Acciones
                </TableHead>
              )}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length ? (
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
                onClick={() => onRowClick?.(row.original.id)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}

                {showActions && (
                  <TableCell>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
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
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length + (showActions ? 1 : 0)}
                className="h-24 text-center"
              >
                No hay datos por ahora.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Modal */}
      {showActions && (
        <ConfirmModal
          isOpen={modalOpen}
          title="Borrar registro"
          onCancel={() => setModalOpen(false)}
          onConfirm={handleConfirmDelete}
        >
          ¿Deseas borrar la regla {selectedRowId}?
        </ConfirmModal>
      )}
    </div>
  );
}
