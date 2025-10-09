// src/audit/components/AuditLogsTable.tsx
import React, { useState } from "react";
import { ColumnDef, ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, useReactTable } from "@tanstack/react-table";
import AuditLog from "@/types/AuditLogDto";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { columns } from "./Columns";
import { SecondaryColors, PrimaryColors } from "@/helpers/colors";

interface AuditLogsTableProps {
  data: AuditLog[];
}

export function AuditLogsTable({ data }: AuditLogsTableProps) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    state: { columnFilters },
  });

  return (
    <div className="overflow-hidden">
      <div className="flex items-center py-4 px-2 gap-x-2">
        <Input
          placeholder="Filtrar por entidad..."
          value={(table.getColumn("entityName")?.getFilterValue() as string) ?? ""}
          onChange={(e) => table.getColumn("entityName")?.setFilterValue(e.target.value)}
          className="max-w-sm border-0"
          style={{ backgroundColor: SecondaryColors.background, color: SecondaryColors.content_2 }}
        />
      </div>

      <Table className="rounded-md border" style={{ borderColor: SecondaryColors.content_4 }}>
        <TableHeader style={{ backgroundColor: SecondaryColors.content_5 }} className="text-xl">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} style={{ borderColor: SecondaryColors.content_3 }}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="font-bold" style={{ color: SecondaryColors.dark_gray }}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                style={{
                  borderColor: SecondaryColors.content_3,
                  backgroundColor: SecondaryColors.background_2,
                  color: SecondaryColors.dark_gray,
                  cursor: "pointer",
                }}
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
