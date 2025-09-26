import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import CoursesHero from '@/components/sections/courses-hero'
import CourseList from '@/components/sections/landing-page/courses/course-list'

function CourseListSkeleton() {
  return (
    <section className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </section>
  )
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  return (
    <main className="w-full">
      {/* Hero Section */}
      <CoursesHero />

      {/* Courses Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Explore Our Courses</h2>
          <p className="text-muted-foreground text-lg">
            Choose from our wide range of NVQ qualifications
          </p>
        </div>

        {/* Suspense will wait for CourseList to fetch data */}
        <Suspense fallback={<CourseListSkeleton />}>
          {/* CourseList is an async server component */}
          <CourseList searchParams={searchParams} />
        </Suspense>
      </section>
    </main>
  )
}
