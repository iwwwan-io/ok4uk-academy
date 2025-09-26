import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import Image from "next/image";
import { BackButton } from "@/components/back-button";
import { EnrollButton } from "@/components/enroll-button";
import { getCourseBySlug } from "@/actions/course-actions";

export default async function CourseDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  const success = searchParams.success;
  const paymentVerified = success === "true";

  return (
    <main className="max-w-7xl mx-auto px-4 mt-16 py-12 space-y-12">
      {/* Success Confirmation */}
      {paymentVerified && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-green-800">
                  Enrollment Successful!
                </h2>
                <p className="text-green-700">
                  Congratulations! You have successfully enrolled in &quot;
                  {course.title}&quot;. You can now access your course materials
                  from your dashboard.
                </p>
              </div>
              <Button
                onClick={() =>
                  (window.location.href = "/dashboard/student/courses")
                }
                className="bg-green-600 hover:bg-green-700"
              >
                Go to My Courses
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hero Section */}
      <BackButton />
      <section className="relative flex flex-col lg:flex-row items-center gap-10">
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <h1 className="text-4xl font-bold text-primary">{course.title}</h1>
          <div className="text-muted-foreground text-lg leading-relaxed">
            {course.description}
          </div>
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            {course.nvq_category_id && (
              <Badge variant="secondary">{course.nvq_category_id}</Badge>
            )}
            {course.level && (
              <Badge variant="outline" className="capitalize">
                Level {course.level}
              </Badge>
            )}
          </div>
          <div className="flex gap-4 items-center justify-center lg:justify-start">
            {course.price && (
              <p className="text-2xl font-semibold text-primary">
                £{course.price}
              </p>
            )}
            <EnrollButton course={course} />
          </div>
        </div>
        <div className="flex-1 relative w-full max-w-md">
          <Image
            src={
              course.featured_image_url || "/images/products/placeholder.png"
            }
            alt={course.title}
            width={600}
            height={400}
            className="rounded-2xl shadow-lg object-cover w-full"
          />
        </div>
      </section>

      {/* Details Section */}
      <section className="grid gap-8 md:grid-cols-2">
        <Card className="shadow-md">
          <CardContent className="p-6 space-y-3">
            <h2 className="text-xl font-semibold">Course Details</h2>
            <ul className="space-y-2 text-muted-foreground">
              {course.level && (
                <li>
                  <strong>Level:</strong> {course.level}
                </li>
              )}
              {course.nvq_category_id && (
                <li>
                  <strong>Category:</strong> {course.nvq_category_id}
                </li>
              )}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardContent className="p-6 space-y-3">
            <h2 className="text-xl font-semibold">What you will learn</h2>
            <div className="text-muted-foreground leading-relaxed">
              {course.description}
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
