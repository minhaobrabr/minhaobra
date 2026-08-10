import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { StatusTone } from "@/types";

const DOT: Record<StatusTone, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  neutral: "bg-ink-faint",
};

const VARIANT: Record<StatusTone, "success" | "warning" | "danger" | "neutral"> = {
  success: "success",
  warning: "warning",
  danger: "danger",
  neutral: "neutral",
};

interface StatusBadgeProps {
  status: StatusTone;
  label: string;
  size?: "sm" | "md";
  className?: string;
}

export function StatusBadge({ status, label, size = "sm", className }: StatusBadgeProps) {
  return (
    <Badge variant={VARIANT[status]} size={size} className={className}>
      <span aria-hidden className={cn("h-1.5 w-1.5 rounded-full", DOT[status])} />
      {label}
    </Badge>
  );
}
