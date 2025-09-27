"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import type { Tables } from "@/types/database";
import type { ColumnFiltersState, SortingState } from "@tanstack/react-table";
import { supabase } from "@/lib/supabase/client";
import { getChaptersByCourseId } from "@/actions/course-actions";
import { toast } from "sonner";
import ChapterDataTable from "./chapter-data-table";
import ChapterModal from "./chapter-modal";
import { createChapterColumns } from "./chapter-data-table-columns";

interface ChapterDataTableIndexProps {
  courseId: number;
  courseName: string;
}

export default function ChapterDataTableIndex({
  courseId,
  courseName,
}: ChapterDataTableIndexProps) {
  const [chapters, setChapters] = useState<Tables<"chapters">[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [editChapter, setEditChapter] = useState<Tables<"chapters"> | null>(
    null
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  // Table state
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "order", desc: false },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchChapters = async () => {
      setLoading(true);
      try {
        const data = await getChaptersByCourseId(courseId);
        setChapters(data || []);
      } catch (error) {
        console.error("Error fetching chapters:", error);
        toast.error("Failed to fetch chapters");
      } finally {
        setLoading(false);
      }
    };
    fetchChapters();
  }, [courseId]);

  const handleEditChapter = useCallback((chapter: Tables<"chapters">) => {
    setEditChapter(chapter);
  }, []);

  const handleDeleteChapter = useCallback(async (id: number) => {
    if (!confirm("Are you sure you want to delete this chapter?")) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("chapters").delete().eq("id", id);
      if (error) throw error;

      setChapters((prev) => prev.filter((c) => c.id !== id));
      setSelectedRows((prev) => prev.filter((rowId) => rowId !== id));
      toast.success("Chapter deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete chapter");
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const handleSaveChapter = async (
    updatedChapter: Omit<Partial<Tables<"chapters">>, "published">
  ) => {
    setIsSubmitting(true);
    try {
      if (updatedChapter.id) {
        // Update existing chapter
        const { data, error } = await supabase
          .from("chapters")
          .update(updatedChapter)
          .eq("id", updatedChapter.id)
          .select()
          .single();

        if (error) throw error;

        setChapters((prev) =>
          prev.map((c) => (c.id === updatedChapter.id ? { ...c, ...data } : c))
        );
        toast.success("Chapter updated successfully!");
      } else {
        // Create new chapter
        const { data, error } = await supabase
          .from("chapters")
          .insert([
            updatedChapter as Omit<
              Tables<"chapters">,
              "id" | "created_at" | "updated_at"
            >,
          ])
          .select()
          .single();

        if (error) throw error;

        setChapters((prev) =>
          [...prev, data].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        );
        toast.success("Chapter created successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save chapter");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkDelete = useCallback(async () => {
    if (selectedRows.length === 0) return;
    if (
      !confirm(
        `Are you sure you want to delete ${selectedRows.length} chapter(s)?`
      )
    )
      return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("chapters")
        .delete()
        .in("id", selectedRows);
      if (error) throw error;

      setChapters((prev) => prev.filter((c) => !selectedRows.includes(c.id)));
      setSelectedRows([]);
      toast.success(`${selectedRows.length} chapter(s) deleted successfully!`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete chapters");
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedRows]);

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    try {
      const csvContent = [
        [
          "Order",
          "Title",
          "Slug",
          "Description",
          "Duration",
          "Video URL",
          "Status",
          "Created",
        ],
        ...chapters.map((chapter) => [
          (chapter.order ?? 0).toString(),
          chapter.title,
          chapter.slug,
          chapter.content || "",
          chapter.duration_min?.toString() || "",
          // chapter.video_url || "", // property does not exist, removed
          // chapter.published ? "Published" : "Draft", // property does not exist, removed
          "Draft", // default status as placeholder
          chapter.created_at
            ? new Date(chapter.created_at).toLocaleDateString()
            : "",
        ]),
      ]
        .map((row) => row.map((field) => `"${field}"`).join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${courseName
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase()}_chapters.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Chapters exported successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to export chapters");
    } finally {
      setIsExporting(false);
    }
  }, [chapters, courseName]);

  const maxOrderIndex = useMemo(
    () =>
      chapters.length > 0 ? Math.max(...chapters.map((c) => c.order ?? 0)) : 0,
    [chapters]
  );

  const columns = useMemo(
    () =>
      createChapterColumns(
        handleEditChapter,
        handleDeleteChapter,
        isSubmitting
      ),
    [handleEditChapter, handleDeleteChapter, isSubmitting]
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-muted animate-pulse rounded" />
        <div className="h-64 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Chapters for {courseName}</h3>
          <p className="text-sm text-muted-foreground">
            {chapters.length} {chapters.length === 1 ? "chapter" : "chapters"} •
            Manage your course content
          </p>
        </div>
      </div>

      <ChapterDataTable
        columns={columns}
        data={chapters}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        onExport={handleExport}
        isExporting={isExporting}
        onCreate={() => setIsCreateModalOpen(true)}
        selectedRows={selectedRows.map(String)}
        setSelectedRows={(ids: string[]) => setSelectedRows(ids.map(Number))}
        onBulkDelete={handleBulkDelete}
        sorting={sorting}
        setSorting={setSorting}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        pageSize={pageSize}
        setPageSize={setPageSize}
        isSubmitting={isSubmitting}
      />

      {/* Modals */}
      <ChapterModal
        chapter={editChapter}
        courseId={courseId}
        onClose={() => setEditChapter(null)}
        onSave={handleSaveChapter}
        maxOrderIndex={maxOrderIndex}
      />
      <ChapterModal
        chapter={null}
        courseId={courseId}
        isCreate={true}
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSaveChapter}
        maxOrderIndex={maxOrderIndex}
      />
    </div>
  );
}
