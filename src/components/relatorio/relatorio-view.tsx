"use client";

import * as React from "react";
import { ChartPie, Coins, Printer, Receipt, Wallet } from "@phosphor-icons/react/dist/ssr";

import { SpendingChart } from "@/components/dashboard/spending-chart";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { useObra } from "@/components/providers/obra-store";
import { EmptyState } from "@/components/shared/empty-state";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import {
  agruparDespesasPorMes,
  despesasPorCategoria,
  periodoObra,
  serieEvolucao,
  totalAportado,
} from "@/lib/aggregations";
import { CATEGORIA_META } from "@/lib/domain";
import {
  formatBRL,
  formatDate,
  formatDateNumeric,
  formatMonthYear,
  formatPercent,
  formatPercentWhole,
} from "@/lib/formatters";

function SecaoTitulo({ numero, titulo }: { numero: string; titulo: string }) {
  return (
    <div className="mb-4 flex items-baseline gap-3 border-b border-line pb-2">
      <span className="font-mono text-xs text-ink-faint print-ink-muted">{numero}</span>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-ink print-ink">
        {titulo}
      </h3>
    </div>
  );
}

export function RelatorioView() {
  const { obra, recursos, despesas, resumo } = useObra();
  const [geradoEm, setGeradoEm] = React.useState<string | null>(null);

  // Calculado só no cliente: a data do servidor divergiria na hidratação.
  React.useEffect(() => {
    setGeradoEm(formatDateNumeric(new Date()));
  }, []);

  const evolucao = React.useMemo(() => serieEvolucao(recursos, despesas), [recursos, despesas]);
  const porCategoria = React.useMemo(() => despesasPorCategoria(despesas), [despesas]);
  const porMes = React.useMemo(() => agruparDespesasPorMes(despesas), [despesas]);
  const periodo = React.useMemo(() => periodoObra(recursos, despesas), [recursos, despesas]);

  if (recursos.length === 0 && despesas.length === 0) {
    return (
      <EmptyState
        icon={<Receipt size={40} />}
        title="Sem dados para relatar"
        description="Cadastre recursos e despesas para gerar o relatório consolidado da obra."
      />
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* 1 — Cabeçalho */}
      <header className="mb-8 flex flex-col gap-4 border-b border-line pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-ink-faint print-ink-muted">
            Relatório consolidado
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink print-ink">
            {obra.nome}
          </h2>
          {obra.endereco ? (
            <p className="mt-1 text-sm text-ink-muted print-ink-muted">{obra.endereco}</p>
          ) : null}
          <p className="mt-3 font-mono text-xs text-ink-faint print-ink-muted">
            {periodo.inicio ? formatMonthYear(periodo.inicio) : "—"}
            {" – "}
            {periodo.fim ? formatMonthYear(periodo.fim) : "—"}
            {geradoEm ? ` · Gerado em ${geradoEm}` : ""}
          </p>
        </div>

        <Button variant="outline" className="no-print shrink-0" onClick={() => window.print()}>
          <Printer size={16} />
          Exportar PDF
        </Button>
      </header>

      {/* 2 — Resumo executivo */}
      <Reveal>
        <section className="mb-10">
          <SecaoTitulo numero="01" titulo="Resumo executivo" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SummaryCard
              label="Total de recursos"
              value={formatBRL(resumo.aportado)}
              delta={`${formatBRL(resumo.planejado)} planejados`}
              icon={Coins}
              className="print-surface"
            />
            <SummaryCard
              label="Total de despesas"
              value={formatBRL(resumo.gasto)}
              delta={`${despesas.length} lançamentos`}
              icon={Receipt}
              className="print-surface"
            />
            <SummaryCard
              label="Saldo disponível"
              value={formatBRL(resumo.saldo)}
              valueTone={resumo.saldo >= 0 ? "success" : "danger"}
              delta={resumo.saldo >= 0 ? "em caixa" : "acima do aportado"}
              deltaPositive={resumo.saldo >= 0}
              icon={Wallet}
              className="print-surface"
            />
            <SummaryCard
              label="Orçamento comprometido"
              value={formatPercentWhole(resumo.comprometidoPct)}
              delta={`${formatBRL(Math.max(resumo.planejado - resumo.gasto, 0))} livres`}
              icon={ChartPie}
              className="print-surface"
            />
          </div>
        </section>
      </Reveal>

      {/* 3 — Evolução */}
      <Reveal delay={0.05}>
        <section className="mb-10">
          <SecaoTitulo numero="02" titulo="Evolução do orçamento" />
          <div className="rounded-2xl border border-line bg-surface-1 p-5 print-surface">
            <SpendingChart data={evolucao} height={320} />
          </div>
        </section>
      </Reveal>

      {/* 4 — Fontes de recursos */}
      <Reveal delay={0.1}>
        <section className="mb-10">
          <SecaoTitulo numero="03" titulo="Fontes de recursos" />

          {resumo.planejado > 0 ? (
            <div className="mb-4 grid grid-cols-1 divide-y divide-line rounded-2xl border border-line bg-surface-1 print-surface sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {[
                { label: "Orçamento planejado", valor: resumo.planejado },
                { label: "Total aportado", valor: resumo.aportado },
                { label: "Falta aportar", valor: resumo.aAportar },
              ].map((item) => (
                <div key={item.label} className="px-5 py-4">
                  <p className="text-xs uppercase tracking-wide text-ink-muted print-ink-muted">
                    {item.label}
                  </p>
                  <p className="mt-1.5 font-mono text-lg font-semibold tabular-nums text-ink print-ink">
                    {formatBRL(item.valor)}
                  </p>
                </div>
              ))}
            </div>
          ) : null}

          <div className="overflow-x-auto rounded-2xl border border-line bg-surface-1 print-surface">
            <table className="w-full min-w-[24rem]">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-muted print-ink-muted">
                  <th className="px-4 py-3 font-medium">Fonte</th>
                  <th className="px-4 py-3 text-right font-medium">Aportado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {recursos.map((recurso) => (
                  <tr key={recurso.id}>
                    <td className="px-4 py-3 text-sm text-ink print-ink">{recurso.nome}</td>
                    <td className="px-4 py-3 text-right font-mono text-sm tabular-nums text-ink print-ink">
                      {formatBRL(totalAportado(recurso))}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-line-strong">
                  <td className="px-4 py-3 text-sm font-semibold text-ink print-ink">Total</td>
                  <td className="px-4 py-3 text-right font-mono text-sm font-semibold tabular-nums text-ink print-ink">
                    {formatBRL(resumo.aportado)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>
      </Reveal>

      {/* 5 — Despesas por categoria */}
      <Reveal delay={0.15}>
        <section className="mb-10">
          <SecaoTitulo numero="04" titulo="Despesas por categoria" />
          <div className="overflow-x-auto rounded-2xl border border-line bg-surface-1 print-surface">
            <table className="w-full min-w-[36rem]">
              <thead>
                <tr className="border-b border-line text-left text-xs uppercase tracking-wide text-ink-muted print-ink-muted">
                  <th className="px-4 py-3 font-medium">Categoria</th>
                  <th className="px-4 py-3 text-right font-medium">Lançamentos</th>
                  <th className="px-4 py-3 text-right font-medium">Valor total</th>
                  <th className="px-4 py-3 text-right font-medium">% do total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {porCategoria.map((item) => (
                  <tr key={item.categoria}>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2 text-sm text-ink print-ink">
                        <span
                          aria-hidden
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: CATEGORIA_META[item.categoria].color }}
                        />
                        {CATEGORIA_META[item.categoria].label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm tabular-nums text-ink-muted print-ink">
                      {item.quantidade}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm font-semibold tabular-nums text-ink print-ink">
                      {formatBRL(item.total)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-sm tabular-nums text-ink-muted print-ink">
                      {formatPercent(item.percentual)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-line-strong">
                  <td className="px-4 py-3 text-sm font-semibold text-accent-text print-ink">
                    Total geral
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm font-semibold tabular-nums text-accent-text print-ink">
                    {despesas.length}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm font-semibold tabular-nums text-accent-text print-ink">
                    {formatBRL(resumo.gasto)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm font-semibold tabular-nums text-accent-text print-ink">
                    100,0%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>
      </Reveal>

      {/* 6 — Histórico completo */}
      <Reveal delay={0.2}>
        <section className="print-page-break">
          <SecaoTitulo numero="05" titulo="Histórico completo de despesas" />
          <div className="space-y-6">
            {porMes.map((grupo) => (
              <div key={grupo.mes}>
                <div className="mb-2 flex items-baseline justify-between gap-3">
                  <h4 className="text-sm font-semibold text-ink-muted print-ink-muted">
                    {formatMonthYear(`${grupo.mes}-01`)}
                  </h4>
                  <span className="font-mono text-xs tabular-nums text-ink-faint print-ink-muted">
                    {formatBRL(grupo.total)}
                  </span>
                </div>

                <div className="overflow-x-auto rounded-xl border border-line bg-surface-1 print-surface">
                  <table className="w-full min-w-[40rem]">
                    <tbody className="divide-y divide-line">
                      {grupo.itens.map((despesa) => (
                        <tr key={despesa.id}>
                          <td className="w-24 px-3 py-2 font-mono text-xs text-ink-faint print-ink-muted">
                            {formatDate(despesa.data)}
                          </td>
                          <td className="px-3 py-2 text-xs text-ink print-ink">
                            {despesa.descricao}
                          </td>
                          <td className="w-32 px-3 py-2 text-xs text-ink-muted print-ink-muted">
                            {CATEGORIA_META[despesa.categoria].short}
                          </td>
                          <td className="w-40 px-3 py-2 text-xs text-ink-muted print-ink-muted">
                            {despesa.fornecedor ?? "—"}
                          </td>
                          <td className="w-32 px-3 py-2 text-right font-mono text-xs font-medium tabular-nums text-ink print-ink">
                            {formatBRL(despesa.valor)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </section>
      </Reveal>
    </div>
  );
}
