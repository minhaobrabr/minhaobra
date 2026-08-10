import * as React from "react";
import { BellSimple, ChartLine, Coins, FileText, Receipt } from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";

import { BudgetBar } from "@/components/dashboard/budget-bar";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { formatBRL } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface Feature {
  titulo: string;
  descricao: string;
  icon: Icon;
}

const FEATURES: Feature[] = [
  {
    titulo: "Fontes de recurso",
    descricao: "Cadastre de onde vem cada real da sua obra.",
    icon: Coins,
  },
  {
    titulo: "Despesas organizadas",
    descricao: "Materiais, mão de obra, serviços e outros.",
    icon: Receipt,
  },
  {
    titulo: "Relatório completo",
    descricao: "Exporte o histórico da obra quando precisar.",
    icon: FileText,
  },
  {
    titulo: "Alertas de orçamento",
    descricao: "Saiba antes de estourar o limite.",
    icon: BellSimple,
  },
];

function FeatureCell({
  feature,
  tinted,
  className,
}: {
  feature: Feature;
  tinted?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col justify-center rounded-2xl border border-line p-6",
        tinted ? "bg-accent-dim/15" : "bg-surface-1",
        className,
      )}
    >
      <feature.icon size={22} className="text-accent-text" />
      <h3 className="mt-3 text-sm font-semibold text-ink">{feature.titulo}</h3>
      <p className="mt-1 text-sm text-ink-muted">{feature.descricao}</p>
    </div>
  );
}

export function FeaturesSection() {
  return (
    <section id="recursos" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <ScrollReveal>
        <h2 className="max-w-lg text-3xl font-semibold tracking-tight text-ink">
          Tudo que você precisa para não perder o controle
        </h2>
      </ScrollReveal>

      <ScrollReveal delay={0.08} className="mt-10">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:grid-rows-[180px_180px_180px]">
          {/* Célula destaque — composição real do dashboard como pano de fundo */}
          <div className="relative overflow-hidden rounded-2xl border border-line bg-surface-1 p-6 lg:col-start-1 lg:col-span-2 lg:row-start-1 lg:row-span-2">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 flex select-none flex-col gap-3 p-6 opacity-40"
            >
              <SummaryCard
                label="Saldo disponível"
                value={formatBRL(43_180)}
                valueTone="success"
                icon={ChartLine}
                className="max-w-xs"
              />
              <div className="max-w-xs">
                <BudgetBar gasto={84_320} orcamento={127_500} />
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-surface-1 via-surface-1/90 to-transparent p-6 pt-16">
              <ChartLine size={22} className="text-accent-text" />
              <h3 className="mt-3 text-base font-semibold text-ink">Dashboard em tempo real</h3>
              <p className="mt-1 text-sm text-ink-muted">
                Veja o saldo disponível a qualquer momento.
              </p>
            </div>
          </div>

          <FeatureCell feature={FEATURES[0]} className="lg:col-start-3 lg:row-start-1" />
          <FeatureCell feature={FEATURES[1]} className="lg:col-start-3 lg:row-start-2" />
          <FeatureCell feature={FEATURES[2]} className="lg:col-start-1 lg:row-start-3" />
          <FeatureCell
            feature={FEATURES[3]}
            tinted
            className="lg:col-start-2 lg:col-span-2 lg:row-start-3"
          />
        </div>
      </ScrollReveal>
    </section>
  );
}
