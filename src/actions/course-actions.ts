"use server";

import { supabase } from "@/lib/supabase/client";
import type { Tables } from "@/types/database";

export async function getCourses(): Promise<Tables<"courses">[] | null> {
  try {
    const { data, error } = await supabase
      .from("courses")
      .select(
        `
        *,
        nvq_categories (
          id,
          name
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching courses:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in getCourses:", error);
    return null;
  }
}

export async function getChaptersByCourseId(
  courseId: number
): Promise<Tables<"chapters">[] | null> {
  try {
    const { data, error } = await supabase
      .from("chapters")
      .select("*")
      .eq("course_id", courseId)
      .order("order", { ascending: true });

    if (error) {
      console.error("Error fetching chapters:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error in getChaptersByCourseId:", error);
    return null;
  }
}

export type NvqCategory = Tables<"nvq_categories">;

export type CourseWithCategory = Tables<"courses"> & {
  nvq_categories: NvqCategory | null;
};

export async function getFilteredCourses(
  search?: string,
  category?: string,
  level?: string
): Promise<CourseWithCategory[]> {
  // Ambil courses + relasi category
  let query = supabase.from("courses").select(
    `
      *,
      nvq_categories(
        slug,
        name
      )
    `
  );

  // Filter category slug (kalau bukan 'all')
  if (category && category !== "all") {
    query = query.filter("nvq_categories.slug", "eq", category);
  }

  // Filter level (kolom langsung dari tabel courses)
  if (level && level !== "all") {
    query = query.eq("level", level);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching courses:", error.message);
    throw error;
  }

  let filtered = data ?? [];

  // Client-side search
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (course) =>
        course.title.toLowerCase().includes(q) ||
        (course.description && course.description.toLowerCase().includes(q))
    );
  }

  return filtered as CourseWithCategory[];
}

export async function getCourseBySlug(slug: string) {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) throw error;
  return data;
}

export async function getNVQCategories(): Promise<NvqCategory[]> {
  const { data, error } = await supabase.from("nvq_categories").select("*");

  if (error) throw error;
  return data;
}

export async function getCategoryBySlug(slug: string) {
  const { data, error } = await supabase
    .from("nvq_categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) throw error;
  return data;
}
