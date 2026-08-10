import * as React from "react";
import Link from "next/link";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";

import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { Button } from "@/components/ui/button";

const ITENS = [
  "1 obra ativa",
  "Recursos ilimitados",
  "Despesas ilimitadas",
  "Dashboard e relatório completo",
  "Exportação de dados",
  "Suporte por e-mail",
];

export function PricingSection() {
  return (
    <section id="preco" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <ScrollReveal>
        <h2 className="text-center text-3xl font-semibold tracking-tight text-ink">
          Um plano. Simples assim.
        </h2>
      </ScrollReveal>

      <ScrollReveal delay={0.08} className="mt-10">
        <div className="mx-auto max-w-sm rounded-2xl border-2 border-accent bg-surface-1 p-8">
          <p className="text-center text-sm font-medium text-ink-muted">ObraControl Pro</p>

          <div className="mt-4 text-center">
            <span className="font-mono text-5xl font-semibold text-ink">R$ 19,90</span>
            <span className="text-lg text-ink-muted">/mês</span>
          </div>
          <p className="mt-1 text-center text-sm text-accent-text">após 30 dias grátis</p>

          <ul className="mt-6 space-y-3">
            {ITENS.map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-ink-muted">
                <CheckCircle size={16} className="shrink-0 text-success" />
                {item}
              </li>
            ))}
          </ul>

          <Button asChild className="mt-8 w-full">
            <Link href="/register">Começar 30 dias grátis</Link>
          </Button>
          <p className="mt-2 text-center text-xs text-ink-faint">
            Sem cartão de crédito necessário
          </p>
        </div>

        <p className="mx-auto mt-4 max-w-sm text-center text-xs text-ink-faint">
          Cobrado mensalmente. Cancela a qualquer momento. Seus dados permanecem acessíveis por 30
          dias após o cancelamento.
        </p>
      </ScrollReveal>
    </section>
  );
}
