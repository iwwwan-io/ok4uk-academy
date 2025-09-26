"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import CourseCard from "./course-card";
import { CourseNotFound } from "./course-not-found";
import { CourseWithCategory } from "@/actions/course-actions";

type Props = {
  initialCourses: CourseWithCategory[];
  initialSearchParams?: { [key: string]: string | string[] | undefined };
};

export default function CourseListClient({
  initialCourses,
  initialSearchParams,
}: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const isCategoryPage = !!initialSearchParams?.slug;
  const initialCategory =
    (searchParams.get("category") as string) ||
    (initialSearchParams?.slug as string) ||
    "all";

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(initialCategory);
  const [level, setLevel] = useState(searchParams.get("level") || "all");

  // 🔄 Sync state dengan URL setiap berubah
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setCategory(
      isCategoryPage ? initialCategory : searchParams.get("category") || "all"
    );
    setLevel(searchParams.get("level") || "all");
  }, [searchParams, isCategoryPage, initialCategory]);

  // ⬇️ Filter langsung di client dari data server
  const filteredCourses = useMemo(() => {
    return initialCourses.filter((course) => {
      const courseDescriptionText = Array.isArray(course.description)
        ? course.description
            .map((node: unknown) =>
              node &&
              typeof node === "object" &&
              "children" in node &&
              Array.isArray((node as { children: unknown[] }).children)
                ? (node as { children: unknown[] }).children
                    .map((child: unknown) =>
                      child && typeof child === "object" && "text" in child
                        ? (child as { text: string }).text
                        : ""
                    )
                    .join("")
                : ""
            )
            .join("")
        : "";

      const matchesSearch =
        course.title?.toLowerCase().includes(search.toLowerCase()) ||
        courseDescriptionText.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "all" ||
        (course.nvq_categories && course.nvq_categories.slug === category);

      const matchesLevel = level === "all" || course.level === level;

      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [search, category, level, initialCourses]);

  // Update query param
  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all" || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push("?" + params.toString(), { scroll: false });
  };

  // Reset filter
  const resetFilters = () => {
    setSearch("");
    setCategory(isCategoryPage ? initialCategory : "all");
    setLevel("all");
    router.push("?", { scroll: false });
  };

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <Input
          placeholder="Search courses..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            updateQuery("search", e.target.value);
          }}
          className="sm:w-1/3"
        />

        <div className="flex gap-4">
          <Select
            value={category}
            disabled={isCategoryPage}
            onValueChange={(val) => {
              if (!isCategoryPage) {
                setCategory(val);
                updateQuery("category", val);
              }
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="construction">Construction</SelectItem>
              <SelectItem value="health-safety">Health & Safety</SelectItem>
              <SelectItem value="management">Management</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={level}
            onValueChange={(val) => {
              setLevel(val);
              updateQuery("level", val);
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="1">Level 1</SelectItem>
              <SelectItem value="2">Level 2</SelectItem>
              <SelectItem value="3">Level 3</SelectItem>
              <SelectItem value="4">Level 4</SelectItem>
              <SelectItem value="5">Level 5</SelectItem>
              <SelectItem value="6">Level 6</SelectItem>
            </SelectContent>
          </Select>

          {/* Reset button */}
          <Button variant="outline" onClick={resetFilters} className="ml-2">
            Reset
          </Button>
        </div>
      </div>

      {/* Courses */}
      {filteredCourses.length === 0 ? (
        <CourseNotFound />
      ) : (
        <section className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </section>
      )}
    </div>
  );
}
