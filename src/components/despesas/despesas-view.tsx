"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Receipt } from "@phosphor-icons/react/dist/ssr";

import { PageHeader } from "@/components/layout/page-header";
import { CategorySummary } from "@/components/despesas/category-summary";
import {
  DespesaFilters,
  FILTROS_INICIAIS,
  filtrosAtivos,
  type FiltrosDespesa,
} from "@/components/despesas/despesa-filters";
import { DespesaTable } from "@/components/despesas/despesa-table";
import { PrestadoresView } from "@/components/despesas/prestadores-view";
import { useObra } from "@/components/providers/obra-store";
import { EmptyState } from "@/components/shared/empty-state";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { despesasPorCategoria, totalDespesas } from "@/lib/aggregations";
import { toISODate } from "@/lib/formatters";
import type { Despesa } from "@/types";

function inicioDoPeriodo(periodo: FiltrosDespesa["periodo"], hoje: Date): string | undefined {
  if (periodo === "MES") return toISODate(new Date(hoje.getFullYear(), hoje.getMonth(), 1));
  if (periodo === "TRIMESTRE") return toISODate(new Date(hoje.getFullYear(), hoje.getMonth() - 2, 1));
  if (periodo === "ANO") return toISODate(new Date(hoje.getFullYear(), 0, 1));
  return undefined;
}

function aplicarFiltros(despesas: Despesa[], filtros: FiltrosDespesa): Despesa[] {
  const hoje = new Date();
  const de = filtros.periodo === "PERSONALIZADO" ? filtros.de : inicioDoPeriodo(filtros.periodo, hoje);
  const ate = filtros.periodo === "PERSONALIZADO" ? filtros.ate : undefined;
  const busca = filtros.busca.trim().toLowerCase();

  return despesas
    .filter((despesa) => {
      if (filtros.categorias.length > 0 && !filtros.categorias.includes(despesa.categoria)) {
        return false;
      }
      if (de && despesa.data < de) return false;
      if (ate && despesa.data > ate) return false;
      if (busca) {
        const alvo = `${despesa.descricao} ${despesa.fornecedor ?? ""}`.toLowerCase();
        if (!alvo.includes(busca)) return false;
      }
      return true;
    })
    .sort((a, b) => b.data.localeCompare(a.data));
}

export function DespesasView() {
  const { despesas, prestadores, removerDespesa } = useObra();
  const [filtros, setFiltros] = React.useState<FiltrosDespesa>(FILTROS_INICIAIS);

  const filtradas = React.useMemo(() => aplicarFiltros(despesas, filtros), [despesas, filtros]);
  const resumo = React.useMemo(() => despesasPorCategoria(filtradas), [filtradas]);
  const total = React.useMemo(() => totalDespesas(filtradas), [filtradas]);

  const botaoNova = (
    <Button asChild>
      <Link href="/despesas/nova">
        <Plus size={16} weight="bold" />
        Nova despesa
      </Link>
    </Button>
  );

  return (
    <>
      <PageHeader
        title="Despesas"
        description="Todo lançamento da obra, com categoria, fornecedor e nota fiscal."
        action={botaoNova}
      />

      <Tabs defaultValue="lancamentos">
        <TabsList className="mb-5">
          <TabsTrigger value="prestadores">
            Prestadores{prestadores.length > 0 ? ` (${prestadores.length})` : ""}
          </TabsTrigger>
          <TabsTrigger value="lancamentos">Lançamentos</TabsTrigger>
        </TabsList>

        <TabsContent value="prestadores" className="mt-0">
          <PrestadoresView />
        </TabsContent>

        <TabsContent value="lancamentos" className="mt-0">
          {despesas.length === 0 ? (
            <EmptyState
              icon={<Receipt size={40} />}
              title="Nenhuma despesa lançada"
              description="Registre o primeiro gasto para começar a acompanhar o orçamento da obra."
              action={botaoNova}
            />
          ) : (
            <>
              <DespesaFilters filtros={filtros} onChange={setFiltros} />

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
                <Reveal className="min-w-0 lg:col-span-8">
                  {filtradas.length === 0 ? (
                    <EmptyState
                      icon={<Receipt size={40} />}
                      title="Nenhum resultado"
                      description="Nenhuma despesa corresponde aos filtros aplicados."
                      action={
                        filtrosAtivos(filtros) ? (
                          <Button variant="outline" onClick={() => setFiltros(FILTROS_INICIAIS)}>
                            Limpar filtros
                          </Button>
                        ) : undefined
                      }
                    />
                  ) : (
                    <DespesaTable
                      despesas={filtradas}
                      prestadores={prestadores}
                      onExcluir={removerDespesa}
                    />
                  )}
                </Reveal>

                <Reveal delay={0.06} className="lg:col-span-4">
                  <CategorySummary resumo={resumo} total={total} />
                </Reveal>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
}
