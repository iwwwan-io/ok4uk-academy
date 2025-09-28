"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Tables } from "@/types/database";

interface EnrollButtonProps {
  course: Tables<"courses">;
}

export function EnrollButton({ course }: EnrollButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleEnroll = async () => {
    const isAuthenticated = await fetch("/api/v1/auth/me");
    const userData = await isAuthenticated.json();

    if (!isAuthenticated.ok || !userData.id) {
      toast.error("Please log in to enroll in this course");
      router.push("/auth/login");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/v1/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: course.id,
          userId: userData.id,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create checkout session");
      }

      const data = await res.json();

      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error: unknown) {
      console.error("Enrollment error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to enroll in course";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button size="lg" onClick={handleEnroll} disabled={isLoading}>
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {isLoading ? "Processing..." : "Enroll Now"}
    </Button>
  );
}
