"use client";

import * as React from "react";
import { HardHat, Plus } from "@phosphor-icons/react/dist/ssr";

import { useObra } from "@/components/providers/obra-store";
import { PrestadorCard } from "@/components/despesas/prestador-card";
import { PrestadorModal } from "@/components/despesas/prestador-modal";
import { EmptyState } from "@/components/shared/empty-state";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { totalPagoPrestador } from "@/lib/aggregations";
import { formatBRL } from "@/lib/formatters";

export function PrestadoresView() {
  const {
    prestadores,
    despesas,
    criarPrestador,
    atualizarPrestador,
    removerPrestador,
    criarDespesa,
  } = useObra();

  const totalPagoGeral = React.useMemo(
    () => prestadores.reduce((soma, prestador) => soma + totalPagoPrestador(prestador.id, despesas), 0),
    [prestadores, despesas],
  );

  const botaoNovo = (
    <PrestadorModal
      onSubmit={criarPrestador}
      trigger={
        <Button>
          <Plus size={16} weight="bold" />
          Adicionar prestador
        </Button>
      }
    />
  );

  if (prestadores.length === 0) {
    return (
      <EmptyState
        icon={<HardHat size={40} />}
        title="Nenhum prestador cadastrado"
        description="Cadastre quem presta mão de obra ou serviço na obra para acompanhar o quanto já foi pago e o saldo devedor de cada um."
        action={botaoNovo}
      />
    );
  }

  return (
    <div className="space-y-4">
      <Reveal className="flex flex-col gap-4 rounded-2xl border border-line bg-surface-1 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-ink-muted">Total pago a prestadores</p>
          <p className="mt-1.5 font-mono text-xl font-semibold tabular-nums text-ink">
            {formatBRL(totalPagoGeral)}
          </p>
        </div>
        {botaoNovo}
      </Reveal>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {prestadores.map((prestador, index) => (
          <Reveal key={prestador.id} delay={0.05 * (index + 1)} className="h-full">
            <PrestadorCard
              prestador={prestador}
              despesas={despesas}
              onEditar={(dados) => atualizarPrestador(prestador.id, dados)}
              onExcluir={() => removerPrestador(prestador.id)}
              onPagar={criarDespesa}
            />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
