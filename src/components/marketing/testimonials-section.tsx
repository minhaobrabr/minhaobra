import * as React from "react";

import { ScrollReveal } from "@/components/marketing/scroll-reveal";

interface Depoimento {
  texto: string;
  nome: string;
  contexto: string;
}

const COLUNA_1: Depoimento[] = [
  {
    texto:
      "Gastei R$ 12 mil a menos do que nas reformas anteriores porque acompanhei cada saída.",
    nome: "Rodrigo Uchida",
    contexto: "reforma de apartamento, Moema - SP",
  },
  {
    texto:
      "O financiamento e o meu dinheiro ficavam misturados. Agora sei exatamente o que veio de cada fonte.",
    nome: "Priscila Damasceno",
    contexto: "construção de casa, Contagem - MG",
  },
];

const COLUNA_2: Depoimento[] = [
  {
    texto: "Fiz três pedidos de orçamento melhores depois que comecei a ter os números na mão.",
    nome: "Genildo Mota",
    contexto: "reforma comercial, Fortaleza - CE",
  },
];

function ListaDepoimentos({ itens }: { itens: Depoimento[] }) {
  return (
    <div className="divide-y divide-line">
      {itens.map((item) => (
        <blockquote key={item.nome} className="py-6 first:pt-0 last:pb-0">
          <p className="text-base leading-relaxed text-ink">&ldquo;{item.texto}&rdquo;</p>
          <footer className="mt-3 text-sm text-ink-muted">
            {item.nome}, {item.contexto}
          </footer>
        </blockquote>
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <ScrollReveal>
        <h2 className="text-3xl font-semibold tracking-tight text-ink">
          Obras controladas, donos tranquilos
        </h2>
      </ScrollReveal>

      <div className="mt-12 grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-2">
        <ScrollReveal>
          <ListaDepoimentos itens={COLUNA_1} />
        </ScrollReveal>
        <ScrollReveal delay={0.08}>
          <ListaDepoimentos itens={COLUNA_2} />
        </ScrollReveal>
      </div>
    </section>
  );
}
