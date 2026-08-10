"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps,
} from "recharts";

import { Skeleton } from "@/components/ui/skeleton";
import type { PontoEvolucao } from "@/lib/aggregations";
import { formatBRL, formatBRLAxis } from "@/lib/formatters";

function ChartTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-line bg-surface-2 px-3 py-2.5 shadow-float">
      <p className="mb-2 font-mono text-[11px] uppercase tracking-wide text-ink-faint">{label}</p>
      <div className="space-y-1.5">
        {payload.map((entry) => (
          <div key={entry.dataKey} className="flex items-center justify-between gap-6 text-xs">
            <span className="flex items-center gap-2 text-ink-muted">
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              {entry.dataKey === "recursos" ? "Recursos" : "Despesas"}
            </span>
            <span className="font-mono font-medium tabular-nums text-ink">
              {formatBRL(entry.value ?? 0)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface SpendingChartProps {
  data: PontoEvolucao[];
  height?: number;
}

export function SpendingChart({ data, height = 240 }: SpendingChartProps) {
  const [pronto, setPronto] = React.useState(false);

  React.useEffect(() => {
    setPronto(true);
  }, []);

  if (!pronto) {
    return <Skeleton className="w-full" style={{ height }} />;
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="areaDespesas" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.2} />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid
          vertical={false}
          stroke="var(--color-line)"
          strokeOpacity={0.4}
          strokeDasharray="0"
        />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={false}
          minTickGap={16}
          tick={{ fill: "var(--color-ink-faint)", fontSize: 11, fontFamily: "var(--font-mono)" }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={70}
          tickFormatter={formatBRLAxis}
          tick={{ fill: "var(--color-ink-faint)", fontSize: 11, fontFamily: "var(--font-mono)" }}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ stroke: "var(--color-line-strong)" }} />

        <Area
          type="monotone"
          dataKey="recursos"
          stroke="var(--color-line-strong)"
          strokeWidth={1.5}
          strokeDasharray="5 4"
          fill="none"
          activeDot={{ r: 3, fill: "var(--color-line-strong)", strokeWidth: 0 }}
        />
        <Area
          type="monotone"
          dataKey="despesas"
          stroke="var(--color-accent)"
          strokeWidth={2}
          fill="url(#areaDespesas)"
          activeDot={{ r: 3.5, fill: "var(--color-accent)", strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
