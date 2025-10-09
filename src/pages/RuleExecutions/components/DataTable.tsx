import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  SortingState,
  getFilteredRowModel,
  getSortedRowModel,
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

import * as React from "react";
import { Input } from "@/components/ui/input";
import {
  PrimaryColors,
  SecondaryColors,
  AdditionalColors,
} from "@/helpers/colors";

// Tipado que asegura que cada fila tiene fileId
interface FileRow {
  fileId: number;
}

interface DataTableProps<TData extends FileRow, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onOpenForm: () => void;
  onRowClick?: (fileId: string) => void;
}

export function RuleExecutionDataTable<TData extends FileRow, TValue>({
  columns,
  data,
  onOpenForm,
  onRowClick,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([
    {
      id: "executedAt",
      desc: true,
    },
  ]);

  const table = useReactTable({
    data,
    columns,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    state: { columnFilters, sorting },
  });

  return (
    <div className="overflow-hidden">
      <div className="flex items-center py-4 px-2 gap-x-2">
        <Input
          placeholder="Archivo..."
          value={
            (table.getColumn("fileName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("fileName")?.setFilterValue(event.target.value)
          }
          className="max-w-sm border-0"
          style={{
            backgroundColor: SecondaryColors.background,
            color: SecondaryColors.content_2,
          }}
        />
        <div
          className="rounded-lg align-right ml-auto"
          style={{ background: PrimaryColors.red }}
        >
          <Button
            className="font-bold"
            onClick={onOpenForm}
            style={{ color: SecondaryColors.background_3 }}
          >
            Procesar archivo
          </Button>
        </div>
      </div>
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
                  backgroundColor: SecondaryColors.background_2,
                  color: SecondaryColors.dark_gray,
                  cursor: "pointer",
                }}
                onClick={() => onRowClick?.(row.original.fileId.toString())}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No hay datos por ahora.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
