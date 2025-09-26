"use client";

import { cn } from "@/lib/utils";
import { Briefcase, ShieldCheck, Star, Users, Rocket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionWrapper } from "./section-wrapper";

const features = [
  {
    icon: <ShieldCheck className="w-8 h-8 text-primary" />,
    title: "Certified NVQ Provider",
    description: "We offer government-recognised qualifications in the UK.",
  },
  {
    icon: <Users className="w-8 h-8 text-primary" />,
    title: "Experienced Mentors",
    description:
      "Learn directly from industry professionals with years of experience.",
  },
  {
    icon: <Briefcase className="w-8 h-8 text-primary" />,
    title: "Work-Based Learning",
    description:
      "Practical learning approach integrated with real work environments.",
  },
  {
    icon: <Rocket className="w-8 h-8 text-primary" />,
    title: "Career Acceleration",
    description: "Boost your career with nationally recognised qualifications.",
  },
  {
    icon: <Star className="w-8 h-8 text-primary" />,
    title: "Trusted by Clients",
    description: "Proven track record with clients across various industries.",
  },
];

export default function WhyChooseUs() {
  return (
    <SectionWrapper>
      <Badge
        variant="outline"
        className="text-lg mb-4 border-primary rounded-full px-4 text-muted-foreground"
      >
        Why Choose Us
      </Badge>
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="text-2xl font-semibold mb-4 font-mono">
            Why OK4UK Academy is The Right Choice for You?
          </h3>
          <p className="text-muted-foreground lg:max-w-1/2">
            Choosing OK4UK Academy means choosing flexibility, support, and
            quality. We are committed to helping you achieve nationally
            recognised qualifications through a simple, guided process. Whether
            you&apose;re new to NVQs or returning to upskill, our expert team is
            here to make the journey smooth and rewarding.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((item, idx) => (
            <div
              key={idx}
              className={cn(
                "border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition bg-card flex flex-col",
                idx === 2 ? "row-span-2" : ""
              )}
            >
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm mt-auto">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
