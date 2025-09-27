"use client";

import type React from "react";
import { useState, useEffect } from "react";
import type { Tables } from "@/types/database";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

interface ChapterModalProps {
  chapter: Tables<"chapters"> | null;
  courseId: number; // Updated from number to string for UUID
  onClose: () => void;
  onSave: (updatedChapter: Partial<Tables<"chapters">>) => Promise<void>;
  isCreate?: boolean;
  open?: boolean;
  maxOrderIndex: number;
}

export default function ChapterModal({
  chapter,
  courseId,
  onClose,
  onSave,
  isCreate = false,
  open,
  maxOrderIndex,
}: ChapterModalProps) {
  const [title, setTitle] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [content, setContent] = useState<string>("");
  // Removed videoUrl state as video_url does not exist
  // Removed published state as published does not exist
  const [durationMin, setDurationMin] = useState<number | string>("");
  const [order, setOrder] = useState<number>(0);

  useEffect(() => {
    if (chapter) {
      setTitle(chapter.title || "");
      setSlug(chapter.slug || "");
      setContent(chapter.content || "");
      setDurationMin(
        typeof chapter.duration_min === "number"
          ? chapter.duration_min
          : String(chapter.duration_min) || ""
      );
      setOrder(chapter.order || 0);
    } else if (isCreate) {
      setTitle("");
      setSlug("");
      setContent("");
      setDurationMin("");
      setOrder(maxOrderIndex + 1);
    }
  }, [chapter, isCreate, maxOrderIndex]);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (isCreate && !slug) {
      const autoSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setSlug(autoSlug);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!slug.trim()) {
      toast.error("Slug is required");
      return;
    }
    if (durationMin !== "" && isNaN(Number(durationMin))) {
      toast.error("Valid duration is required");
      return;
    }
    try {
      await onSave({
        id: chapter?.id,
        course_id: courseId,
        title: title.trim(),
        slug: slug.trim(),
        content: content.trim(),
        // Removed video_url as it does not exist
        // Removed published as it does not exist
        duration_min: durationMin === "" ? null : Number(durationMin),
        order: order,
      });
      toast.success(
        isCreate
          ? "Chapter created successfully"
          : "Chapter updated successfully"
      );
      onClose();
    } catch (error) {
      console.log(error);
      toast.error(
        isCreate ? "Failed to create chapter" : "Failed to update chapter"
      );
    }
  };

  if (!chapter && !isCreate) return null;

  return (
    <Dialog
      open={open !== undefined ? open : !!chapter || isCreate}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isCreate ? "Create Chapter" : "Edit Chapter"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="url-friendly-identifier"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Chapter description..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="0"
                value={durationMin}
                onChange={(e) =>
                  setDurationMin(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                placeholder="e.g., 15"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="orderIndex">Order Index</Label>
              <Input
                id="orderIndex"
                type="number"
                min="1"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                required
              />
            </div>
            <div className="flex items-center space-x-2 pt-8">
              {/* Removed published checkbox as published does not exist */}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">Save</Button>
            <Button variant="ghost" onClick={onClose} type="button">
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
