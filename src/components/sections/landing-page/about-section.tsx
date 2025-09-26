"use client";

import { GraduationCap, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { SectionWrapper } from "./section-wrapper";
import { GridBackground } from "@/components/ui/grid-background";

export default function AboutSection() {
  return (
    <SectionWrapper>
      <div className="text-center mb-16">
        <h2 className="text-2xl lg:text-4xl font-bold font-mono">
          About OK4UK Academy
        </h2>
      </div>

      <div className="relative grid md:grid-cols-2 gap-12">
        <GridBackground size="h-80 w-80" className="top-0 left-1/6" />
        {/* Kiri */}
        <div className="relative">
          <div className="relative">
            <h3 className="text-2xl font-semibold mb-4 font-mono">
              A UK-Based Academy Built for Progress
            </h3>
            <p className="text-foreground mb-6">
              OK4UK Academy is committed to delivering accessible, accredited
              qualifications and modern learning methods to help individuals
              advance in their careers. We believe education should be flexible,
              practical, and empowering.
            </p>
            <Button variant="default" className="rounded-full">
              Learn More
            </Button>
          </div>

          {/* <Image
            className="absolute -top-1/2 left-0 z-[-1] w-full md:scale-70"
            src={"/assets/grid-accent.png"}
            alt="grid"
            width={300}
            height={300}
          /> */}
        </div>

        {/* Kanan - 3 Icon */}
        <div className="relative">
          <div className="grid grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center">
              <GraduationCap className="w-10 h-10 text-primary mb-2" />
              <p className="text-sm font-medium">Accredited NVQs</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Clock className="w-10 h-10 text-primary mb-2" />
              <p className="text-sm font-medium">Flexible Learning</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Users className="w-10 h-10 text-primary mb-2" />
              <p className="text-sm font-medium">Supportive Community</p>
            </div>
            <Image
              className="absolute -top-20 z-[-1] right-20 w-1/2"
              src={"/assets/grid-accent.png"}
              alt="grid"
              width={300}
              height={300}
            />
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
