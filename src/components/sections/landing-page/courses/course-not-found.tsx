import { BackButton } from "@/components/back-button";

export function CourseNotFound() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold text-destructive">Course not found</h1>
      <BackButton />
    </main>
  );
}
