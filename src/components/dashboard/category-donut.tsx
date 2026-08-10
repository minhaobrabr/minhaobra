"use client";

import * as React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Skeleton } from "@/components/ui/skeleton";
import type { CategoriaResumo } from "@/lib/aggregations";
import { CATEGORIA_META } from "@/lib/domain";
import { formatBRL, formatPercent } from "@/lib/formatters";

interface CategoryDonutProps {
  data: CategoriaResumo[];
  total: number;
}

export function CategoryDonut({ data, total }: CategoryDonutProps) {
  const [pronto, setPronto] = React.useState(false);

  React.useEffect(() => {
    setPronto(true);
  }, []);

  return (
    <div>
      <div className="relative">
        {pronto ? (
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                dataKey="total"
                nameKey="categoria"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                stroke="var(--color-surface-1)"
                strokeWidth={2}
              >
                {data.map((item) => (
                  <Cell key={item.categoria} fill={CATEGORIA_META[item.categoria].color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const item = payload[0].payload as CategoriaResumo;
                  return (
                    <div className="rounded-xl border border-line bg-surface-2 px-3 py-2 shadow-float">
                      <p className="text-xs text-ink-muted">{CATEGORIA_META[item.categoria].label}</p>
                      <p className="mt-1 font-mono text-sm font-medium tabular-nums text-ink">
                        {formatBRL(item.total)}
                      </p>
                    </div>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <Skeleton className="mx-auto h-[180px] w-[180px] rounded-full" />
        )}

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[11px] uppercase tracking-wide text-ink-faint">Total</span>
          <span className="font-mono text-lg font-semibold tabular-nums text-ink">
            {formatBRL(total)}
          </span>
        </div>
      </div>

      <ul className="mt-5 space-y-3">
        {data.map((item) => {
          const meta = CATEGORIA_META[item.categoria];
          return (
            <li key={item.categoria} className="flex items-center gap-2 text-xs">
              <span
                aria-hidden
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: meta.color }}
              />
              <span className="flex-1 truncate text-ink-muted">{meta.label}</span>
              <span className="font-mono tabular-nums text-ink-faint">
                {formatPercent(item.percentual)}
              </span>
              <span className="w-24 text-right font-mono font-medium tabular-nums text-ink">
                {formatBRL(item.total)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
