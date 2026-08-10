"use client";

import * as React from "react";

import { CATEGORIAS, CATEGORIA_META } from "@/lib/domain";
import { cn } from "@/lib/utils";
import type { CategoriaDespesa } from "@/types";

interface CategorySegmentedProps {
  value: CategoriaDespesa | null;
  onChange: (categoria: CategoriaDespesa) => void;
  invalid?: boolean;
}

/** Segmented control próprio — radios nativos não dariam o alvo de toque nem o visual pill. */
export function CategorySegmented({ value, onChange, invalid }: CategorySegmentedProps) {
  return (
    <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Categoria da despesa">
      {CATEGORIAS.map((categoria) => {
        const meta = CATEGORIA_META[categoria];
        const ativo = value === categoria;

        return (
          <button
            key={categoria}
            type="button"
            role="radio"
            aria-checked={ativo}
            onClick={() => onChange(categoria)}
            className={cn(
              // borda sempre 1px + ring para o estado ativo: dobrar a borda causaria pulo de layout
              "flex items-center gap-2.5 rounded-xl border px-3.5 py-3 text-left transition-colors duration-150",
              ativo
                ? "border-accent bg-surface-2 text-ink ring-1 ring-accent"
                : "border-line bg-surface-1 text-ink-muted hover:border-line-strong hover:text-ink",
              !ativo && invalid && "border-danger/60",
            )}
          >
            <meta.icon
              size={20}
              style={ativo ? { color: meta.color } : undefined}
              className={ativo ? undefined : "text-ink-faint"}
            />
            <span className="text-xs font-medium">{meta.label}</span>
          </button>
        );
      })}
    </div>
  );
}
