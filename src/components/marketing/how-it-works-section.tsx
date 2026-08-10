"use client";

import * as React from "react";
import { Coins } from "@phosphor-icons/react/dist/ssr";

import { BudgetBar } from "@/components/dashboard/budget-bar";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { CategorySegmented } from "@/components/despesas/category-segmented";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { RecursoCard } from "@/components/recursos/recurso-card";
import { MoneyInput } from "@/components/shared/money-input";
import { recursosMock } from "@/lib/mock-data";
import { formatBRL } from "@/lib/formatters";

const recursoExemplo = recursosMock[1];

function PassoIlustracao({ children }: { children: React.ReactNode }) {
  return (
    <div className="pointer-events-none mt-5 origin-top-left scale-[0.85] select-none sm:scale-90">
      {children}
    </div>
  );
}

const PASSOS = [
  {
    numero: 1,
    titulo: "Cadastre suas fontes de recurso",
    descricao: "Dinheiro próprio, financiamento, FGTS, aporte de sócio.",
    ilustracao: (
      <PassoIlustracao>
        <div className="max-w-sm">
          <RecursoCard
            recurso={recursoExemplo}
            onEditar={() => {}}
            onExcluir={() => {}}
            onAportar={() => {}}
          />
        </div>
      </PassoIlustracao>
    ),
  },
  {
    numero: 2,
    titulo: "Registre cada gasto",
    descricao: "Material, mão de obra, serviço terceirizado ou outros.",
    ilustracao: (
      <PassoIlustracao>
        <div className="max-w-sm space-y-4 rounded-2xl border border-line bg-surface-1 p-5">
          <p className="text-xs font-medium tracking-wide text-ink-muted">Categoria</p>
          <CategorySegmented value="MAO_DE_OBRA" onChange={() => {}} />
          <div>
            <p className="mb-1.5 text-xs font-medium tracking-wide text-ink-muted">Valor</p>
            <MoneyInput value={2450} onValueChange={() => {}} scale="lg" />
          </div>
        </div>
      </PassoIlustracao>
    ),
  },
  {
    numero: 3,
    titulo: "Acompanhe o saldo em tempo real",
    descricao: "Saiba sempre quanto ainda tem disponível.",
    ilustracao: (
      <PassoIlustracao>
        <div className="max-w-sm space-y-3">
          <SummaryCard
            label="Saldo disponível"
            value={formatBRL(43_180)}
            valueTone="success"
            icon={Coins}
          />
          <BudgetBar gasto={84_320} orcamento={127_500} />
        </div>
      </PassoIlustracao>
    ),
  },
];

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-28">
      <ScrollReveal>
        <h2 className="text-3xl font-semibold tracking-tight text-ink">
          Três passos para ter sua obra sob controle
        </h2>
      </ScrollReveal>

      <div className="mt-14">
        {PASSOS.map((passo, index) => (
          <ScrollReveal key={passo.numero} delay={index * 0.05}>
            <div className="flex gap-5">
              <div className="flex flex-col items-center">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">
                  {passo.numero}
                </span>
                {index < PASSOS.length - 1 ? <span className="mx-auto mt-2 h-16 w-px bg-line" /> : null}
              </div>

              <div className="min-w-0 flex-1 pb-14">
                <h3 className="text-lg font-medium text-ink">{passo.titulo}</h3>
                <p className="mt-1 text-sm text-ink-muted">{passo.descricao}</p>
                {passo.ilustracao}
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
