"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CourseDataTableIndex from "./course-data-table-index";
import ChapterDataTableIndex from "./chapter-data-table-index";
import NVQCategoryList from "./nvq-category-list";
import { BookOpen, List, Settings, Award } from "lucide-react";
import { getCourses } from "@/actions/course-actions";
import type { Tables } from "@/types/database";

export default function CourseManagementPage() {
  // State for selected course to manage chapters
  const [selectedCourse, setSelectedCourse] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // State for courses list and loading status for dropdown
  const [courses, setCourses] = useState<Tables<"courses">[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(false);

  // Handler when a course is selected from the chapter management dropdown
  const handleCourseSelect = (course: { id: number; name: string }) => {
    setSelectedCourse(course);
  };

  // Fetch courses for the dropdown in chapter management tab
  const fetchCoursesForDropdown = async () => {
    setCoursesLoading(true);
    try {
      const coursesData = await getCourses();
      setCourses(coursesData || []);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setCoursesLoading(false);
    }
  };

  // Handler for dropdown course selection
  // Adjusted to accept string as Select onValueChange passes string
  const handleDropdownCourseSelect = (value: string) => {
    const courseId = Number(value);
    const course = courses.find((c) => c.id === courseId);
    if (course) {
      setSelectedCourse({ id: course.id, name: course.title });
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Course & Chapter Management
        </h1>
        <p className="text-muted-foreground">
          Manage your courses, chapters, and NVQ categories in one place
        </p>
      </div>

      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="courses" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Courses
          </TabsTrigger>
          <TabsTrigger value="chapters" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Chapters
          </TabsTrigger>
          <TabsTrigger
            value="nvq-categories"
            className="flex items-center gap-2"
          >
            <Award className="h-4 w-4" />
            NVQ Categories
          </TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Course Management
              </CardTitle>
              <CardDescription>
                Create, edit, and manage your courses. You can publish/unpublish
                courses, set pricing, and organize them by NVQ categories.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CourseDataTableIndex onCourseSelect={handleCourseSelect} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chapters" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="h-5 w-5" />
                Chapter Management
              </CardTitle>
              <CardDescription>
                {selectedCourse
                  ? `Managing chapters for "${selectedCourse.name}"`
                  : "Select a course to manage its chapters"}
              </CardDescription>
              <div className="flex items-center gap-4 pt-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Select Course:</span>
                  <Select
                    value={selectedCourse?.id.toString()}
                    onValueChange={handleDropdownCourseSelect}
                    onOpenChange={(open) => {
                      if (open && courses.length === 0) {
                        fetchCoursesForDropdown();
                      }
                    }}
                  >
                    <SelectTrigger className="w-[300px]">
                      <SelectValue placeholder="Choose a course..." />
                    </SelectTrigger>
                    <SelectContent>
                      {coursesLoading ? (
                        <SelectItem value="loading" disabled>
                          Loading courses...
                        </SelectItem>
                      ) : courses.length === 0 ? (
                        <SelectItem value="empty" disabled>
                          No courses available
                        </SelectItem>
                      ) : (
                        courses.map((course) => (
                          <SelectItem
                            key={course.id}
                            value={course.id.toString()}
                          >
                            {course.title}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                {selectedCourse && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCourse(null)}
                  >
                    Clear Selection
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {selectedCourse ? (
                <ChapterDataTableIndex
                  courseId={selectedCourse.id}
                  courseName={selectedCourse.name}
                />
              ) : (
                <div className="text-center py-12">
                  <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    No Course Selected
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Please select a course using the dropdown above or from the
                    Courses tab to manage its chapters.
                  </p>
                  <TabsList className="inline-flex">
                    <TabsTrigger
                      value="courses"
                      className="flex items-center gap-2"
                    >
                      <BookOpen className="h-4 w-4" />
                      Go to Courses
                    </TabsTrigger>
                  </TabsList>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nvq-categories" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                NVQ Category Management
              </CardTitle>
              <CardDescription>
                Manage National Vocational Qualification categories to organize
                your courses by qualification levels and sectors.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NVQCategoryList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
