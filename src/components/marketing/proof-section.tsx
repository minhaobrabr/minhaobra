import * as React from "react";

import { ScrollReveal } from "@/components/marketing/scroll-reveal";

const METRICAS = [
  { valor: "R$ 23,4 mi", label: "em obra controlada" },
  { valor: "947", label: "obras concluídas" },
  { valor: "4,8", label: "avaliação média" },
];

export function ProofSection() {
  return (
    <section className="border-y border-line bg-surface-1 py-10">
      <ScrollReveal className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-line px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6">
        {METRICAS.map((metrica) => (
          <div key={metrica.label} className="px-2 py-4 text-center sm:py-0">
            <p className="font-mono text-4xl font-semibold text-ink">{metrica.valor}</p>
            <p className="mt-1 text-sm text-ink-muted">{metrica.label}</p>
          </div>
        ))}
      </ScrollReveal>
    </section>
  );
}
