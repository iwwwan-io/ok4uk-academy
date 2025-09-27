"use client";

import React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnFiltersState,
  SortingState,
  Updater,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Download,
  Loader2,
  Search,
  Filter,
  Trash2,
  Users,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tables } from "@/types/database";

interface DataTableProps {
  columns: ColumnDef<Tables<"profiles">>[];
  data: Tables<"profiles">[];
  globalFilter: string;
  setGlobalFilter: (f: string) => void;
  onExport: () => void;
  isExporting: boolean;
  selectedRows: string[];
  setSelectedRows: (ids: string[]) => void;
  onBulkDelete: () => void;
  onBulkRoleUpdate: (role: Tables<"profiles">["role"]) => void;
  sorting: SortingState;
  setSorting: (updater: Updater<SortingState>) => void;
  columnFilters: ColumnFiltersState;
  setColumnFilters: (updater: Updater<ColumnFiltersState>) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
}

export default function DataTable({
  columns,
  data,
  globalFilter,
  setGlobalFilter,
  onExport,
  isExporting,
  selectedRows,
  setSelectedRows,
  onBulkDelete,
  onBulkRoleUpdate,
  sorting,
  setSorting,
  columnFilters,
  setColumnFilters,
  pageSize,
  setPageSize,
}: DataTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: "includesString",
    state: {
      globalFilter,
      sorting,
      columnFilters,
      pagination: { pageSize, pageIndex: 0 },
      rowSelection: selectedRows.reduce((acc, id) => {
        const index = data.findIndex((row) => row.id === id);
        if (index !== -1) {
          acc[index] = true;
        }
        return acc;
      }, {} as Record<string, boolean>),
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: (updaterOrValue) => {
      if (typeof updaterOrValue === "function") {
        setSorting((old: SortingState) => updaterOrValue(old));
      } else {
        setSorting(updaterOrValue);
      }
    },
    onColumnFiltersChange: (updaterOrValue) => {
      if (typeof updaterOrValue === "function") {
        setColumnFilters((old: ColumnFiltersState) => updaterOrValue(old));
      } else {
        setColumnFilters(updaterOrValue);
      }
    },
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === "function"
          ? updater(table.getState().pagination)
          : updater;
      setPageSize(newState.pageSize);
    },
    enableRowSelection: true,
    onRowSelectionChange: (updater) => {
      const newSelection =
        typeof updater === "function"
          ? updater(table.getState().rowSelection)
          : updater;
      const selectedIds = Object.keys(newSelection)
        .filter((key) => newSelection[key])
        .map((index) => data[parseInt(index)]?.id)
        .filter(Boolean);
      setSelectedRows(selectedIds);
    },
  });

  const selectedCount = selectedRows.length;

  return (
    <div className="w-full space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-10 max-w-sm"
            />
          </div>
          <Select
            value={
              (columnFilters.find((f) => f.id === "role")?.value as string) ||
              "all"
            }
            onValueChange={(value) => {
              const newFilters = columnFilters.filter((f) => f.id !== "role");
              if (value && value !== "all") {
                newFilters.push({ id: "role", value });
              }
              setColumnFilters(newFilters);
            }}
          >
            <SelectTrigger className="w-40">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="assessor">Assessor</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onExport} disabled={isExporting}>
            {isExporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedCount > 0 && (
        <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
          <Users className="h-4 w-4" />
          <span className="text-sm font-medium">
            {selectedCount} user{selectedCount > 1 ? "s" : ""} selected
          </span>
          <div className="flex gap-2 ml-auto">
            <Select onValueChange={onBulkRoleUpdate}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Update role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="assessor">Assessor</SelectItem>
                <SelectItem value="instructor">Instructor</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="destructive" size="sm" onClick={onBulkDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                <TableHead className="w-12">
                  <Checkbox
                    checked={table.getIsAllRowsSelected()}
                    onCheckedChange={(checked) =>
                      table.toggleAllRowsSelected(!!checked)
                    }
                    aria-label="Select all"
                  />
                </TableHead>
                {hg.headers.slice(1).map((header) => (
                  <TableHead
                    key={header.id}
                    className="cursor-pointer select-none"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className="flex items-center gap-2"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <div className="flex flex-col">
                            <ArrowUp
                              className={cn(
                                "h-3 w-3",
                                header.column.getIsSorted() === "asc"
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                              )}
                            />
                            <ArrowDown
                              className={cn(
                                "h-3 w-3 -mt-1",
                                header.column.getIsSorted() === "desc"
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                              )}
                            />
                          </div>
                        )}
                      </div>
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
                >
                  <TableCell>
                    <Checkbox
                      checked={row.getIsSelected()}
                      onCheckedChange={(checked) =>
                        row.toggleSelected(!!checked)
                      }
                      aria-label="Select row"
                    />
                  </TableCell>
                  {row
                    .getVisibleCells()
                    .slice(1)
                    .map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-24 text-center"
                >
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page:</span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => setPageSize(Number(value))}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
