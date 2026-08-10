"use client";

import * as React from "react";
import { DotsThree, PencilSimple, Plus, Trash } from "@phosphor-icons/react/dist/ssr";
import { motion, useReducedMotion } from "motion/react";

import { AporteModal } from "@/components/recursos/aporte-modal";
import { RecursoModal } from "@/components/recursos/recurso-modal";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { totalAportado } from "@/lib/aggregations";
import { RECURSO_TIPO_META } from "@/lib/domain";
import { formatBRL, formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { Aporte, Recurso } from "@/types";

interface RecursoCardProps {
  recurso: Recurso;
  onEditar: (dados: Omit<Recurso, "id" | "aportes">) => void;
  onExcluir: () => void;
  onAportar: (dados: Omit<Aporte, "id">) => void;
}

export function RecursoCard({ recurso, onEditar, onExcluir, onAportar }: RecursoCardProps) {
  const reduced = useReducedMotion();
  // Os diálogos vivem fora do DropdownMenu: se ficassem dentro, fechariam junto com o menu.
  const [editando, setEditando] = React.useState(false);
  const [excluindo, setExcluindo] = React.useState(false);
  const meta = RECURSO_TIPO_META[recurso.tipo];
  const aportado = totalAportado(recurso);
  const ultimos = [...recurso.aportes].sort((a, b) => b.data.localeCompare(a.data)).slice(0, 3);

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
            <meta.icon size={18} />
          </span>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-ink">{recurso.nome}</h3>
            <Badge size="sm" className={cn("mt-1.5", meta.chip)}>
              <span aria-hidden className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
              {meta.label}
            </Badge>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label={`Ações de ${recurso.nome}`}
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

        <RecursoModal
          open={editando}
          onOpenChange={setEditando}
          recurso={recurso}
          onSubmit={onEditar}
        />
        <ConfirmDialog
          open={excluindo}
          onOpenChange={setExcluindo}
          title="Excluir recurso"
          itemName={recurso.nome}
          description="Todos os aportes vinculados a esta fonte serão perdidos."
          onConfirm={onExcluir}
        />
      </header>

      <div className="mt-5">
        <p className="font-mono text-sm tabular-nums text-ink-muted">
          Total aportado:{" "}
          <span className="font-medium text-ink">{formatBRL(aportado)}</span>
        </p>
      </div>

      {ultimos.length > 0 ? (
        <ul className="mt-4 divide-y divide-line border-t border-line">
          {ultimos.map((aporte) => (
            <li key={aporte.id} className="flex items-center justify-between gap-3 py-2 text-xs">
              <span className="font-mono text-ink-faint">{formatDate(aporte.data)}</span>
              <span className="truncate text-ink-muted">{aporte.observacao ?? "Aporte"}</span>
              <span className="font-mono font-medium tabular-nums text-ink">
                {formatBRL(aporte.valor)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 border-t border-line pt-4 text-xs text-ink-faint">
          Nenhum aporte registrado nesta fonte.
        </p>
      )}

      <footer className="mt-auto flex items-center gap-2 pt-4">
        <AporteModal
          recurso={recurso}
          onSubmit={onAportar}
          trigger={
            <Button variant="outline" size="sm">
              <Plus size={14} weight="bold" />
              Novo aporte
            </Button>
          }
        />
        {recurso.aportes.length > 3 ? (
          <span className="font-mono text-[11px] text-ink-faint">
            +{recurso.aportes.length - 3}{" "}
            {recurso.aportes.length - 3 === 1 ? "aporte anterior" : "aportes anteriores"}
          </span>
        ) : null}
      </footer>
    </motion.article>
  );
}
