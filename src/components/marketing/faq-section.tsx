import * as React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";

const PERGUNTAS = [
  {
    pergunta: "Preciso de cartão de crédito para começar?",
    resposta:
      "Não. Os 30 dias grátis começam só com seu e-mail. O cartão é pedido apenas se decidir continuar.",
  },
  {
    pergunta: "O que acontece depois dos 30 dias?",
    resposta:
      "Você escolhe assinar por R$ 19,90/mês ou encerrar. Se encerrar, seus dados ficam disponíveis para exportação por mais 30 dias.",
  },
  {
    pergunta: "Posso gerenciar mais de uma obra?",
    resposta: "O plano atual inclui 1 obra ativa por vez. Se precisar de mais, fale com a gente.",
  },
  {
    pergunta: "Meus dados ficam seguros?",
    resposta: "Sim. Todos os dados são armazenados com criptografia. Nunca compartilhamos suas informações.",
  },
  {
    pergunta: "Funciona no celular?",
    resposta: "Sim. O ObraControl é totalmente responsivo e funciona em qualquer dispositivo com navegador.",
  },
  {
    pergunta: "Consigo exportar o histórico da minha obra?",
    resposta: "Sim. A qualquer momento você pode exportar um relatório completo da obra em PDF.",
  },
];

export function FaqSection() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-28">
      <ScrollReveal>
        <h2 className="text-2xl font-semibold text-ink">Dúvidas frequentes</h2>
      </ScrollReveal>

      <ScrollReveal delay={0.06} className="mt-8">
        <Accordion type="single" collapsible className="rounded-2xl border border-line bg-surface-1 px-6">
          {PERGUNTAS.map((item) => (
            <AccordionItem key={item.pergunta} value={item.pergunta}>
              <AccordionTrigger>{item.pergunta}</AccordionTrigger>
              <AccordionContent>{item.resposta}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollReveal>
    </section>
  );
}
