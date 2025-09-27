"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase/client";
import { Tables } from "@/types/database.types";
import { toast } from "sonner";

interface NVQCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category?: Tables<"nvq_categories"> | null;
}

export default function NVQCategoryModal({
  isOpen,
  onClose,
  onSuccess,
  category,
}: NVQCategoryModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        slug: category.slug || "",
        description: category.description || "",
      });
    } else {
      setFormData({
        name: "",
        slug: "",
        description: "",
      });
    }
  }, [category, isOpen]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleNameChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      name: value,
      slug: generateSlug(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (category) {
        // Update existing category
        const { error } = await supabase
          .from("nvq_categories")
          .update({
            name: formData.name,
            slug: formData.slug,
            description: formData.description,
            updated_at: new Date().toISOString(),
          })
          .eq("id", category.id);

        if (error) throw error;
        toast("NVQ Category updated successfully");
      } else {
        // Create new category
        const { error } = await supabase.from("nvq_categories").insert({
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
        });

        if (error) throw error;
        toast("NVQ Category created successfully");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving NVQ category:", error);
      toast("Failed to save NVQ category. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {category ? "Edit NVQ Category" : "Create NVQ Category"}
          </DialogTitle>
          <DialogDescription>
            {category
              ? "Update the NVQ category details below."
              : "Add a new NVQ category to organize your courses."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g., Business Administration Level 2"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, slug: e.target.value }))
              }
              placeholder="e.g., business-admin-l2"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Describe what this NVQ category covers..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : category ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
