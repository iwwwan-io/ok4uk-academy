import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export default function TableSkeleton({
  rows = 5,
  columns = 4,
}: TableSkeletonProps) {
  return (
    <div className="w-full border rounded-lg overflow-hidden">
      {/* Table Header */}
      <div
        className="grid"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={`header-${i}`}
            className="p-3 bg-muted font-medium text-sm text-muted-foreground"
          >
            <Skeleton className="h-4 w-24 bg-muted-foreground/20 rounded" />
          </div>
        ))}
      </div>

      {/* Table Rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={`row-${rowIdx}`}
          className={cn(
            "grid border-t",
            rowIdx % 2 === 0 ? "bg-background" : "bg-muted/30"
          )}
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, colIdx) => (
            <div key={`cell-${rowIdx}-${colIdx}`} className="p-3">
              <Skeleton className="h-4 w-20 bg-muted-foreground/20 rounded" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
