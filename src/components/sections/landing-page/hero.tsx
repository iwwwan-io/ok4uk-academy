"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Icons } from "@/components/icons";
import Image from "next/image";
import { SectionWrapper } from "./section-wrapper";
import { GridBackground } from "@/components/ui/grid-background";

export default function Hero() {
  return (
    <SectionWrapper className="mt-16 relative">
      <div className="relative z-[1] flex flex-col items-center justify-center text-center pt-24 px-4 space-y-6">
        {/* Headline */}

        <h1 className="text-3xl sm:text-6xl font-mono font-bold max-w-5xl">
          Grow Your Skills to Advance Your Career Path
        </h1>

        {/* Subheading */}
        <p className="text-muted-foreground text-lg max-w-2xl">
          Join OK4UK Academy and gain industry-recognised qualifications to
          enhance your skills in construction, health & safety, and more.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg" className="rounded-full">
            <Link href="/courses">Browse Courses</Link>
          </Button>
          <Button asChild variant="link" size="lg">
            <Link href="/about">Learn About Us</Link>
          </Button>
        </div>
        <div className="container relative mx-auto flex flex-col items-center justify-center text-center py-10 px-4 space-y-6">
          <Image
            className="relative z-1 w-40 lg:w-100 dark:block hidden "
            draggable={false}
            width={300}
            height={300}
            src={"/logo/ok4uk-dark.png"}
            alt="OK4UK Icon"
          />
          <Image
            className="relative z-1 w-40 lg:w-100 dark:hidden"
            draggable={false}
            width={300}
            height={300}
            src={"/logo/ok4uk-light.png"}
            alt="OK4UK Icon"
          />
          <GridBackground />
        </div>
      </div>
      <Icons
        name="book"
        className="w-20 h-20 lg:w-30 lg:h-30 absolute top-5 left-1/2 z-0"
      />
      <Icons
        name="lamp"
        className="w-20 h-20 lg:w-30 lg:h-30 absolute top-1/3 left-1/6 z-0"
      />
      <Icons
        name="rocket"
        className="w-20 h-20 lg:w-30 lg:h-30 absolute top-1/6 right-1/6 z-0"
      />
    </SectionWrapper>
  );
}
