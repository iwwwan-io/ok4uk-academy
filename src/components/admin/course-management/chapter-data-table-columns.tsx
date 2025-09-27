"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { Tables } from "@/types/database";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Play } from "lucide-react";

interface ChapterActionsProps {
  chapter: Tables<"chapters">;
  onEdit: (chapter: Tables<"chapters">) => void;
  onDelete: (id: number) => void;
  isSubmitting?: boolean;
}

function ChapterActions({ chapter, onEdit, onDelete }: ChapterActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onEdit(chapter)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        {/* Removed publish/unpublish menu item as published property does not exist */}
        <DropdownMenuItem
          className="text-red-600 focus:bg-red-50 focus:text-red-600"
          onClick={() => onDelete(chapter.id)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const createChapterColumns = (
  onEdit: (chapter: Tables<"chapters">) => void,
  onDelete: (id: number) => void,
  isSubmitting?: boolean
): ColumnDef<Tables<"chapters">>[] => [
  {
    accessorKey: "order",
    header: "Order",
    cell: ({ row }) => (
      <div className="w-12 text-center font-medium">
        {row.getValue("order")}
      </div>
    ),
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="max-w-[200px]">
        <div className="font-medium truncate">{row.getValue("title")}</div>
        <div className="text-sm text-muted-foreground truncate">
          {row.original.slug}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "content",
    header: "Description",
    cell: ({ row }) => {
      const content = row.getValue("content") as string;
      return (
        <div className="max-w-[300px] text-sm text-muted-foreground truncate">
          {content || "No description"}
        </div>
      );
    },
  },
  {
    accessorKey: "duration_min",
    header: "Duration",
    cell: ({ row }) => {
      const duration = row.getValue("duration_min") as number | null;
      return (
        <div className="flex items-center gap-1 text-sm">
          {duration ? (
            <>
              <Play className="h-3 w-3" />
              {duration} min
            </>
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </div>
      );
    },
  },
  // Removed video_url and published columns as they do not exist on chapter type
  // {
  //   accessorKey: "video_url",
  //   header: "Video",
  //   cell: ({ row }) => {
  //     const videoUrl = row.getValue("video_url") as string | null
  //     return <Badge variant={videoUrl ? "default" : "secondary"}>{videoUrl ? "Has Video" : "No Video"}</Badge>
  //   },
  // },
  // {
  //   accessorKey: "published",
  //   header: "Status",
  //   cell: ({ row }) => {
  //     const published = row.getValue("published") as boolean
  //     return <Badge variant={published ? "default" : "secondary"}>{published ? "Published" : "Draft"}</Badge>
  //   },
  // },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) => {
      const dateValue = row.getValue("created_at") as string | null;
      const date = dateValue ? new Date(dateValue) : null;
      return (
        <div className="text-sm text-muted-foreground">
          {date ? date.toLocaleDateString() : ""}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <ChapterActions
        chapter={row.original}
        onEdit={onEdit}
        onDelete={onDelete}
        isSubmitting={isSubmitting}
      />
    ),
  },
];
