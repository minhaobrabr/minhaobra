"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

import { CATEGORIA_META, RECURSO_TIPO_META } from "@/lib/domain";
import { formatBRL, formatDate, formatRelativeDate } from "@/lib/formatters";
import type { Movimento } from "@/types";

function IconeDoMovimento({ movimento }: { movimento: Movimento }) {
  if (movimento.tipo === "ENTRADA") {
    const Icone = RECURSO_TIPO_META[movimento.recursoTipo ?? "OUTRO"].icon;
    return <Icone size={16} className="text-success" />;
  }
  const Icone = CATEGORIA_META[movimento.categoria ?? "OUTRO"].icon;
  return <Icone size={16} style={{ color: CATEGORIA_META[movimento.categoria ?? "OUTRO"].color }} />;
}

export function RecentActivity({ movimentos }: { movimentos: Movimento[] }) {
  return (
    <div>
      <ul className="divide-y divide-line">
        {movimentos.map((movimento) => (
          <li key={`${movimento.tipo}-${movimento.id}`} className="flex items-center gap-3 py-3">
            <span
              aria-hidden
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-2"
            >
              <IconeDoMovimento movimento={movimento} />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm text-ink">{movimento.descricao}</span>
              <span className="mt-0.5 flex items-center gap-2 font-mono text-[11px] text-ink-faint">
                <span>{formatDate(movimento.data)}</span>
                <span aria-hidden>·</span>
                <span>{formatRelativeDate(movimento.data)}</span>
              </span>
            </span>

            <span
              className={`shrink-0 font-mono text-sm font-medium tabular-nums ${
                movimento.tipo === "ENTRADA" ? "text-success" : "text-danger"
              }`}
            >
              {movimento.tipo === "ENTRADA" ? "+" : "−"}
              {formatBRL(movimento.valor)}
            </span>
          </li>
        ))}
      </ul>

      <div className="border-t border-line pt-3">
        <Link
          href="/despesas"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-accent-text transition-colors hover:text-accent"
        >
          Ver tudo
          <ArrowRight size={12} weight="bold" />
        </Link>
      </div>
    </div>
  );
}
