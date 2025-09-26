import CourseListClient from "./course-list-client";
import { getFilteredCourses } from "@/actions/course-actions";

export default async function CourseList({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sparams = await searchParams;
  const search = sparams.search as string;
  const category = (sparams?.category as string) || (sparams?.slug as string);
  const level = sparams.level as string;

  const filteredCourses = await getFilteredCourses(search, category, level);

  return (
    <CourseListClient
      initialCourses={filteredCourses}
      initialSearchParams={sparams}
    />
  );
}
