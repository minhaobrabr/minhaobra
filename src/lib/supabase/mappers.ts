import type { Tables } from "@/lib/supabase/database.types";
import type {
  Aporte,
  BillingEntry,
  Despesa,
  Obra,
  Prestador,
  Recurso,
  Subscription,
  Usuario,
} from "@/types";

/**
 * Converte as linhas vindas do Postgres (snake_case, nulls) para os tipos de
 * domínio usados pelos componentes (camelCase, undefined em vez de null).
 * Escrita (insert/update) fica junto de cada ação no obra-store — não vale a
 * pena um mapeador reverso genérico para payloads tão pequenos e variados.
 */

export function toAporte(row: Tables<"aportes">): Aporte {
  return {
    id: row.id,
    data: row.data,
    valor: Number(row.valor),
    observacao: row.observacao ?? undefined,
  };
}

/** `aportes` já vem pronto de um select aninhado (`.select('*, aportes(*)')`). */
export function toRecurso(row: Tables<"recursos">, aportes: Tables<"aportes">[]): Recurso {
  return {
    id: row.id,
    nome: row.nome,
    tipo: row.tipo,
    descricao: row.descricao ?? undefined,
    aportes: aportes.map(toAporte),
  };
}

export function toPrestador(row: Tables<"prestadores">): Prestador {
  return {
    id: row.id,
    nome: row.nome,
    // A tabela aceita todas as categorias de despesa por reaproveitamento do enum,
    // mas um CHECK constraint no banco garante que só MAO_DE_OBRA/SERVICO chegam aqui.
    categoria: row.categoria as Prestador["categoria"],
    valorContratado: row.valor_contratado != null ? Number(row.valor_contratado) : undefined,
    observacoes: row.observacoes ?? undefined,
  };
}

export function toDespesa(row: Tables<"despesas">): Despesa {
  return {
    id: row.id,
    descricao: row.descricao,
    categoria: row.categoria,
    valor: Number(row.valor),
    data: row.data,
    fornecedor: row.fornecedor ?? undefined,
    prestadorId: row.prestador_id ?? undefined,
    notaFiscal: row.nota_fiscal ?? undefined,
    etapa: row.etapa ?? undefined,
    observacoes: row.observacoes ?? undefined,
  };
}

export function toObra(row: Tables<"obras">): Obra {
  return {
    id: row.id,
    nome: row.nome,
    endereco: row.endereco ?? undefined,
    inicio: row.inicio ?? undefined,
    previsaoTermino: row.previsao_termino ?? undefined,
    tipo: row.tipo ?? undefined,
    orcamentoPlanejado: row.orcamento_planejado != null ? Number(row.orcamento_planejado) : undefined,
  };
}

export function toUsuario(row: Tables<"profiles">): Usuario {
  return {
    nome: row.nome,
    email: row.email,
    cidade: row.cidade ?? undefined,
    avatarUrl: row.avatar_url ?? undefined,
    criadoEm: row.created_at,
  };
}

export function toSubscription(row: Tables<"subscriptions">): Subscription {
  return {
    status: row.status,
    trialStartedAt: row.trial_started_at,
    trialEndsAt: row.trial_ends_at,
    planName: row.plan_name,
    planPrice: Number(row.plan_price),
    nextBillingAt: row.next_billing_at,
    paymentMethod: row.payment_method,
  };
}

export function toBillingEntry(row: Tables<"billing_entries">): BillingEntry {
  return {
    id: row.id,
    data: row.data,
    descricao: row.descricao,
    valor: Number(row.valor),
    status: row.status,
  };
}
