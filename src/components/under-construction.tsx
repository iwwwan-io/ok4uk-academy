"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { WrenchIcon } from "lucide-react";

export default function UnderConstruction() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <WrenchIcon className="w-16 h-16 text-yellow-500 mb-4" />
      <h1 className="text-4xl font-bold text-primary mb-2">
        Under Development
      </h1>
      <p className="text-gray-600 mb-6 max-w-md">
        This page is currently under construction. We are working hard to get it
        ready for you soon.
      </p>
      <Button asChild>
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  );
}
