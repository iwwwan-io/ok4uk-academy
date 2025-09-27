"use client";

import React, { useState, useMemo } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getExpandedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
  type Updater,
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
  BookOpen,
  ArrowUp,
  ArrowDown,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tables } from "@/types/database";

interface CourseDataTableProps {
  columns: ColumnDef<Tables<"courses">>[];
  data: Tables<"courses">[];
  globalFilter: string;
  setGlobalFilter: (f: string) => void;
  onExport: () => void;
  isExporting: boolean;
  onCreate?: () => void;
  selectedRows: string[];
  setSelectedRows: (ids: string[]) => void;
  onBulkDelete: () => void;
  onBulkPublishUpdate: (published: boolean) => void;
  sorting: SortingState;
  setSorting: (updater: Updater<SortingState>) => void;
  columnFilters: ColumnFiltersState;
  setColumnFilters: (updater: Updater<ColumnFiltersState>) => void;
  pageSize: number;
  setPageSize: (size: number) => void;
  isSubmitting?: boolean;
}

export default function CourseDataTable({
  columns,
  data,
  globalFilter,
  setGlobalFilter,
  onExport,
  isExporting,
  onCreate,
  selectedRows,
  setSelectedRows,
  onBulkDelete,
  onBulkPublishUpdate,
  sorting,
  setSorting,
  columnFilters,
  setColumnFilters,
  pageSize,
  setPageSize,
  isSubmitting = false,
}: CourseDataTableProps) {
  const [pageIndex, setPageIndex] = useState(0);

  const rowSelection = useMemo(() => {
    return selectedRows.reduce((acc, id) => {
      acc[id] = true;
      return acc;
    }, {} as Record<string, boolean>);
  }, [selectedRows]);

  const tableConfig = useMemo(
    () => ({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getExpandedRowModel: getExpandedRowModel(),
      globalFilterFn: "includesString" as const,
      enableRowSelection: true,
      enableExpanding: true,
    }),
    [data, columns]
  );

  const tableState = useMemo(
    () => ({
      globalFilter,
      sorting,
      columnFilters,
      pagination: { pageSize, pageIndex },
      rowSelection,
    }),
    [globalFilter, sorting, columnFilters, pageSize, pageIndex, rowSelection]
  );

  const table = useReactTable({
    ...tableConfig,
    state: tableState,
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
      setPageIndex(newState.pageIndex);
    },
    onRowSelectionChange: (updater) => {
      const newSelection =
        typeof updater === "function"
          ? updater(table.getState().rowSelection)
          : updater;
      const selectedIds = Object.keys(newSelection).filter(
        (key) => newSelection[key]
      );
      setSelectedRows(selectedIds);
    },
  });

  const selectedCount = useMemo(
    () => selectedRows.length,
    [selectedRows.length]
  );

  const currentStatusFilter = useMemo(() => {
    const publishedFilter = columnFilters.find(
      (f) => f.id === "published"
    )?.value;
    if (publishedFilter === true) return "published";
    if (publishedFilter === false) return "draft";
    return "all";
  }, [columnFilters]);

  const paginationInfo = useMemo(
    () => ({
      currentPage: table.getState().pagination.pageIndex + 1,
      totalPages: table.getPageCount(),
      canPrevious: table.getCanPreviousPage(),
      canNext: table.getCanNextPage(),
    }),
    [table]
  );

  return (
    <div className="w-full space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search courses..."
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-10 max-w-sm"
            />
          </div>
          <Select
            value={currentStatusFilter}
            onValueChange={(value) => {
              const newFilters = columnFilters.filter(
                (f) => f.id !== "published"
              );
              if (value && value !== "all") {
                newFilters.push({
                  id: "published",
                  value: value === "published",
                });
              }
              setColumnFilters(newFilters);
            }}
          >
            <SelectTrigger className="w-40">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All courses</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          {onCreate && (
            <Button
              className="cursor-pointer bg-transparent"
              variant="outline"
              onClick={onCreate}
            >
              <Plus />
              Create Course
            </Button>
          )}
          <Button
            className="cursor-pointer bg-transparent"
            variant="outline"
            onClick={onExport}
            disabled={isExporting}
          >
            {isExporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedCount > 0 && (
        <div className="flex items-center gap-2 p-4 rounded-lg">
          <BookOpen className="h-4 w-4" />
          <span className="text-sm font-medium">
            {selectedCount} course{selectedCount > 1 ? "s" : ""} selected
          </span>
          <div className="flex gap-2 ml-auto">
            <Select
              onValueChange={(value) => onBulkPublishUpdate(value === "true")}
              disabled={isSubmitting}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Update status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Publish</SelectItem>
                <SelectItem value="false">Unpublish</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="destructive"
              size="sm"
              onClick={onBulkDelete}
              disabled={isSubmitting}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                <TableHead className="w-12 sticky left-0 z-20">
                  <Checkbox
                    checked={table.getIsAllRowsSelected()}
                    onCheckedChange={(checked) =>
                      table.toggleAllRowsSelected(!!checked)
                    }
                    aria-label="Select all"
                  />
                </TableHead>
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "cursor-pointer select-none",
                      header.id === "actions" && "sticky bg-card right-0 z-10"
                    )}
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
                <React.Fragment key={row.id}>
                  <TableRow data-state={row.getIsSelected() && "selected"}>
                    <TableCell className="w-12 sticky bg-card left-0 z-20">
                      <Checkbox
                        className="pr-2"
                        checked={row.getIsSelected()}
                        onCheckedChange={(checked) =>
                          row.toggleSelected(!!checked)
                        }
                        aria-label="Select row"
                      />
                    </TableCell>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          cell.column.id === "actions" &&
                            "sticky bg-card right-0 z-10"
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {/* Render expanded row with chapters */}
                  {row.getIsExpanded() && (
                    <TableRow>
                      <TableCell
                        colSpan={row.getVisibleCells().length + 1}
                      ></TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="h-24 text-center"
                >
                  No courses found.
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
            Page {paginationInfo.currentPage} of {paginationInfo.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "px-3 py-1 rounded-md",
              !paginationInfo.canPrevious && "cursor-not-allowed opacity-50"
            )}
            onClick={() => table.previousPage()}
            disabled={!paginationInfo.canPrevious}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!paginationInfo.canNext}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
