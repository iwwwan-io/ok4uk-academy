// components/layout/SectionWrapper.tsx
import { cn } from "@/lib/utils";
import React from "react";

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const SectionWrapper = ({
  children,
  className,
}: SectionWrapperProps) => {
  return (
    <section className={cn("w-full px-4 py-12 md:px-8 md:py-16", className)}>
      <div className="max-w-6xl mx-auto">{children}</div>
    </section>
  );
};
