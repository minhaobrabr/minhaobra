import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { CATEGORIA_META } from "@/lib/domain";
import { cn } from "@/lib/utils";
import type { CategoriaDespesa } from "@/types";

interface CategoryBadgeProps {
  category: CategoriaDespesa;
  size?: "sm" | "md";
  className?: string;
}

export function CategoryBadge({ category, size = "sm", className }: CategoryBadgeProps) {
  const meta = CATEGORIA_META[category];

  return (
    <Badge size={size} className={cn(meta.chip, className)}>
      <span
        aria-hidden
        className="h-1.5 w-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: meta.color }}
      />
      {meta.short}
    </Badge>
  );
}
