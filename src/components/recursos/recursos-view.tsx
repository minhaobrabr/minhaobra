"use client";

import * as React from "react";
import { Coins, Plus } from "@phosphor-icons/react/dist/ssr";

import { useObra } from "@/components/providers/obra-store";
import { RecursoCard } from "@/components/recursos/recurso-card";
import { RecursoModal } from "@/components/recursos/recurso-modal";
import { EmptyState } from "@/components/shared/empty-state";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { formatBRL } from "@/lib/formatters";

function ResumoStrip({
  aportado,
}: {
  aportado: number;
}) {
  const itens = [
    { label: "Total aportado", valor: formatBRL(aportado), tone: "text-success" },
  ];

  return (
    <div className="grid grid-cols-1 divide-y divide-line rounded-2xl border border-line bg-surface-1 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
      {itens.map((item) => (
        <div key={item.label} className="px-5 py-4">
          <p className="text-xs uppercase tracking-wide text-ink-muted">{item.label}</p>
          <p
            className={`mt-1.5 font-mono text-xl font-semibold tabular-nums ${item.tone}`}
          >
            {item.valor}
          </p>
        </div>
      ))}
    </div>
  );
}

export function RecursosView() {
  const {
    recursos,
    resumo,
    criarRecurso,
    atualizarRecurso,
    removerRecurso,
    registrarAporte,
  } = useObra();

  return (
    <>
      <PageHeader
        title="Recursos"
        description="As fontes de capital da obra e quanto de cada uma já entrou em caixa."
        action={
          <RecursoModal
            onSubmit={criarRecurso}
            trigger={
              <Button>
                <Plus size={16} weight="bold" />
                Adicionar recurso
              </Button>
            }
          />
        }
      />

      {recursos.length === 0 ? (
        <EmptyState
          icon={<Coins size={40} />}
          title="Nenhuma fonte cadastrada"
          description="Adicione as fontes de onde virão os recursos da sua obra."
          action={
            <RecursoModal
              onSubmit={criarRecurso}
              trigger={<Button>Adicionar primeiro recurso</Button>}
            />
          }
        />
      ) : (
        <div className="space-y-4">
          <Reveal>
            <ResumoStrip
              aportado={resumo.aportado}
            />
          </Reveal>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {recursos.map((recurso, index) => (
              <Reveal key={recurso.id} delay={0.05 * (index + 1)} className="h-full">
                <RecursoCard
                  recurso={recurso}
                  onEditar={(dados) => atualizarRecurso(recurso.id, dados)}
                  onExcluir={() => removerRecurso(recurso.id)}
                  onAportar={(dados) => registrarAporte(recurso.id, dados)}
                />
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
