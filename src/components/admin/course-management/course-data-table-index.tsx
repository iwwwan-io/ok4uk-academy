"use client";

import {
  useState,
  useEffect,
  startTransition,
  useMemo,
  useCallback,
} from "react";
import type { SortingState, ColumnFiltersState } from "@tanstack/react-table";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { TriangleAlert } from "lucide-react";
import { getCourses } from "@/actions/course-actions";
import { supabase } from "@/lib/supabase/client";
import type { Tables } from "@/types/database";
import { generateColumns } from "./course-data-table-columns";
import CourseDataTable from "./course-data-table";
import EditCourseModal from "./course-modal";

interface CourseDataTableIndexProps {
  onCourseSelect?: (course: { id: number; name: string }) => void;
}

export default function CourseDataTableIndex({
  onCourseSelect,
}: CourseDataTableIndexProps) {
  // Course management state
  const [courses, setCourses] = useState<Tables<"courses">[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Table state
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [pageSize, setPageSize] = useState(10);

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Modal state
  const [editCourse, setEditCourse] = useState<Tables<"courses"> | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Categories state
  const [categories, setCategories] = useState<Tables<"nvq_categories">[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [coursesData, categoriesData] = await Promise.all([
          getCourses(),
          supabase
            .from("nvq_categories")
            .select("*")
            .order("name", { ascending: true }),
        ]);

        setCourses(coursesData || []);
        setCategories(categoriesData.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Course CRUD operations
  const handleDeleteCourse = async (id: number) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      const { error } = await supabase.from("courses").delete().eq("id", id);

      if (error) throw error;

      setCourses((prev) => prev.filter((c) => c.id !== id));
      toast.success("Course deleted successfully!");
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete course");
    }
  };

  const handleUpdatePublished = async (id: number, published: boolean) => {
    setIsSubmitting(true);
    startTransition(async () => {
      try {
        const { error } = await supabase
          .from("courses")
          .update({ published })
          .eq("id", id)
          .select()
          .single();

        if (error) throw error;

        setCourses((prev) =>
          prev.map((c) => (c.id === id ? { ...c, published } : c))
        );
        toast.success("Course status updated successfully!");
      } catch {
        toast.error("Failed to update course status");
      } finally {
        setIsSubmitting(false);
      }
    });
  };

  const handleExportData = useCallback(async () => {
    setIsExporting(true);
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const headers = Object.keys(data[0] || {});
      const csv = [
        headers.join(","),
        ...data.map((row: { [x: string]: unknown }) =>
          headers
            .map((h) => JSON.stringify(row[h as keyof Tables<"courses">]))
            .join(",")
        ),
      ].join("\n");

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "courses.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Exported courses.csv");
    } catch {
      toast.error("Failed to export courses");
    } finally {
      setIsExporting(false);
    }
  }, []);

  // Modal handlers
  const handleEdit = (course: Tables<"courses">) => {
    setEditCourse(course);
  };

  const handleSave = async (updatedCourse: Partial<Tables<"courses">>) => {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("courses")
        .update(updatedCourse)
        .eq("id", Number(updatedCourse.id!))
        .select()
        .single();

      if (error) throw error;

      setCourses((prev) =>
        prev.map((c) => (c.id === updatedCourse.id ? { ...c, ...data } : c))
      );
      toast.success("Course updated successfully!");
    } catch {
      toast.error("Failed to update course");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreate = async (newCourse: Partial<Tables<"courses">>) => {
    setIsSubmitting(true);
    try {
      const courseToInsert: Partial<
        Omit<Tables<"courses">, "id" | "created_at" | "updated_at">
      > = {
        title: newCourse.title!,
        price: newCourse.price!,
        slug: newCourse
          .title!.toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
        published: false,
        nvq_category_id: newCourse.nvq_category_id ?? null,
      };

      const { data, error } = await supabase
        .from("courses")
        .insert([
          courseToInsert as Omit<
            Tables<"courses">,
            "id" | "created_at" | "updated_at"
          >,
        ])
        .select()
        .single();

      if (error) throw error;

      setCourses((prev) => [data, ...prev]);
      toast.success("Course created successfully!");
    } catch {
      toast.error("Failed to create course");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDuplicate = async (course: Tables<"courses">) => {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("courses")
        .insert([
          {
            ...course,
            title: "Copy of " + course.title,
            id: undefined,
            created_at: undefined,
            updated_at: undefined,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setCourses((prev) => [data, ...prev]);
      toast.success("Course duplicated successfully!");
    } catch {
      toast.error("Failed to duplicate course");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate table columns
  const memoizedColumns = useMemo(() => {
    const handleManageChapters = (course: Tables<"courses">) => {
      if (onCourseSelect) {
        onCourseSelect({ id: course.id, name: course.title });
        toast.success(`Selected "${course.title}" for chapter management`);
      }
    };

    return generateColumns({
      onEdit: handleEdit,
      onDelete: handleDeleteCourse,
      onUpdatePublished: handleUpdatePublished,
      onDuplicate: handleDuplicate,
      onManageChapters: handleManageChapters, // Added onManageChapters to column generation
    });
  }, [onCourseSelect]);

  const filteredCourses = useMemo(() => {
    if (!globalFilter) return courses;

    return courses.filter((course) => {
      const categoryName = categories.find(
        (cat) => cat.id === course.nvq_category_id
      )?.name;
      return (
        course.title?.toLowerCase().includes(globalFilter.toLowerCase()) ||
        course.description
          ?.toLowerCase()
          .includes(globalFilter.toLowerCase()) ||
        (categoryName?.toLowerCase().includes(globalFilter.toLowerCase()) ??
          false)
      );
    });
  }, [courses, globalFilter, categories]);

  const categoryOptions = useMemo(() => {
    return categories.map((category) => ({
      ...category,
      created_at: category.created_at || null,
      slug: category.slug || "",
    }));
  }, [categories]);

  // Bulk action handlers placeholders (implement if needed)
  const handleBulkPublishUpdate = useCallback(async () => {
    toast.error("Bulk publish/unpublish not implemented.");
  }, []);

  const handleBulkDelete = useCallback(async () => {
    toast.error("Bulk delete not implemented.");
  }, []);

  const bulkActionHandlers = useMemo(
    () => ({
      handleBulkPublishUpdate,
      handleBulkDelete,
      handleExportData,
    }),
    [handleBulkDelete, handleBulkPublishUpdate, handleExportData]
  );

  return (
    <div>
      {/* Main Content */}
      {loading ? (
        <div role="status" className="w-full border rounded-lg overflow-hidden">
          <div
            className="grid"
            style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
          >
            {[...Array(4)].map((_, i) => (
              <div
                key={`header-${i}`}
                className="p-3 bg-muted font-medium text-sm text-muted-foreground"
              >
                <Skeleton className="h-4 w-24 bg-muted-foreground/20 rounded" />
              </div>
            ))}
          </div>
          {[...Array(5)].map((_, rowIdx) => (
            <div
              key={`row-${rowIdx}`}
              className={`grid border-t ${
                rowIdx % 2 === 0 ? "bg-background" : "bg-muted/30"
              }`}
              style={{ gridTemplateColumns: "repeat(4, 1fr)" }}
            >
              {[...Array(4)].map((_, colIdx) => (
                <div key={`cell-${rowIdx}-${colIdx}`} className="p-3">
                  <Skeleton className="h-4 w-20 bg-muted-foreground/20 rounded" />
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : error ? (
        <Alert variant="destructive" className="mb-4">
          <TriangleAlert className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <button
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={() => {
              setError(null);
              setLoading(true);
              Promise.all([
                getCourses(),
                supabase.from("nvq_categories").select("*"),
              ])
                .then(([coursesData, categoriesData]) => {
                  setCourses(coursesData || []);
                  setCategories(categoriesData.data || []);
                })
                .catch((err) => {
                  setError(
                    err instanceof Error ? err.message : "Failed to fetch data"
                  );
                })
                .finally(() => {
                  setLoading(false);
                });
            }}
          >
            Retry
          </button>
        </Alert>
      ) : (
        <>
          <CourseDataTable
            columns={memoizedColumns}
            data={filteredCourses}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            onExport={bulkActionHandlers.handleExportData}
            isExporting={isExporting}
            onCreate={() => setIsCreateModalOpen(true)}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            onBulkDelete={bulkActionHandlers.handleBulkDelete}
            onBulkPublishUpdate={bulkActionHandlers.handleBulkPublishUpdate}
            sorting={sorting}
            setSorting={setSorting}
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
            pageSize={pageSize}
            setPageSize={setPageSize}
            isSubmitting={isSubmitting}
          />

          {/* Modals */}
          <EditCourseModal
            course={editCourse}
            onClose={() => setEditCourse(null)}
            onSave={handleSave}
            categories={categoryOptions}
          />
          <EditCourseModal
            course={null}
            isCreate={true}
            open={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSave={handleCreate}
            categories={categoryOptions}
          />
        </>
      )}
    </div>
  );
}
