
"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SimilarityBadgeProps {
  similarity: number;

  exact?: boolean;
}

export function SimilarityBadge({
  similarity,
  exact,
}: SimilarityBadgeProps) {
  const percentage =
    Math.round(similarity * 100);

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-semibold",

        exact &&
          "border-red-500/40 text-red-600 dark:text-red-400",

        !exact &&
          similarity >= 0.9 &&
          "border-orange-500/40 text-orange-600 dark:text-orange-400",

        !exact &&
          similarity < 0.9 &&
          "border-yellow-500/40 text-yellow-600 dark:text-yellow-400",
      )}
    >
      {exact
        ? "Exact"
        : `${percentage}% similar`}
    </Badge>
  );
}
