"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";

import { formatBRL, formatPercent } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface BudgetBarProps {
  gasto: number;
  orcamento: number;
  className?: string;
}

function corDaBarra(percentual: number): string {
  if (percentual >= 90) return "bg-danger";
  if (percentual >= 70) return "bg-warning";
  return "bg-success";
}

export function BudgetBar({ gasto, orcamento, className }: BudgetBarProps) {
  const reduced = useReducedMotion();
  const percentual = orcamento ? (gasto / orcamento) * 100 : 0;
  const largura = `${Math.min(percentual, 100)}%`;

  return (
    <div className={cn("rounded-2xl border border-line bg-surface-1 p-5", className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-sm font-medium text-ink">Orçamento comprometido</p>
        <p className="font-mono text-sm font-semibold tabular-nums text-ink">
          {formatPercent(percentual)}
        </p>
      </div>

      <div
        className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-3"
        role="progressbar"
        aria-valuenow={Math.round(percentual)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Orçamento comprometido"
      >
        <motion.div
          className={cn("h-full rounded-full", corDaBarra(percentual))}
          initial={{ width: reduced ? largura : 0 }}
          animate={{ width: largura }}
          transition={{ duration: reduced ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <p className="mt-3 font-mono text-xs tabular-nums text-ink-muted">
        {formatBRL(gasto)} de {formatBRL(orcamento)} planejados
      </p>
    </div>
  );
}
