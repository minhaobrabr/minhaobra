import type { Recurso } from "@/types";

/**
 * Dados de exemplo usados só na ilustração da seção "Como funciona" da landing —
 * o app propriamente dito busca tudo do Supabase via `ObraProvider`.
 */
export const recursosMock: Recurso[] = [
  {
    id: "rec-001",
    nome: "Recursos Próprios",
    tipo: "PROPRIO",
    descricao: "Reserva pessoal destinada à obra.",
    aportes: [
      { id: "ap-001", data: "2025-02-01", valor: 20_000, observacao: "Aporte inicial" },
      { id: "ap-002", data: "2025-06-10", valor: 15_000 },
      { id: "ap-003", data: "2025-11-05", valor: 15_000, observacao: "13º salário" },
    ],
  },
  {
    id: "rec-002",
    nome: "Financiamento CEF",
    tipo: "FINANCIAMENTO",
    descricao: "Construcard — liberação por medição, 5 parcelas.",
    aportes: [
      { id: "ap-004", data: "2025-03-20", valor: 30_000, observacao: "1ª medição" },
      { id: "ap-005", data: "2025-07-18", valor: 30_000, observacao: "2ª medição" },
      { id: "ap-006", data: "2025-12-12", valor: 30_000, observacao: "3ª medição" },
      { id: "ap-007", data: "2026-04-15", valor: 30_000, observacao: "4ª medição" },
    ],
  },
];
