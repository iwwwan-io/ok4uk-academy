import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { Tables } from "@/types/database";

interface ChapterWithMetadata extends Tables<"chapters"> {
  isDeleting?: boolean;
  isUpdating?: boolean;
}

type LoadingState = "idle" | "loading" | "success" | "error";

export function useChapters(courseId: number) {
  const [chapters, setChapters] = useState<ChapterWithMetadata[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>("idle");
  const [error, setError] = useState<string | null>(null);

  const fetchChapters = useCallback(async () => {
    if (!courseId) return;

    setLoadingState("loading");
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("chapters")
        .select("*")
        .eq("course_id", courseId)
        .order("position", { ascending: true });

      if (fetchError) throw fetchError;

      setChapters(data || []);
      setLoadingState("success");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch chapters";
      setError(errorMessage);
      setLoadingState("error");
      console.error("Error fetching chapters:", err);
    }
  }, [courseId]);

  useEffect(() => {
    fetchChapters();
  }, [fetchChapters]);

  const sortedChapters = chapters.sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );

  const totalChapters = chapters.length;

  return {
    chapters: sortedChapters,
    loadingState,
    error,
    refetch: fetchChapters,
    totalChapters,
  };
}
