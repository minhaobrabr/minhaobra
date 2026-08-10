export type RecursoTipo = "PROPRIO" | "FINANCIAMENTO" | "FGTS" | "SOCIO" | "OUTRO";

export interface Aporte {
  id: string;
  data: string; // ISO — YYYY-MM-DD
  valor: number;
  observacao?: string;
}

export interface Recurso {
  id: string;
  nome: string;
  tipo: RecursoTipo;
  descricao?: string;
  aportes: Aporte[];
}

export type CategoriaDespesa = "MATERIAL" | "MAO_DE_OBRA" | "SERVICO" | "OUTRO";

export type EtapaObra = "FUNDACAO" | "ESTRUTURA" | "ALVENARIA" | "ACABAMENTO" | "OUTROS";

export interface Despesa {
  id: string;
  descricao: string;
  categoria: CategoriaDespesa;
  valor: number;
  data: string; // ISO — YYYY-MM-DD
  fornecedor?: string;
  /** Presente quando a despesa é um pagamento a um prestador cadastrado. */
  prestadorId?: string;
  notaFiscal?: string;
  etapa?: EtapaObra;
  observacoes?: string;
}

/** Categorias de despesa que aceitam vínculo com um prestador — mão de obra e serviços são
 *  tipicamente pagos em parcelas a uma mesma pessoa/empresa; materiais e outros, não. */
export type CategoriaPrestador = "MAO_DE_OBRA" | "SERVICO";

/**
 * Pessoa ou empresa contratada por empreitada — ex.: o pedreiro cobrado por semana,
 * o vidraceiro que recebe um sinal e o restante conforme a entrega. Os pagamentos
 * feitos a um prestador são despesas com `prestadorId` apontando para ele.
 */
export interface Prestador {
  id: string;
  nome: string;
  categoria: CategoriaPrestador;
  /** Valor combinado pelo serviço/empreitada — opcional, quando não há valor fechado. */
  valorContratado?: number;
  observacoes?: string;
}

export type TipoObra = "REFORMA_RESIDENCIAL" | "CONSTRUCAO" | "REFORMA_COMERCIAL" | "OUTRO";

export interface Obra {
  id: string;
  nome: string;
  endereco?: string;
  inicio?: string;
  previsaoTermino?: string;
  tipo?: TipoObra;
  /** Orçamento planejado informado no onboarding — editável depois na obra. */
  orcamentoPlanejado?: number;
}

/** Dados vindos da conta Google no login — o único método de autenticação do app. */
export interface Usuario {
  nome: string;
  email: string;
  cidade?: string;
  /** URL da foto de perfil do Google — ausente, a UI cai para o avatar de iniciais. */
  avatarUrl?: string;
  criadoEm: string;
}

export type MovimentoTipo = "ENTRADA" | "SAIDA";

export interface Movimento {
  id: string;
  tipo: MovimentoTipo;
  descricao: string;
  data: string;
  valor: number;
  categoria?: CategoriaDespesa;
  recursoTipo?: RecursoTipo;
}

export type StatusTone = "success" | "warning" | "danger" | "neutral";

export type PlanStatus = "trial" | "active" | "expired" | "canceled";

export interface Subscription {
  status: PlanStatus;
  trialStartedAt: string;
  trialEndsAt: string;
  planName: string;
  planPrice: number;
  nextBillingAt: string | null;
  paymentMethod: string | null;
}

export type CobrancaStatus = "PAGO" | "FALHOU";

export interface BillingEntry {
  id: string;
  data: string;
  descricao: string;
  valor: number;
  status: CobrancaStatus;
}
