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
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

interface CourseModalProps {
  course: Tables<"courses"> | null;
  onClose: () => void;
  onSave: (updatedCourse: Partial<Tables<"courses">>) => Promise<void>;
  isCreate?: boolean;
  open?: boolean;
  categories: Tables<"nvq_categories">[];
}

export default function EditCourseModal({
  course,
  onClose,
  onSave,
  isCreate = false,
  open,
  categories,
}: CourseModalProps) {
  const [title, setTitle] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number | string>("");
  const [published, setPublished] = useState<boolean>(false);
  const [durationMinutes, setDurationMinutes] = useState<number | string>("");
  const [nvqCategoryId, setNvqCategoryId] = useState<number | null>(null);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (isCreate) {
      setSlug(generateSlug(value));
    }
  };

  useEffect(() => {
    if (course) {
      setTitle(course.title || "");
      setSlug(course.slug || "");
      setDescription(course.description || "");
      setPrice(
        typeof course.price === "number"
          ? course.price
          : String(course.price) || 0
      );
      setPublished(course.published || false);
      setDurationMinutes(
        typeof course.duration_minutes === "number"
          ? course.duration_minutes
          : String(course.duration_minutes) || ""
      );
      setNvqCategoryId(course.nvq_category_id);
    } else if (isCreate) {
      setTitle("");
      setSlug("");
      setDescription("");
      setPrice("");
      setPublished(false);
      setDurationMinutes("");
      setNvqCategoryId(null);
    }
  }, [course, isCreate]);

  const selectedCategory = categories.find((cat) => cat.id === nvqCategoryId);

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
    if (price === "" || isNaN(Number(price))) {
      toast.error("Valid price is required");
      return;
    }
    if (durationMinutes !== "" && isNaN(Number(durationMinutes))) {
      toast.error("Valid duration is required");
      return;
    }
    try {
      await onSave({
        id: course?.id,
        title: title.trim(),
        slug: slug.trim(),
        description: description.trim(),
        price: Number(price),
        published,
        duration_minutes:
          durationMinutes === "" ? null : Number(durationMinutes),
        nvq_category_id: nvqCategoryId,
      });
      toast.success(
        isCreate ? "Course created successfully" : "Course updated successfully"
      );
      onClose();
    } catch (error) {
      console.log(error);
      toast.error(
        isCreate ? "Failed to create course" : "Failed to update course"
      );
    }
  };

  if (!course && !isCreate) return null;

  return (
    <Dialog
      open={open !== undefined ? open : !!course || isCreate}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isCreate ? "Create Course" : "Edit Course"}
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
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Course description..."
              rows={3}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price (£) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value === "" ? "" : Number(e.target.value))
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="0"
                value={durationMinutes}
                onChange={(e) =>
                  setDurationMinutes(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                placeholder="e.g., 120"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">NVQ Category</Label>
              <Select
                value={nvqCategoryId?.toString() || "none"}
                onValueChange={(value) =>
                  setNvqCategoryId(value === "none" ? null : Number(value))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an NVQ category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Category</SelectItem>
                  {categories.map((category) => (
                    <SelectItem
                      key={category.id}
                      value={category.id.toString()}
                    >
                      <div className="flex items-center gap-2">
                        <span>{category.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          Level {category.name}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedCategory && (
                <div className="mt-2 p-2 bg-muted rounded-md">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">{selectedCategory.name}</span>
                  </div>
                  {selectedCategory.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {selectedCategory.description}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2 pt-8">
              <Checkbox
                id="published"
                checked={published}
                onCheckedChange={(checked) => setPublished(!!checked)}
              />
              <Label htmlFor="published">Published</Label>
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
