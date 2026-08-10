import * as React from "react";
import { Receipt } from "@phosphor-icons/react/dist/ssr";

import { EmptyState } from "@/components/shared/empty-state";
import { formatBRL, formatDate } from "@/lib/formatters";
import type { BillingEntry } from "@/types";

interface BillingHistoryProps {
  itens: BillingEntry[];
  mensagemVazia?: string;
}

export function BillingHistory({
  itens,
  mensagemVazia = "Seu período grátis está ativo.",
}: BillingHistoryProps) {
  return (
    <div className="rounded-2xl border border-line bg-surface-1">
      <div className="border-b border-line px-6 py-4">
        <h3 className="text-sm font-semibold text-ink">Histórico de cobranças</h3>
      </div>

      {itens.length === 0 ? (
        <EmptyState
          icon={<Receipt size={32} />}
          title="Nenhuma cobrança ainda"
          description={mensagemVazia}
          className="border-0"
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[32rem]">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide">
                <th className="px-6 py-3 font-medium text-ink-muted">Data</th>
                <th className="px-6 py-3 font-medium text-ink-muted">Descrição</th>
                <th className="px-6 py-3 text-right font-medium text-ink-muted">Valor</th>
                <th className="px-6 py-3 text-right font-medium text-ink-muted">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {itens.map((item) => (
                <tr key={item.id} className="text-sm">
                  <td className="px-6 py-3 font-mono text-xs text-ink-faint">
                    {formatDate(item.data)}
                  </td>
                  <td className="px-6 py-3 text-ink">{item.descricao}</td>
                  <td className="px-6 py-3 text-right font-mono font-medium tabular-nums text-ink">
                    {formatBRL(item.valor)}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <span
                      className={
                        item.status === "PAGO"
                          ? "inline-flex items-center rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success"
                          : "inline-flex items-center rounded-full bg-danger/10 px-2.5 py-1 text-xs font-medium text-danger"
                      }
                    >
                      {item.status === "PAGO" ? "Pago" : "Falhou"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
