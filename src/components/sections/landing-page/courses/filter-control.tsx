"use client";

import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FilterControlsProps = {
  categories: string[];
  selected: { category: string; level: string };
  onChange: (key: "category" | "level", value: string) => void;
  onReset: () => void;
};

export function FilterControls({
  categories,
  selected,
  onChange,
  onReset,
}: FilterControlsProps) {
  return (
    <section className="flex flex-wrap justify-center gap-4">
      {/* Category */}
      <Select
        value={selected.category}
        onValueChange={(val) => onChange("category", val)}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat} value={cat.toLowerCase()}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Level */}
      <Select
        value={selected.level}
        onValueChange={(val) => onChange("level", val)}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Levels</SelectItem>
          {[1, 2, 3, 4, 5, 6].map((lvl) => (
            <SelectItem key={lvl} value={lvl.toString()}>
              Level {lvl}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Reset Button */}
      {(selected.category !== "all" || selected.level !== "all") && (
        <Button onClick={onReset} aria-label="Reset filters">
          <RefreshCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      )}
    </section>
  );
}
