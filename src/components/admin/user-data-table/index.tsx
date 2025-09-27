"use client";

import React, { useState, useEffect, startTransition } from "react";
import { SortingState, ColumnFiltersState } from "@tanstack/react-table";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { deleteUser, editUser } from "@/actions/user-actions";
import { Tables } from "@/types/database";
import { generateColumns } from "./user-data-table-columns";
import UserFormDialog from "./user-form-dialog";
import DataTable from "./data-table";
import TableSkeleton from "./table-skeleton";

export default function UserDataTable() {
  const [users, setUsers] = useState<Tables<"profiles">[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [pageSize, setPageSize] = useState(10);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Tables<"profiles"> | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        setUsers(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleEditUser = (profile: Tables<"profiles">) => {
    setEditingUser(profile);
    setIsFormDialogOpen(true);
  };

  const handleSubmitUser = async (data: Partial<Tables<"profiles">>) => {
    if (!editingUser) return;
    setIsSubmitting(true);
    startTransition(async () => {
      try {
        const result = await editUser(editingUser.id, data);
        if (result && result.startsWith("error:")) {
          toast.error(result.slice(6));
        } else {
          setUsers((prev) =>
            prev.map((u) => (u.id === editingUser.id ? { ...u, ...data } : u))
          );
          toast.success("User updated successfully!");
        }
      } catch (err) {
        console.log(err);
        toast.error("Failed to update user");
      } finally {
        setIsSubmitting(false);
      }
    });
  };

  const handleUpdateRole = async (
    id: string,
    role: Tables<"profiles">["role"]
  ) => {
    startTransition(async () => {
      try {
        const result = await editUser(id, { role });
        if (result && result.startsWith("error:")) {
          toast.error(result.slice(6));
        } else {
          setUsers((prev) =>
            prev.map((u) => (u.id === id ? { ...u, role } : u))
          );
          toast.success("Role updated successfully!");
        }
      } catch (err) {
        console.log(err);
        toast.error("Failed to update role");
      }
    });
  };

  async function handleDeleteUser(userId: string) {
    // Simpan state lama (buat undo kalau gagal)
    const previousUsers = [...users];

    // Optimistic update: hapus langsung dari state
    setUsers((prev) => prev.filter((u) => u.id !== userId));

    const result = await deleteUser(userId);

    if (result?.startsWith("error:")) {
      // Jika gagal → kembalikan state lama
      setUsers(previousUsers);
      toast.error(result.replace("error:", ""));
    } else {
      toast.success("User berhasil dihapus");
    }
  }

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      const headers = Object.keys(data[0] || {});
      const csv = [
        headers.join(","),
        ...data.map((row: { [x: string]: unknown }) =>
          headers
            .map((h) => JSON.stringify(row[h as keyof Tables<"profiles">]))
            .join(",")
        ),
      ].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "users.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Exported users.csv");
    } catch {
      toast.error("Failed to export users");
    } finally {
      setIsExporting(false);
    }
  };

  const columns = generateColumns({
    onEdit: handleEditUser,
    onDelete: handleDeleteUser,
    onUpdateRole: handleUpdateRole,
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      {loading ? (
        <TableSkeleton rows={8} columns={5} />
      ) : error ? (
        <Alert variant="destructive" className="mb-4">
          <TriangleAlert className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <DataTable
          columns={columns}
          data={users}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          onExport={handleExportData}
          isExporting={isExporting}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
          onBulkDelete={() => {
            // Implement bulk delete logic here if needed
            // For now, just clear selection
            setSelectedRows([]);
          }}
          onBulkRoleUpdate={(role) => {
            console.log(role);
            // Implement bulk role update logic here if needed
            // For now, just clear selection
            setSelectedRows([]);
          }}
          sorting={sorting}
          setSorting={setSorting}
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
          pageSize={pageSize}
          setPageSize={setPageSize}
        />
      )}
      <UserFormDialog
        open={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        onSubmit={handleSubmitUser}
        initialData={editingUser}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
