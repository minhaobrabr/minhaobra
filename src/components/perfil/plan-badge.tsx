import * as React from "react";

import { cn } from "@/lib/utils";
import type { PlanStatus } from "@/types";

const BADGES: Record<PlanStatus, { label: string; className: string; dot: string }> = {
  trial: { label: "Período grátis", className: "bg-success/10 text-success", dot: "bg-success" },
  active: { label: "Plano ativo", className: "bg-success/10 text-success", dot: "bg-success" },
  expired: { label: "Expirado", className: "bg-warning/10 text-warning", dot: "bg-warning" },
  canceled: { label: "Cancelado", className: "bg-danger/10 text-danger", dot: "bg-danger" },
};

export function PlanBadge({ status }: { status: PlanStatus }) {
  const badge = BADGES[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        badge.className,
      )}
    >
      <span aria-hidden className={cn("h-1.5 w-1.5 rounded-full", badge.dot)} />
      {badge.label}
    </span>
  );
}
