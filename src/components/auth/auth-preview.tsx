import * as React from "react";
import { Coins, Receipt, Wallet } from "@phosphor-icons/react/dist/ssr";

import { formatBRL, formatPercent } from "@/lib/formatters";

const ORCAMENTO = 270_000;
const GASTO = 207_740;
const SALDO = ORCAMENTO - GASTO;
const PROPORCAO = GASTO / ORCAMENTO;

const CARDS = [
  { label: "Orçamento total", valor: ORCAMENTO, icon: Coins, tone: "text-ink" },
  { label: "Gasto até agora", valor: GASTO, icon: Receipt, tone: "text-ink" },
  { label: "Saldo disponível", valor: SALDO, icon: Wallet, tone: "text-success" },
];

/**
 * Não é peça de marketing: é uma janela honesta para o produto,
 * com os mesmos componentes e a mesma formatação do dashboard real.
 */
export function AuthPreview() {
  return (
    <div className="hidden h-full flex-col justify-center border-l border-line bg-surface-1 p-10 lg:flex xl:p-14">
      <div className="mx-auto w-full max-w-sm">
        <div className="space-y-3">
          {CARDS.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-line bg-background p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs uppercase tracking-wide text-ink-muted">{card.label}</p>
                <span
                  aria-hidden
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-dim/30 text-accent-text"
                >
                  <card.icon size={20} />
                </span>
              </div>
              <p
                className={`mt-3 font-mono text-3xl font-semibold tabular-nums tracking-tight ${card.tone}`}
              >
                {formatBRL(card.valor)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-line bg-background p-5">
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-sm font-medium text-ink">Orçamento comprometido</p>
            <p className="font-mono text-sm font-semibold tabular-nums text-ink">
              {formatPercent(PROPORCAO * 100)}
            </p>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-3">
            <div
              className="animate-fill-bar h-full w-full rounded-full bg-warning"
              style={{ "--fill": PROPORCAO } as React.CSSProperties}
            />
          </div>
        </div>

        <p className="mt-6 text-xs text-ink-faint">
          Exemplo de obra — Reforma Residencial
        </p>
      </div>
    </div>
  );
}
