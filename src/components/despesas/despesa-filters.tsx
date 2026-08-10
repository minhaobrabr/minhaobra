"use client";

import * as React from "react";
import { CaretDown, MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";

import { CategoryBadge } from "@/components/despesas/category-badge";
import { Field } from "@/components/shared/field";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIAS, CATEGORIA_META } from "@/lib/domain";
import type { CategoriaDespesa } from "@/types";

export type PeriodoFiltro = "TODOS" | "MES" | "TRIMESTRE" | "ANO" | "PERSONALIZADO";

export interface FiltrosDespesa {
  categorias: CategoriaDespesa[];
  periodo: PeriodoFiltro;
  de: string;
  ate: string;
  busca: string;
}

export const FILTROS_INICIAIS: FiltrosDespesa = {
  categorias: [],
  periodo: "TODOS",
  de: "",
  ate: "",
  busca: "",
};

const PERIODO_LABEL: Record<PeriodoFiltro, string> = {
  TODOS: "Todo o período",
  MES: "Este mês",
  TRIMESTRE: "Últimos 3 meses",
  ANO: "Este ano",
  PERSONALIZADO: "Personalizado",
};

export function filtrosAtivos(filtros: FiltrosDespesa): boolean {
  return (
    filtros.categorias.length > 0 ||
    filtros.periodo !== "TODOS" ||
    filtros.busca.trim().length > 0
  );
}

interface DespesaFiltersProps {
  filtros: FiltrosDespesa;
  onChange: (filtros: FiltrosDespesa) => void;
}

export function DespesaFilters({ filtros, onChange }: DespesaFiltersProps) {
  function alternarCategoria(categoria: CategoriaDespesa, marcado: boolean) {
    onChange({
      ...filtros,
      categorias: marcado
        ? [...filtros.categorias, categoria]
        : filtros.categorias.filter((item) => item !== categoria),
    });
  }

  const rotuloCategorias =
    filtros.categorias.length === 0
      ? "Todas as categorias"
      : filtros.categorias.length === 1
        ? CATEGORIA_META[filtros.categorias[0]].label
        : `${filtros.categorias.length} categorias`;

  return (
    <div className="mb-4 rounded-2xl border border-line bg-surface-1 p-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex h-10 items-center justify-between gap-2 rounded-xl border border-line bg-surface-2 px-3 text-sm text-ink transition-colors hover:border-line-strong lg:w-56"
            >
              <span className="truncate">{rotuloCategorias}</span>
              <CaretDown size={14} className="shrink-0 text-ink-muted" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Categorias</DropdownMenuLabel>
            {CATEGORIAS.map((categoria) => (
              <DropdownMenuCheckboxItem
                key={categoria}
                checked={filtros.categorias.includes(categoria)}
                onCheckedChange={(marcado) => alternarCategoria(categoria, Boolean(marcado))}
                onSelect={(event) => event.preventDefault()}
              >
                <CategoryBadge category={categoria} />
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Select
          value={filtros.periodo}
          onValueChange={(valor) => onChange({ ...filtros, periodo: valor as PeriodoFiltro })}
        >
          <SelectTrigger className="lg:w-48" aria-label="Período">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(PERIODO_LABEL) as PeriodoFiltro[]).map((periodo) => (
              <SelectItem key={periodo} value={periodo}>
                {PERIODO_LABEL[periodo]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative flex-1">
          <MagnifyingGlass
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint"
          />
          <Input
            type="search"
            aria-label="Buscar despesa"
            placeholder="Buscar por descrição ou fornecedor"
            value={filtros.busca}
            onChange={(event) => onChange({ ...filtros, busca: event.target.value })}
            className="pl-9"
          />
        </div>

        {filtrosAtivos(filtros) ? (
          <button
            type="button"
            onClick={() => onChange(FILTROS_INICIAIS)}
            className="shrink-0 text-xs font-medium text-accent-text transition-colors hover:text-accent"
          >
            Limpar filtros
          </button>
        ) : null}
      </div>

      {filtros.periodo === "PERSONALIZADO" ? (
        <div className="mt-3 grid grid-cols-1 gap-3 border-t border-line pt-3 sm:grid-cols-2 lg:max-w-md">
          <Field id="filtro-de" label="De">
            <Input
              id="filtro-de"
              type="date"
              value={filtros.de}
              onChange={(event) => onChange({ ...filtros, de: event.target.value })}
              className="font-mono"
            />
          </Field>
          <Field id="filtro-ate" label="Até">
            <Input
              id="filtro-ate"
              type="date"
              value={filtros.ate}
              onChange={(event) => onChange({ ...filtros, ate: event.target.value })}
              className="font-mono"
            />
          </Field>
        </div>
      ) : null}
    </div>
  );
}
