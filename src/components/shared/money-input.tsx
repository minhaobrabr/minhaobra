"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const DECIMAL = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const MAX_DIGITOS = 12;

function centavosParaTexto(centavos: number): string {
  return DECIMAL.format(centavos / 100);
}

function textoParaCentavos(texto: string): number {
  const digitos = texto.replace(/\D/g, "").slice(0, MAX_DIGITOS);
  return digitos ? Number(digitos) : 0;
}

export interface MoneyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "size"> {
  value: number;
  onValueChange: (value: number) => void;
  /** `lg` para o campo principal do formulário de despesa. */
  scale?: "md" | "lg";
  invalid?: boolean;
}

/**
 * Máscara BRL com `onKeyDown` nativo — sem biblioteca externa.
 * Os dígitos entram sempre pelo fim do número, não pela posição do cursor:
 * como o texto é reescrito a cada tecla, respeitar o cursor embaralharia o valor.
 */
export const MoneyInput = React.forwardRef<HTMLInputElement, MoneyInputProps>(
  ({ value, onValueChange, scale = "md", invalid, className, onFocus, onClick, ...props }, ref) => {
    const centavos = Math.round((Number.isFinite(value) ? value : 0) * 100);
    const texto = centavosParaTexto(centavos);

    function aplicar(proximosCentavos: number) {
      onValueChange(Math.min(proximosCentavos, Number("9".repeat(MAX_DIGITOS))) / 100);
    }

    function cursorNoFim(input: HTMLInputElement) {
      const fim = input.value.length;
      input.setSelectionRange(fim, fim);
    }

    function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
      if (event.ctrlKey || event.metaKey || event.altKey) return;

      if (/^\d$/.test(event.key)) {
        event.preventDefault();
        aplicar(centavos * 10 + Number(event.key));
        return;
      }

      if (event.key === "Backspace" || event.key === "Delete") {
        event.preventDefault();
        aplicar(Math.floor(centavos / 10));
      }
    }

    // Cobre colagem e teclados virtuais que não emitem `keydown` com dígito.
    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
      aplicar(textoParaCentavos(event.currentTarget.value));
    }

    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-xl border border-line bg-surface-2 transition-colors duration-150",
          "focus-within:border-accent hover:border-line-strong",
          invalid && "border-danger",
          scale === "lg" ? "h-14 px-4" : "h-10 px-3",
          className,
        )}
      >
        <span
          aria-hidden
          className={cn(
            "select-none font-mono text-ink-faint",
            scale === "lg" ? "text-lg" : "text-xs",
          )}
        >
          R$
        </span>
        <input
          ref={ref}
          inputMode="numeric"
          autoComplete="off"
          value={texto}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          onFocus={(event) => {
            cursorNoFim(event.currentTarget);
            onFocus?.(event);
          }}
          onClick={(event) => {
            cursorNoFim(event.currentTarget);
            onClick?.(event);
          }}
          aria-invalid={invalid || undefined}
          className={cn(
            "w-full bg-transparent text-right font-mono tabular-nums text-ink outline-none",
            scale === "lg" ? "text-2xl font-semibold" : "text-sm font-medium",
          )}
          {...props}
        />
      </div>
    );
  },
);
MoneyInput.displayName = "MoneyInput";
