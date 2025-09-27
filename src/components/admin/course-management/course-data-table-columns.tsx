"use client";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ChevronRight, MoreHorizontal, List } from "lucide-react";
import type { Tables } from "@/types/database";
import { CourseWithCategory } from "@/actions/course-actions";

function ExpandButton({ row }: { row: Row<Tables<"courses">> }) {
  if (!row.getCanExpand()) return <div className="w-4" />; // spacer biar sejajar
  return (
    <button
      onClick={row.getToggleExpandedHandler()}
      className="p-1 hover:bg-muted rounded"
      aria-label="Toggle row expanded"
    >
      {row.getIsExpanded() ? (
        <ChevronDown className="h-4 w-4" />
      ) : (
        <ChevronRight className="h-4 w-4" />
      )}
    </button>
  );
}

export const generateColumns = ({
  onEdit,
  onDelete,
  onUpdatePublished,
  onDuplicate,
  onManageChapters, // Added onManageChapters parameter
}: {
  onEdit: (course: Tables<"courses">) => void;
  onDelete: (id: number) => void;
  onUpdatePublished: (id: number, published: boolean) => void;
  onDuplicate: (course: Tables<"courses">) => void;
  onManageChapters?: (course: Tables<"courses">) => void; // Added onManageChapters type
}): ColumnDef<Tables<"courses">>[] => [
  {
    accessorKey: "title",
    header: () => <span className="block w-[250px]">Title</span>,
    cell: ({ row }) => (
      <div
        className="flex items-center gap-2 w-[250px]"
        style={{ paddingLeft: `${row.depth * 1.5}rem` }}
      >
        <ExpandButton row={row} />
        <div className="truncate">{row.getValue("title")}</div>
      </div>
    ),
  },
  {
    accessorKey: "slug",
    header: () => <span className="block w-[150px]">Slug</span>,
    cell: ({ row }) => (
      <div className="truncate w-[150px]">{row.getValue("slug")}</div>
    ),
  },
  {
    accessorKey: "duration",
    header: () => <span className="block w-[120px]">Duration</span>,
    cell: ({ row }) => {
      const course = row.original;
      const duration = course.duration_minutes;
      return (
        <div className="w-[120px]">{duration ? `${duration} min` : "N/A"}</div>
      );
    },
  },
  {
    accessorKey: "nvq_category_id",
    header: () => <span className="block w-[160px]">NVQ Category</span>,
    cell: ({ row }) => {
      const course = row.original;
      const category = (course as CourseWithCategory).nvq_categories;
      return (
        <div className="truncate w-[160px]">
          {category?.name || "No NVQ Category"}
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: () => <span className="block w-[100px]">Price</span>,
    cell: ({ row }) => {
      const price = row.getValue("price");
      const priceNumber =
        typeof price === "number"
          ? price
          : typeof price === "string"
          ? Number.parseFloat(price)
          : 0;
      return <div className="w-[100px]">£{priceNumber.toFixed(2)}</div>;
    },
  },
  {
    accessorKey: "published",
    header: () => <span className="block w-[140px]">Status</span>,
    cell: ({ row }) => {
      const course = row.original;
      return (
        <div className="w-[140px]">
          <Select
            value={course.published ? "published" : "draft"}
            onValueChange={(value) =>
              onUpdatePublished(course.id, value === "published")
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: () => <span className="block w-[140px]">Created</span>,
    cell: ({ row }) => {
      const dateValue = row.getValue("created_at");
      let formatted = "";
      if (typeof dateValue === "string" || dateValue instanceof Date) {
        const date = new Date(dateValue);
        formatted = format(date, "MMM dd, yyyy");
      }
      return <div className="w-[140px]">{formatted}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: () => (
      <span className="block w-[80px] text-center sticky right-0 bg-card z-10">
        Actions
      </span>
    ),
    cell: ({ row }) => {
      const course = row.original;
      const handleCopy = async () => {
        try {
          await navigator.clipboard.writeText(String(course.id));
          toast.success("Course ID copied to clipboard!");
        } catch (err) {
          console.log(err);
          toast.error("Failed to copy ID");
        }
      };
      return (
        <div className="flex items-center justify-center gap-2 w-[80px] sticky right-0 bg-card z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={handleCopy}>
                Copy course ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {onManageChapters && (
                <>
                  <DropdownMenuItem onClick={() => onManageChapters(course)}>
                    <List className="h-4 w-4 mr-2" />
                    Manage Chapters
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem onClick={() => onEdit(course)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate(course)}>
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600 focus:bg-red-50 focus:text-red-600"
                onClick={() => onDelete(course.id)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
