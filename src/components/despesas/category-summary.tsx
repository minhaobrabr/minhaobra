"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";

import type { CategoriaResumo } from "@/lib/aggregations";
import { CATEGORIA_META } from "@/lib/domain";
import { formatBRL, formatPercent } from "@/lib/formatters";

interface CategorySummaryProps {
  resumo: CategoriaResumo[];
  total: number;
}

export function CategorySummary({ resumo, total }: CategorySummaryProps) {
  const reduced = useReducedMotion();

  return (
    <aside className="rounded-2xl border border-line bg-surface-1 lg:sticky lg:top-20">
      <header className="border-b border-line px-5 py-4">
        <h3 className="text-sm font-semibold text-ink">Resumo por categoria</h3>
        <p className="mt-1 font-mono text-xs tabular-nums text-ink-muted">
          {formatBRL(total)} no filtro atual
        </p>
      </header>

      {resumo.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-ink-muted">
          Nenhuma despesa no filtro atual.
        </p>
      ) : (
        <ul className="divide-y divide-line">
          {resumo.map((item) => {
            const meta = CATEGORIA_META[item.categoria];
            return (
              <li key={item.categoria} className="px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <meta.icon size={16} style={{ color: meta.color }} />
                  <span className="flex-1 truncate text-sm text-ink">{meta.label}</span>
                  <span className="font-mono text-sm font-medium tabular-nums text-ink">
                    {formatBRL(item.total)}
                  </span>
                </div>

                <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-surface-3">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: meta.color }}
                    initial={{ width: reduced ? `${item.percentual}%` : 0 }}
                    animate={{ width: `${item.percentual}%` }}
                    transition={{ duration: reduced ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>

                <p className="mt-2 flex items-center justify-between font-mono text-[11px] tabular-nums text-ink-faint">
                  <span>
                    {item.quantidade} {item.quantidade === 1 ? "lançamento" : "lançamentos"}
                  </span>
                  <span>{formatPercent(item.percentual)}</span>
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}
