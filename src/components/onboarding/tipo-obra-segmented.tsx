"use client";

import * as React from "react";

import { TIPOS_OBRA, TIPO_OBRA_META } from "@/lib/domain";
import { cn } from "@/lib/utils";
import type { TipoObra } from "@/types";

interface TipoObraSegmentedProps {
  value: TipoObra | null;
  onChange: (tipo: TipoObra) => void;
  invalid?: boolean;
}

/** Mesmo padrão do CategorySegmented de despesas — pill grande, 2x2, ícone + label. */
export function TipoObraSegmented({ value, onChange, invalid }: TipoObraSegmentedProps) {
  return (
    <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Tipo de obra">
      {TIPOS_OBRA.map((tipo) => {
        const meta = TIPO_OBRA_META[tipo];
        const ativo = value === tipo;

        return (
          <button
            key={tipo}
            type="button"
            role="radio"
            aria-checked={ativo}
            onClick={() => onChange(tipo)}
            className={cn(
              "flex items-center gap-2.5 rounded-xl border px-3.5 py-3 text-left transition-colors duration-150",
              ativo
                ? "border-accent bg-surface-2 text-ink ring-1 ring-accent"
                : "border-line bg-surface-1 text-ink-muted hover:border-line-strong hover:text-ink",
              !ativo && invalid && "border-danger/60",
            )}
          >
            <meta.icon size={20} className={ativo ? "text-accent-text" : "text-ink-faint"} />
            <span className="text-xs font-medium">{meta.label}</span>
          </button>
        );
      })}
    </div>
  );
}
