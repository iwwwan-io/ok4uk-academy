import { getCategoryBySlug, getNVQCategories } from "@/actions/course-actions";
import { notFound } from "next/navigation";
import CourseList from "@/components/sections/landing-page/courses/course-list";
import { Suspense } from "react";

export async function generateStaticParams() {
  const categories = await getNVQCategories();
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: `NVQ in ${category.name} | OK4UK Academy`,
    description: category.description,
  };
}

export default async function NVQSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-16 space-y-12">
      {/* Title */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary">
          NVQ in {category.name}
        </h1>
        <p className="text-lg text-muted-foreground">{category.description}</p>
      </section>

      {/* Course list */}
      <section>
        <Suspense fallback={<div>Loading...</div>}>
          <CourseList searchParams={Promise.resolve({ slug })} />
        </Suspense>
      </section>
    </main>
  );
}
