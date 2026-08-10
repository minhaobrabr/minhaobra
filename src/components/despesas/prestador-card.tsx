"use client";

import * as React from "react";
import { DotsThree, PencilSimple, Plus, Trash } from "@phosphor-icons/react/dist/ssr";
import { motion, useReducedMotion } from "motion/react";

import { CategoryBadge } from "@/components/despesas/category-badge";
import { PagamentoModal } from "@/components/despesas/pagamento-modal";
import { PrestadorModal } from "@/components/despesas/prestador-modal";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { pagamentosDoPrestador, saldoPrestador } from "@/lib/aggregations";
import { CATEGORIA_META } from "@/lib/domain";
import { formatBRL, formatDate } from "@/lib/formatters";
import type { Despesa, Prestador } from "@/types";

interface PrestadorCardProps {
  prestador: Prestador;
  despesas: Despesa[];
  onEditar: (dados: Omit<Prestador, "id">) => void;
  onExcluir: () => void;
  onPagar: (dados: Omit<Despesa, "id">) => void;
}

export function PrestadorCard({
  prestador,
  despesas,
  onEditar,
  onExcluir,
  onPagar,
}: PrestadorCardProps) {
  const reduced = useReducedMotion();
  const [editando, setEditando] = React.useState(false);
  const [excluindo, setExcluindo] = React.useState(false);

  const meta = CATEGORIA_META[prestador.categoria];
  const { pago, saldo, percentualPago } = saldoPrestador(prestador, despesas);
  const pagamentos = pagamentosDoPrestador(prestador.id, despesas);
  const ultimos = pagamentos.slice(0, 3);

  return (
    <motion.article
      whileHover={reduced ? undefined : { scale: 1.01 }}
      transition={{ duration: 0.15 }}
      className="flex h-full flex-col rounded-2xl border border-line bg-surface-1 p-5"
    >
      <header className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span
            aria-hidden
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-2 text-ink-muted"
          >
            <meta.icon size={18} style={{ color: meta.color }} />
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-ink">{prestador.nome}</h3>
            <div className="mt-1.5">
              <CategoryBadge category={prestador.categoria} />
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label={`Ações de ${prestador.nome}`}
              className="rounded-full p-1.5 text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
            >
              <DotsThree size={18} weight="bold" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => setEditando(true)}>
              <PencilSimple size={15} />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem destructive onSelect={() => setExcluindo(true)}>
              <Trash size={15} />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <PrestadorModal
          open={editando}
          onOpenChange={setEditando}
          prestador={prestador}
          onSubmit={onEditar}
        />
        <ConfirmDialog
          open={excluindo}
          onOpenChange={setExcluindo}
          title="Excluir prestador"
          itemName={prestador.nome}
          description="Os pagamentos já lançados continuam no histórico de despesas, sem o vínculo."
          consequence="deixará de aparecer nesta lista."
          onConfirm={onExcluir}
        />
      </header>

      <div className="mt-5">
        {prestador.valorContratado ? (
          <>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-3">
              <motion.div
                className="h-full rounded-full bg-accent"
                initial={{ width: reduced ? `${Math.min(percentualPago ?? 0, 100)}%` : 0 }}
                animate={{ width: `${Math.min(percentualPago ?? 0, 100)}%` }}
                transition={{ duration: reduced ? 0 : 0.8, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <p className="mt-2.5 font-mono text-sm tabular-nums text-ink-muted">
              <span className="font-medium text-ink">{formatBRL(pago)}</span> de{" "}
              {formatBRL(prestador.valorContratado)} pagos
            </p>
            <p
              className={`mt-1 font-mono text-xs tabular-nums ${
                (saldo ?? 0) > 0 ? "text-warning" : "text-success"
              }`}
            >
              {(saldo ?? 0) > 0 ? `Falta pagar ${formatBRL(saldo ?? 0)}` : "Quitado"}
            </p>
          </>
        ) : (
          <p className="font-mono text-sm tabular-nums text-ink-muted">
            Total pago: <span className="font-medium text-ink">{formatBRL(pago)}</span>
          </p>
        )}
      </div>

      {ultimos.length > 0 ? (
        <ul className="mt-4 divide-y divide-line border-t border-line">
          {ultimos.map((pagamento) => (
            <li key={pagamento.id} className="flex items-center justify-between gap-3 py-2 text-xs">
              <span className="font-mono text-ink-faint">{formatDate(pagamento.data)}</span>
              <span className="truncate text-ink-muted">{pagamento.descricao}</span>
              <span className="font-mono font-medium tabular-nums text-ink">
                {formatBRL(pagamento.valor)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 border-t border-line pt-4 text-xs text-ink-faint">
          Nenhum pagamento registrado ainda.
        </p>
      )}

      <footer className="mt-auto flex items-center gap-2 pt-4">
        <PagamentoModal
          prestador={prestador}
          onSubmit={onPagar}
          trigger={
            <Button variant="outline" size="sm">
              <Plus size={14} weight="bold" />
              Novo pagamento
            </Button>
          }
        />
        {pagamentos.length > 3 ? (
          <span className="font-mono text-[11px] text-ink-faint">
            +{pagamentos.length - 3} {pagamentos.length - 3 === 1 ? "pagamento anterior" : "pagamentos anteriores"}
          </span>
        ) : null}
      </footer>
    </motion.article>
  );
}
