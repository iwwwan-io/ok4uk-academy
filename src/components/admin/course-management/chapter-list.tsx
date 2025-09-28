"use client";

import { useState, useEffect } from "react";
import type { Tables } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  GripVertical,
  Play,
  BookOpen,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { getChaptersByCourseId } from "@/actions/course-actions";
import { toast } from "sonner";
import ChapterModal from "./chapter-modal";

interface ChapterListProps {
  courseId: number;
  courseName: string;
}

export default function ChapterList({
  courseId,
  courseName,
}: ChapterListProps) {
  const [chapters, setChapters] = useState<Tables<"chapters">[]>([]);
  const [loading, setLoading] = useState(true);
  const [editChapter, setEditChapter] = useState<Tables<"chapters"> | null>(
    null
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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

  const handleDeleteChapter = async (id: number) => {
    if (!confirm("Are you sure you want to delete this chapter?")) return;

    try {
      const { error } = await supabase.from("chapters").delete().eq("id", id);

      if (error) throw error;

      setChapters((prev) => prev.filter((c) => c.id !== id));
      toast.success("Chapter deleted successfully!");
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete chapter");
    }
  };

  const handleSaveChapter = async (
    updatedChapter: Omit<Partial<Tables<"chapters">>, "published">
  ) => {
    try {
      if (updatedChapter.id) {
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
      console.log(err);
      toast.error("Failed to save chapter");
    } finally {
    }
  };

  const maxOrderIndex = Math.max(...chapters.map((c) => c.order ?? 0), 0);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Chapters for {courseName}</h3>
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground">
              Chapters for {courseName}
            </h3>
            <p className="text-sm text-muted-foreground">
              {chapters.length} {chapters.length === 1 ? "chapter" : "chapters"}{" "}
              • Manage your course content
            </p>
          </div>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Chapter
        </Button>
      </div>

      {chapters.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="p-12 text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="text-lg font-semibold mb-2">No chapters yet</h4>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Start building your course by creating your first chapter. Add
              videos, descriptions, and organize your content.
            </p>
            <Button
              size="lg"
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create First Chapter
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {chapters.map((chapter) => (
            <Card
              key={chapter.id}
              className="hover:shadow-md transition-shadow duration-200"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <CardTitle className="text-base">
                        {chapter.title}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Order: {chapter.order}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Removed published badge and toggle as published does not exist */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => setEditChapter(chapter)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 focus:bg-red-50 focus:text-red-600"
                          onClick={() => handleDeleteChapter(chapter.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {chapter.content && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {chapter.content}
                  </p>
                )}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {chapter.duration_min && (
                    <span className="flex items-center gap-1">
                      <Play className="h-3 w-3" />
                      {chapter.duration_min} min
                    </span>
                  )}
                  {/* Removed video_url display as it does not exist */}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

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
