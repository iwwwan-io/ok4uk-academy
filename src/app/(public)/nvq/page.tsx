import Link from "next/link";
import { getNVQCategories } from "@/actions/course-actions";

export default async function NVQPage() {
  const nvqCategories = await getNVQCategories();

  return (
    <main className="max-w-4xl mx-auto px-4 py-20 space-y-8">
      <h1 className="text-4xl font-bold text-primary text-center">
        What is NVQ?
      </h1>
      <p className="text-lg text-muted-foreground">
        The NVQ (National Vocational Qualification) is a work-based
        qualification that recognizes the skills and knowledge a person needs to
        perform a job effectively. NVQs are based on national occupational
        standards and are available in a wide range of sectors.
      </p>
      <p className="text-lg text-muted-foreground">
        At OK4UK Academy, we offer a variety of NVQ levels ranging from Level 1
        to Level 6, helping individuals develop, certify, and grow their
        professional careers in construction and safety industries.
      </p>
      <p className="text-lg text-muted-foreground">
        Our qualifications are flexible, recognized by the industry, and
        tailored to meet your real-world work experience.
      </p>
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {nvqCategories.map((cat) => {
          return (
            <Link
              key={cat.slug}
              href={`/nvq/${cat.slug}`}
              className="p-6 border rounded-xl hover:shadow transition"
            >
              <h2 className="text-xl font-semibold text-primary mb-2">
                {cat.name}
              </h2>
              <p className="text-muted-foreground">{cat.description}</p>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
