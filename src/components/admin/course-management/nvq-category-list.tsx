"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Search, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import NVQCategoryModal from "./nvq-category-modal";
import { Tables } from "@/types/database.types";
import { toast } from "sonner";

export default function NVQCategoryList() {
  const [categories, setCategories] = useState<Tables<"nvq_categories">[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<Tables<"nvq_categories"> | null>(null);

  const filteredCategories = useMemo(() => {
    return categories.filter(
      (category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("nvq_categories")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching NVQ categories:", error);
      toast("Error fetching NVQ categories:");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEdit = (category: Tables<"nvq_categories">) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (category: Tables<"nvq_categories">) => {
    if (!confirm(`Are you sure you want to delete "${category.name}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from("nvq_categories")
        .delete()
        .eq("id", category.id);

      if (error) throw error;

      toast("NVQ Category deleted successfully");
      fetchCategories();
    } catch (error) {
      console.error("Error deleting NVQ category:", error);
      toast("Failed to delete NVQ category");
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleModalSuccess = () => {
    fetchCategories();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading NVQ categories...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">NVQ Categories</h2>
          <p className="text-muted-foreground">
            Manage National Vocational Qualification categories
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((category) => (
          <Card key={category.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <div className="flex items-center gap-2"></div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(category)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(category)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            {category.description && (
              <CardContent>
                <CardDescription>{category.description}</CardDescription>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            {searchTerm
              ? "No categories found matching your search."
              : "No NVQ categories found."}
          </div>
          {!searchTerm && (
            <Button
              variant="outline"
              className="mt-4 bg-transparent"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Category
            </Button>
          )}
        </div>
      )}

      <NVQCategoryModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        category={editingCategory}
      />
    </div>
  );
}
