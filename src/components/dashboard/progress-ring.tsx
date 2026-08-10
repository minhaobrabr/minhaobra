"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

interface ProgressRingProps {
  /** 0 a 100. */
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

function corDoProgresso(value: number): string {
  if (value >= 90) return "var(--color-danger)";
  if (value >= 70) return "var(--color-warning)";
  return "var(--color-success)";
}

export function ProgressRing({ value, size = 44, strokeWidth = 4, className }: ProgressRingProps) {
  const reduced = useReducedMotion();
  const raio = (size - strokeWidth) / 2;
  const circunferencia = 2 * Math.PI * raio;
  const progresso = Math.min(Math.max(value, 0), 100) / 100;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={cn("-rotate-90", className)}
      role="img"
      aria-label={`${Math.round(value)}% do orçamento comprometido`}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={raio}
        fill="none"
        stroke="var(--color-surface-3)"
        strokeWidth={strokeWidth}
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={raio}
        fill="none"
        stroke={corDoProgresso(value)}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circunferencia}
        initial={{ strokeDashoffset: reduced ? circunferencia * (1 - progresso) : circunferencia }}
        animate={{ strokeDashoffset: circunferencia * (1 - progresso) }}
        transition={{ duration: reduced ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}
