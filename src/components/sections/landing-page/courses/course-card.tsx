import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CourseWithCategory } from "@/actions/course-actions";

export default function CourseCard({ course }: { course: CourseWithCategory }) {
  return (
    <Link href={`/courses/${course?.slug}`} className="group h-full ">
      <Card
        className={cn(
          "h-full flex flex-col transition-shadow group-hover:border-secondary-foreground/30 duration-200 hover:shadow-lg cursor-pointer "
        )}
      >
        <CardHeader>
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-2">
            <Image
              src={
                course?.featured_image_url || "/images/products/placeholder.png"
              }
              alt={course?.title}
              fill
              className="object-cover"
            />
          </div>
          <span className="text-sm font-semibold text-primary">
            NVQ Level: {course.level}
          </span>
          <CardTitle className="text-lg">{course.title}</CardTitle>
        </CardHeader>

        <CardContent className="flex-1">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {course.description}
          </p>
        </CardContent>

        <CardFooter className="flex justify-between items-center mt-auto">
          <span className="font-bold text-primary">£{course.price}</span>
          {course.nvq_category_id && (
            <Badge variant="outline">{course.nvq_categories?.name}</Badge>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
