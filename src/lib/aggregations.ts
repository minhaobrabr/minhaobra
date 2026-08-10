import { formatMonthShort, parseISODate, safePercent } from "@/lib/formatters";
import type {
  CategoriaDespesa,
  Despesa,
  Movimento,
  Prestador,
  Recurso,
} from "@/types";

export function totalAportado(recurso: Recurso): number {
  return recurso.aportes.reduce((soma, aporte) => soma + aporte.valor, 0);
}

export function totalAportadoGeral(recursos: Recurso[]): number {
  return recursos.reduce((soma, recurso) => soma + totalAportado(recurso), 0);
}

export function totalDespesas(despesas: Despesa[]): number {
  return despesas.reduce((soma, despesa) => soma + despesa.valor, 0);
}

export interface ResumoObra {
  /** Orçamento total planejado para a obra (definido no onboarding, editável depois). */
  planejado: number;
  /** Dinheiro que efetivamente entrou na obra. */
  aportado: number;
  /** Soma de todos os lançamentos de despesa. */
  gasto: number;
  /** Aportado − gasto: o que ainda está em caixa. */
  saldo: number;
  /** Quanto do orçamento planejado já foi comprometido, em %. */
  comprometidoPct: number;
  /** Diferença entre o orçamento planejado e o que já foi aportado. */
  aAportar: number;
}

export function resumoObra(
  orcamentoPlanejado: number,
  recursos: Recurso[],
  despesas: Despesa[],
): ResumoObra {
  const planejado = orcamentoPlanejado;
  const aportado = totalAportadoGeral(recursos);
  const gasto = totalDespesas(despesas);

  return {
    planejado,
    aportado,
    gasto,
    saldo: aportado - gasto,
    comprometidoPct: safePercent(gasto, planejado),
    // Sem orçamento definido não há "falta aportar" — evita mostrar negativo sem sentido.
    aAportar: planejado > 0 ? planejado - aportado : 0,
  };
}

export interface CategoriaResumo {
  categoria: CategoriaDespesa;
  total: number;
  quantidade: number;
  percentual: number;
}

export function despesasPorCategoria(despesas: Despesa[]): CategoriaResumo[] {
  const total = totalDespesas(despesas);
  const mapa = new Map<CategoriaDespesa, { total: number; quantidade: number }>();

  for (const despesa of despesas) {
    const atual = mapa.get(despesa.categoria) ?? { total: 0, quantidade: 0 };
    mapa.set(despesa.categoria, {
      total: atual.total + despesa.valor,
      quantidade: atual.quantidade + 1,
    });
  }

  return Array.from(mapa.entries())
    .map(([categoria, valores]) => ({
      categoria,
      total: valores.total,
      quantidade: valores.quantidade,
      percentual: safePercent(valores.total, total),
    }))
    .sort((a, b) => b.total - a.total);
}

export interface PontoEvolucao {
  mes: string; // YYYY-MM
  label: string; // "jul/26"
  recursos: number; // acumulado de aportes
  despesas: number; // acumulado de gastos
}

function chaveMes(iso: string): string {
  return iso.slice(0, 7);
}

export function serieEvolucao(recursos: Recurso[], despesas: Despesa[]): PontoEvolucao[] {
  const entradas = new Map<string, number>();
  const saidas = new Map<string, number>();

  for (const recurso of recursos) {
    for (const aporte of recurso.aportes) {
      const chave = chaveMes(aporte.data);
      entradas.set(chave, (entradas.get(chave) ?? 0) + aporte.valor);
    }
  }

  for (const despesa of despesas) {
    const chave = chaveMes(despesa.data);
    saidas.set(chave, (saidas.get(chave) ?? 0) + despesa.valor);
  }

  const meses = Array.from(new Set([...entradas.keys(), ...saidas.keys()])).sort();
  if (meses.length === 0) return [];

  // Preenche os meses sem movimento para a linha não "pular" no gráfico.
  const primeiro = parseISODate(`${meses[0]}-01`);
  const ultimo = parseISODate(`${meses[meses.length - 1]}-01`);
  const sequencia: string[] = [];
  const cursor = new Date(primeiro);

  while (cursor <= ultimo) {
    sequencia.push(`${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`);
    cursor.setMonth(cursor.getMonth() + 1);
  }

  let acumuladoRecursos = 0;
  let acumuladoDespesas = 0;

  return sequencia.map((mes) => {
    acumuladoRecursos += entradas.get(mes) ?? 0;
    acumuladoDespesas += saidas.get(mes) ?? 0;
    return {
      mes,
      label: formatMonthShort(`${mes}-01`),
      recursos: acumuladoRecursos,
      despesas: acumuladoDespesas,
    };
  });
}

export function movimentosRecentes(
  recursos: Recurso[],
  despesas: Despesa[],
  limite = 8,
): Movimento[] {
  const entradas: Movimento[] = recursos.flatMap((recurso) =>
    recurso.aportes.map((aporte) => ({
      id: aporte.id,
      tipo: "ENTRADA" as const,
      descricao: `Aporte — ${recurso.nome}`,
      data: aporte.data,
      valor: aporte.valor,
      recursoTipo: recurso.tipo,
    })),
  );

  const saidas: Movimento[] = despesas.map((despesa) => ({
    id: despesa.id,
    tipo: "SAIDA" as const,
    descricao: despesa.descricao,
    data: despesa.data,
    valor: despesa.valor,
    categoria: despesa.categoria,
  }));

  return [...entradas, ...saidas]
    .sort((a, b) => b.data.localeCompare(a.data))
    .slice(0, limite);
}

export function agruparDespesasPorMes(despesas: Despesa[]): Array<{
  mes: string;
  itens: Despesa[];
  total: number;
}> {
  const mapa = new Map<string, Despesa[]>();

  for (const despesa of [...despesas].sort((a, b) => a.data.localeCompare(b.data))) {
    const chave = chaveMes(despesa.data);
    mapa.set(chave, [...(mapa.get(chave) ?? []), despesa]);
  }

  return Array.from(mapa.entries()).map(([mes, itens]) => ({
    mes,
    itens,
    total: totalDespesas(itens),
  }));
}

/** Período coberto pelos lançamentos — usado no cabeçalho do relatório. */
export function periodoObra(recursos: Recurso[], despesas: Despesa[]): { inicio?: string; fim?: string } {
  const datas = [
    ...recursos.flatMap((recurso) => recurso.aportes.map((aporte) => aporte.data)),
    ...despesas.map((despesa) => despesa.data),
  ].sort();

  return { inicio: datas[0], fim: datas[datas.length - 1] };
}

/** Pagamentos (despesas vinculadas) de um prestador, do mais recente ao mais antigo. */
export function pagamentosDoPrestador(prestadorId: string, despesas: Despesa[]): Despesa[] {
  return despesas
    .filter((despesa) => despesa.prestadorId === prestadorId)
    .sort((a, b) => b.data.localeCompare(a.data));
}

export function totalPagoPrestador(prestadorId: string, despesas: Despesa[]): number {
  return totalDespesas(pagamentosDoPrestador(prestadorId, despesas));
}

export interface SaldoPrestador {
  pago: number;
  /** Presente apenas quando o prestador tem valor contratado — sem isso não há "falta pagar". */
  saldo?: number;
  percentualPago?: number;
}

export function saldoPrestador(prestador: Prestador, despesas: Despesa[]): SaldoPrestador {
  const pago = totalPagoPrestador(prestador.id, despesas);
  if (!prestador.valorContratado) return { pago };

  return {
    pago,
    saldo: prestador.valorContratado - pago,
    percentualPago: safePercent(pago, prestador.valorContratado),
  };
}
