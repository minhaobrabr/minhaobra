"use client";

import * as React from "react";
import Link from "next/link";
import { ChartPie, Coins, Receipt, Wallet } from "@phosphor-icons/react/dist/ssr";

import { BudgetBar } from "@/components/dashboard/budget-bar";
import { CategoryDonut } from "@/components/dashboard/category-donut";
import { ProgressRing } from "@/components/dashboard/progress-ring";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { SpendingChart } from "@/components/dashboard/spending-chart";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { useObra } from "@/components/providers/obra-store";
import { EmptyState } from "@/components/shared/empty-state";
import { Panel } from "@/components/shared/panel";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import {
  despesasPorCategoria,
  movimentosRecentes,
  serieEvolucao,
} from "@/lib/aggregations";
import { formatBRL, formatPercentWhole } from "@/lib/formatters";

export function DashboardView() {
  const { recursos, despesas, resumo } = useObra();

  const evolucao = React.useMemo(() => serieEvolucao(recursos, despesas), [recursos, despesas]);
  const porCategoria = React.useMemo(() => despesasPorCategoria(despesas), [despesas]);
  const movimentos = React.useMemo(
    () => movimentosRecentes(recursos, despesas, 8),
    [recursos, despesas],
  );

  const semDados = recursos.length === 0 && despesas.length === 0;

  if (semDados) {
    return (
      <EmptyState
        icon={<Coins size={40} />}
        title="Sua obra ainda não tem movimentação"
        description="Cadastre as fontes de recurso e comece a lançar as despesas para acompanhar o orçamento."
        action={
          <Button asChild>
            <Link href="/recursos">Cadastrar recursos</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Linha de indicadores */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Reveal delay={0}>
          <SummaryCard
            label="Total de recursos"
            value={formatBRL(resumo.aportado)}
            delta={`${formatBRL(resumo.planejado)} planejados`}
            icon={Coins}
          />
        </Reveal>
        <Reveal delay={0.05}>
          <SummaryCard
            label="Total de despesas"
            value={formatBRL(resumo.gasto)}
            delta={`${despesas.length} lançamentos`}
            icon={Receipt}
          />
        </Reveal>
        <Reveal delay={0.1}>
          <SummaryCard
            label="Saldo disponível"
            value={formatBRL(resumo.saldo)}
            valueTone={resumo.saldo >= 0 ? "success" : "danger"}
            delta={resumo.saldo >= 0 ? "em caixa hoje" : "acima do aportado"}
            deltaPositive={resumo.saldo >= 0}
            icon={Wallet}
          />
        </Reveal>
        <Reveal delay={0.15}>
          <SummaryCard
            label="Progresso"
            value={formatPercentWhole(resumo.comprometidoPct)}
            delta={`${formatBRL(Math.max(resumo.planejado - resumo.gasto, 0))} livres`}
            icon={ChartPie}
            aside={<ProgressRing value={resumo.comprometidoPct} />}
          />
        </Reveal>
      </div>

      {/* Orçamento comprometido + posição dos aportes */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Reveal delay={0.2} className="lg:col-span-8">
          <BudgetBar gasto={resumo.gasto} orcamento={resumo.planejado} className="h-full" />
        </Reveal>
        <Reveal delay={0.24} className="lg:col-span-4">
          <div className="flex h-full flex-col justify-center rounded-2xl border border-line bg-surface-1 p-5">
            <p className="text-xs uppercase tracking-wide text-ink-muted">A aportar</p>
            {resumo.planejado > 0 ? (
              <>
                <p className="mt-1.5 font-mono text-2xl font-semibold tabular-nums text-ink">
                  {formatBRL(resumo.aAportar)}
                </p>
                <p className="mt-2 text-xs text-ink-muted">
                  Diferença entre o orçamento planejado e o total já aportado.
                </p>
              </>
            ) : (
              <>
                <p className="mt-1.5 font-mono text-2xl font-semibold tabular-nums text-ink-faint">
                  —
                </p>
                <p className="mt-2 text-xs text-ink-muted">
                  Defina um orçamento planejado no perfil da obra para acompanhar aqui.
                </p>
              </>
            )}
          </div>
        </Reveal>
      </div>

      {/* Evolução + distribuição */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Reveal delay={0.28} className="lg:col-span-8">
          <Panel
            title="Evolução do orçamento"
            description="Recursos aportados e despesas acumuladas mês a mês"
            className="h-full"
          >
            <SpendingChart data={evolucao} />
          </Panel>
        </Reveal>

        <Reveal delay={0.32} className="lg:col-span-4">
          <Panel title="Distribuição por categoria" className="h-full">
            {porCategoria.length > 0 ? (
              <CategoryDonut data={porCategoria} total={resumo.gasto} />
            ) : (
              <p className="py-10 text-center text-sm text-ink-muted">
                Nenhuma despesa lançada ainda.
              </p>
            )}
          </Panel>
        </Reveal>
      </div>

      {/* Atividade recente */}
      <Reveal delay={0.36}>
        <Panel title="Atividade recente" description="Últimas 8 movimentações da obra">
          {movimentos.length > 0 ? (
            <RecentActivity movimentos={movimentos} />
          ) : (
            <p className="py-10 text-center text-sm text-ink-muted">Nada movimentado ainda.</p>
          )}
        </Panel>
      </Reveal>
    </div>
  );
}
