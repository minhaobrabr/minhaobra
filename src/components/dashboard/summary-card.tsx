import * as React from "react";
import { TrendDown, TrendUp } from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

interface SummaryCardProps {
  label: string;
  /** Já formatado — o card não formata nada. */
  value: string;
  delta?: string;
  deltaPositive?: boolean;
  icon: Icon;
  valueTone?: "default" | "success" | "danger";
  /** Conteúdo opcional à direita do valor (ex.: anel de progresso). */
  aside?: React.ReactNode;
  className?: string;
}

const TONE: Record<NonNullable<SummaryCardProps["valueTone"]>, string> = {
  default: "text-ink",
  success: "text-success",
  danger: "text-danger",
};

export function SummaryCard({
  label,
  value,
  delta,
  deltaPositive,
  icon: IconComponent,
  valueTone = "default",
  aside,
  className,
}: SummaryCardProps) {
  const DeltaIcon = deltaPositive ? TrendUp : TrendDown;

  return (
    <div
      className={cn(
        "rounded-2xl border border-line bg-surface-1 p-5 transition-colors duration-150 hover:border-line-strong",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs uppercase tracking-wide text-ink-muted">{label}</p>
        <span
          aria-hidden
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-dim/30 text-accent-text"
        >
          <IconComponent size={20} />
        </span>
      </div>

      <div className="mt-3 flex items-end justify-between gap-3">
        <p
          className={cn(
            "font-mono text-2xl font-semibold tabular-nums tracking-tight sm:text-[26px] xl:text-3xl",
            TONE[valueTone],
          )}
        >
          {value}
        </p>
        {aside ? <div className="shrink-0">{aside}</div> : null}
      </div>

      {delta ? (
        <p
          className={cn(
            "mt-2.5 flex items-center gap-1.5 text-xs",
            deltaPositive === undefined
              ? "text-ink-muted"
              : deltaPositive
                ? "text-success"
                : "text-danger",
          )}
        >
          {deltaPositive === undefined ? null : <DeltaIcon size={13} weight="bold" />}
          <span className="font-mono tabular-nums">{delta}</span>
        </p>
      ) : null}
    </div>
  );
}
