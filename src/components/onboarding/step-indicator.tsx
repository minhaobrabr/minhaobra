import * as React from "react";

import { cn } from "@/lib/utils";

export interface StepIndicatorProps {
  steps: string[];
  /** 0-indexed. */
  currentStep: number;
}

/**
 * Preparado para uma futura versão multi-etapas do onboarding — a tela atual
 * é de passo único e não renderiza isto, mas o componente já existe pronto.
 */
export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <ol className="flex items-center" aria-label="Progresso">
      {steps.map((step, index) => {
        const completo = index < currentStep;
        const ativo = index === currentStep;

        return (
          <li key={step} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <span
                aria-current={ativo ? "step" : undefined}
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                  completo && "bg-success text-white",
                  ativo && "bg-accent text-white",
                  !completo && !ativo && "bg-surface-3 text-ink-faint",
                )}
              >
                {index + 1}
              </span>
              <span
                className={cn(
                  "text-[11px]",
                  ativo ? "text-ink" : "text-ink-faint",
                )}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 ? (
              <span
                aria-hidden
                className={cn("mx-2 h-px flex-1", completo ? "bg-success" : "bg-line")}
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
