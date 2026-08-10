const BRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const BRL_COMPACT = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const PERCENT = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const RELATIVE = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });

const DATE_PARTS = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const MONTH_YEAR = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
  year: "numeric",
});

/**
 * Converte "2026-08-09" em Date no fuso local.
 * `new Date("2026-08-09")` seria meia-noite UTC e voltaria um dia no Brasil.
 */
export function parseISODate(value: string): Date {
  const [datePart] = value.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  if (!year || !month || !day) return new Date(value);
  return new Date(year, month - 1, day);
}

export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** 1250 → "R$ 1.250,00" */
export function formatBRL(value: number): string {
  return BRL.format(Number.isFinite(value) ? value : 0);
}

/** 85000 → "R$ 85.000" — para eixos de gráfico e espaços apertados. */
export function formatBRLCompact(value: number): string {
  return BRL_COMPACT.format(Number.isFinite(value) ? value : 0);
}

const COMPACT = new Intl.NumberFormat("pt-BR", {
  notation: "compact",
  maximumFractionDigits: 0,
});

/** 207740 → "R$ 208 mil" — rótulo compacto para eixo de gráfico. */
export function formatBRLAxis(valor: number): string {
  if (!valor) return `R$ 0`;
  return `R$ ${COMPACT.format(valor)}`;
}

/** "2026-01-15" → "15 jan. 2026" */
export function formatDate(date: string | Date): string {
  const parsed = typeof date === "string" ? parseISODate(date) : date;
  return DATE_PARTS.formatToParts(parsed)
    .filter((part) => part.type !== "literal")
    .map((part) => part.value)
    .join(" ");
}

/** "2026-08-09" → "09/08/2026" */
export function formatDateNumeric(date: string | Date): string {
  const parsed = typeof date === "string" ? parseISODate(date) : date;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsed);
}

/** "2026-07-15" → "Julho 2026" */
export function formatMonthYear(date: string | Date): string {
  const parsed = typeof date === "string" ? parseISODate(date) : date;
  const label = MONTH_YEAR.format(parsed).replace(" de ", " ");
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/** "2026-07-15" → "jul/26" — rótulo curto de eixo. */
export function formatMonthShort(date: string | Date): string {
  const parsed = typeof date === "string" ? parseISODate(date) : date;
  const month = new Intl.DateTimeFormat("pt-BR", { month: "short" })
    .format(parsed)
    .replace(".", "");
  return `${month}/${String(parsed.getFullYear()).slice(2)}`;
}

/** 67.4 → "67,4%" */
export function formatPercent(value: number): string {
  const safe = Number.isFinite(value) ? value : 0;
  return `${PERCENT.format(safe)}%`;
}

/** 67.4 → "67%" — para leitura rápida em cards. */
export function formatPercentWhole(value: number): string {
  const safe = Number.isFinite(value) ? value : 0;
  return `${Math.round(safe)}%`;
}

/** "2026-08-06" → "há 3 dias" */
export function formatRelativeDate(date: string | Date, from: Date = new Date()): string {
  const parsed = typeof date === "string" ? parseISODate(date) : date;
  const reference = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const target = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
  const days = Math.round((target.getTime() - reference.getTime()) / 86_400_000);

  if (Math.abs(days) < 7) return RELATIVE.format(days, "day");
  if (Math.abs(days) < 30) return RELATIVE.format(Math.trunc(days / 7), "week");
  if (Math.abs(days) < 365) return RELATIVE.format(Math.trunc(days / 30), "month");
  return RELATIVE.format(Math.trunc(days / 365), "year");
}

/** Percentual seguro — evita divisão por zero em orçamentos ainda vazios. */
export function safePercent(part: number, total: number): number {
  if (!total) return 0;
  return (part / total) * 100;
}
