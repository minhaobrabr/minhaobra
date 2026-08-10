"use client";

import * as React from "react";
import Link from "next/link";
import { CaretLeft, CaretRight, PencilSimple, Trash } from "@phosphor-icons/react/dist/ssr";

import { CategoryBadge } from "@/components/despesas/category-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { formatBRL, formatDate } from "@/lib/formatters";
import type { Despesa, Prestador } from "@/types";

const POR_PAGINA = 20;

interface DespesaTableProps {
  despesas: Despesa[];
  prestadores: Prestador[];
  onExcluir: (id: string) => void;
}

export function DespesaTable({ despesas, prestadores, onExcluir }: DespesaTableProps) {
  const [pagina, setPagina] = React.useState(1);
  const [paraExcluir, setParaExcluir] = React.useState<Despesa | null>(null);

  const totalPaginas = Math.max(Math.ceil(despesas.length / POR_PAGINA), 1);

  React.useEffect(() => {
    setPagina(1);
  }, [despesas.length]);

  const paginaAtual = Math.min(pagina, totalPaginas);
  const inicio = (paginaAtual - 1) * POR_PAGINA;
  const visiveis = despesas.slice(inicio, inicio + POR_PAGINA);

  function nomeFornecedor(despesa: Despesa): string {
    if (despesa.prestadorId) {
      const prestador = prestadores.find((item) => item.id === despesa.prestadorId);
      if (prestador) return prestador.nome;
    }
    return despesa.fornecedor ?? "—";
  }

  return (
    <div className="rounded-2xl border border-line bg-surface-1">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[52rem] table-fixed">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-muted">
              <th className="w-28 px-4 py-3 font-medium">Data</th>
              <th className="px-4 py-3 font-medium">Descrição</th>
              <th className="w-36 px-4 py-3 font-medium">Categoria</th>
              <th className="w-44 px-4 py-3 font-medium">Fornecedor</th>
              <th className="w-36 px-4 py-3 text-right font-medium">Valor</th>
              <th className="w-20 px-4 py-3 text-right font-medium">
                <span className="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {visiveis.map((despesa) => (
              <tr
                key={despesa.id}
                className="group transition-colors duration-100 hover:bg-surface-2/50"
              >
                <td className="px-4 py-3 font-mono text-xs text-ink-faint">
                  {formatDate(despesa.data)}
                </td>
                <td className="px-4 py-3">
                  <span className="block truncate text-sm text-ink">{despesa.descricao}</span>
                  {despesa.notaFiscal ? (
                    <span className="mt-0.5 block font-mono text-[11px] text-ink-faint">
                      {despesa.notaFiscal}
                    </span>
                  ) : null}
                </td>
                <td className="px-4 py-3">
                  <CategoryBadge category={despesa.categoria} />
                </td>
                <td className="truncate px-4 py-3 text-xs text-ink-muted">
                  {nomeFornecedor(despesa)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-sm font-medium tabular-nums text-ink">
                  {formatBRL(despesa.valor)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity duration-150 focus-within:opacity-100 group-hover:opacity-100">
                    <Link
                      href={`/despesas/nova?id=${despesa.id}`}
                      aria-label={`Editar ${despesa.descricao}`}
                      className="rounded-full p-1.5 text-ink-muted transition-colors hover:bg-surface-3 hover:text-ink"
                    >
                      <PencilSimple size={15} />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setParaExcluir(despesa)}
                      aria-label={`Excluir ${despesa.descricao}`}
                      className="rounded-full p-1.5 text-ink-muted transition-colors hover:bg-danger/10 hover:text-danger"
                    >
                      <Trash size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-line px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-xs text-ink-faint">
          Mostrando {despesas.length === 0 ? 0 : inicio + 1}-
          {Math.min(inicio + POR_PAGINA, despesas.length)} de {despesas.length}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPagina((atual) => Math.max(atual - 1, 1))}
            disabled={paginaAtual === 1}
            className="flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs text-ink-muted transition-colors hover:border-line-strong hover:text-ink disabled:pointer-events-none disabled:opacity-40"
          >
            <CaretLeft size={12} weight="bold" />
            Anterior
          </button>
          <span className="font-mono text-xs text-ink-faint">
            {paginaAtual}/{totalPaginas}
          </span>
          <button
            type="button"
            onClick={() => setPagina((atual) => Math.min(atual + 1, totalPaginas))}
            disabled={paginaAtual === totalPaginas}
            className="flex items-center gap-1 rounded-full border border-line px-3 py-1.5 text-xs text-ink-muted transition-colors hover:border-line-strong hover:text-ink disabled:pointer-events-none disabled:opacity-40"
          >
            Próxima
            <CaretRight size={12} weight="bold" />
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={paraExcluir !== null}
        onOpenChange={(aberto) => (aberto ? null : setParaExcluir(null))}
        title="Excluir despesa"
        itemName={paraExcluir?.descricao ?? ""}
        onConfirm={() => {
          if (paraExcluir) onExcluir(paraExcluir.id);
          setParaExcluir(null);
        }}
      />
    </div>
  );
}
