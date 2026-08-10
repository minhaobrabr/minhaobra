import {
  Bank,
  Buildings,
  Certificate,
  HardHat,
  House,
  PiggyBank,
  Question,
  Storefront,
  Tag,
  Users,
  Wall,
  Wrench,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";

import type {
  CategoriaDespesa,
  CategoriaPrestador,
  EtapaObra,
  RecursoTipo,
  TipoObra,
} from "@/types";

interface CategoriaMeta {
  label: string;
  short: string;
  icon: Icon;
  /** Referência ao token do design system — nunca hex solto no markup. */
  color: string;
  chip: string;
}

export const CATEGORIA_META: Record<CategoriaDespesa, CategoriaMeta> = {
  MATERIAL: {
    label: "Materiais",
    short: "Material",
    icon: Wall,
    color: "var(--color-cat-material)",
    chip: "bg-cat-material/12 text-cat-material",
  },
  MAO_DE_OBRA: {
    label: "Mão de obra",
    short: "Mão de obra",
    icon: HardHat,
    color: "var(--color-cat-mao)",
    chip: "bg-cat-mao/12 text-cat-mao",
  },
  SERVICO: {
    label: "Serviços terceiros",
    short: "Serviço",
    icon: Wrench,
    color: "var(--color-cat-servico)",
    chip: "bg-cat-servico/12 text-cat-servico",
  },
  OUTRO: {
    label: "Outros",
    short: "Outro",
    icon: Tag,
    color: "var(--color-cat-outro)",
    chip: "bg-cat-outro/15 text-cat-outro",
  },
};

export const CATEGORIAS: CategoriaDespesa[] = ["MATERIAL", "MAO_DE_OBRA", "SERVICO", "OUTRO"];

/** Subconjunto de categorias que aceita vínculo com um prestador cadastrado. */
export const CATEGORIAS_PRESTADOR: CategoriaPrestador[] = ["MAO_DE_OBRA", "SERVICO"];

export function ehCategoriaPrestador(categoria: CategoriaDespesa): categoria is CategoriaPrestador {
  return categoria === "MAO_DE_OBRA" || categoria === "SERVICO";
}

interface RecursoTipoMeta {
  label: string;
  icon: Icon;
  chip: string;
  dot: string;
}

export const RECURSO_TIPO_META: Record<RecursoTipo, RecursoTipoMeta> = {
  PROPRIO: {
    label: "Recursos próprios",
    icon: PiggyBank,
    chip: "bg-surface-3 text-ink-muted",
    dot: "bg-ink-muted",
  },
  FINANCIAMENTO: {
    label: "Financiamento",
    icon: Bank,
    chip: "bg-cat-mao/12 text-cat-mao",
    dot: "bg-cat-mao",
  },
  FGTS: {
    label: "FGTS",
    icon: Certificate,
    chip: "bg-cat-servico/12 text-cat-servico",
    dot: "bg-cat-servico",
  },
  SOCIO: {
    label: "Aporte de sócio",
    icon: Users,
    chip: "bg-success/12 text-success",
    dot: "bg-success",
  },
  OUTRO: {
    label: "Outro",
    icon: Question,
    chip: "bg-surface-3 text-ink-muted",
    dot: "bg-ink-muted",
  },
};

export const RECURSO_TIPOS: RecursoTipo[] = [
  "PROPRIO",
  "FINANCIAMENTO",
  "FGTS",
  "SOCIO",
  "OUTRO",
];

export const ETAPA_LABEL: Record<EtapaObra, string> = {
  FUNDACAO: "Fundação",
  ESTRUTURA: "Estrutura",
  ALVENARIA: "Alvenaria",
  ACABAMENTO: "Acabamento",
  OUTROS: "Outros",
};

export const ETAPAS: EtapaObra[] = [
  "FUNDACAO",
  "ESTRUTURA",
  "ALVENARIA",
  "ACABAMENTO",
  "OUTROS",
];

interface TipoObraMeta {
  label: string;
  icon: Icon;
}

export const TIPO_OBRA_META: Record<TipoObra, TipoObraMeta> = {
  REFORMA_RESIDENCIAL: { label: "Reforma residencial", icon: House },
  CONSTRUCAO: { label: "Construção", icon: Buildings },
  REFORMA_COMERCIAL: { label: "Reforma comercial", icon: Storefront },
  OUTRO: { label: "Outro", icon: Question },
};

export const TIPOS_OBRA: TipoObra[] = [
  "REFORMA_RESIDENCIAL",
  "CONSTRUCAO",
  "REFORMA_COMERCIAL",
  "OUTRO",
];
