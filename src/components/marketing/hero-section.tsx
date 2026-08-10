"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle, Wallet } from "@phosphor-icons/react/dist/ssr";
import { motion, useReducedMotion } from "motion/react";

import { BudgetBar } from "@/components/dashboard/budget-bar";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { Button } from "@/components/ui/button";
import { formatBRL } from "@/lib/formatters";

const heroMockData = {
  obra: "Reforma Residencial - Lapa",
  totalRecursos: 127_500,
  totalDespesas: 84_320,
  saldo: 43_180,
  percentGasto: 66.1,
};

export function HeroSection() {
  const reduced = useReducedMotion();

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pb-24 sm:pt-20 lg:pb-28 lg:pt-24">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
        <motion.div
          className="lg:col-span-7"
          initial={reduced ? { opacity: 1 } : { opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-5xl font-semibold leading-[1.08] tracking-tight text-ink lg:text-6xl">
            Sua obra dentro do orçamento.
          </h1>
          <p className="mt-4 max-w-[42ch] text-lg text-ink-muted">
            Acompanhe cada real que entra e sai da sua reforma. Sem planilha, sem surpresa.
          </p>

          <div className="mt-8 flex flex-col items-start gap-3">
            <Button asChild size="lg" className="px-6 text-base">
              <Link href="/register">Começar 30 dias grátis</Link>
            </Button>
            <p className="text-xs text-ink-faint">Sem cartão de crédito. Cancela quando quiser.</p>
          </div>

          <div className="mt-8 flex items-center gap-2 text-sm text-ink-muted">
            <CheckCircle size={14} className="text-success" />
            Mais de 340 obras controladas
          </div>
        </motion.div>

        <motion.div
          className="lg:col-span-5"
          initial={reduced ? { opacity: 1 } : { opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="rotate-1 rounded-2xl border border-line bg-surface-1 p-4 shadow-2xl shadow-black/40">
            <p className="px-1 pb-3 text-xs text-ink-faint">{heroMockData.obra}</p>
            <SummaryCard
              label="Saldo disponível"
              value={formatBRL(heroMockData.saldo)}
              valueTone="success"
              icon={Wallet}
              delta={`${formatBRL(heroMockData.totalRecursos)} em recursos`}
            />
            <div className="mt-3">
              <BudgetBar gasto={heroMockData.totalDespesas} orcamento={heroMockData.totalRecursos} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
