"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Warning } from "@phosphor-icons/react/dist/ssr";

import { CategoryBadge } from "@/components/despesas/category-badge";
import { CategorySegmented } from "@/components/despesas/category-segmented";
import { PrestadorModal } from "@/components/despesas/prestador-modal";
import { PageHeader } from "@/components/layout/page-header";
import { useObra } from "@/components/providers/obra-store";
import { Field } from "@/components/shared/field";
import { MoneyInput } from "@/components/shared/money-input";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ehCategoriaPrestador, ETAPAS, ETAPA_LABEL } from "@/lib/domain";
import { formatBRL, formatDate, toISODate } from "@/lib/formatters";
import type { CategoriaDespesa, Despesa, EtapaObra } from "@/types";

const MAX_OBSERVACOES = 500;
const SEM_ETAPA = "SEM_ETAPA";
const FORNECEDOR_AVULSO = "FORNECEDOR_AVULSO";

interface FormState {
  descricao: string;
  categoria: CategoriaDespesa | null;
  valor: number;
  data: string;
  fornecedor: string;
  prestadorId: string | null;
  notaFiscal: string;
  etapa: EtapaObra | null;
  observacoes: string;
}

function estadoInicial(despesa?: Despesa): FormState {
  return {
    descricao: despesa?.descricao ?? "",
    categoria: despesa?.categoria ?? null,
    valor: despesa?.valor ?? 0,
    data: despesa?.data ?? toISODate(new Date()),
    fornecedor: despesa?.fornecedor ?? "",
    prestadorId: despesa?.prestadorId ?? null,
    notaFiscal: despesa?.notaFiscal ?? "",
    etapa: despesa?.etapa ?? null,
    observacoes: despesa?.observacoes ?? "",
  };
}

export function DespesaForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { despesas, prestadores, resumo, criarDespesa, atualizarDespesa, criarPrestador } =
    useObra();

  const id = searchParams.get("id");
  const despesaExistente = React.useMemo(
    () => despesas.find((item) => item.id === id),
    [despesas, id],
  );

  const [form, setForm] = React.useState<FormState>(() => estadoInicial(despesaExistente));
  const [tocados, setTocados] = React.useState<string[]>([]);
  const [salvando, setSalvando] = React.useState(false);
  const [erroEnvio, setErroEnvio] = React.useState<string | null>(null);

  React.useEffect(() => {
    setForm(estadoInicial(despesaExistente));
  }, [despesaExistente]);

  const erros = {
    descricao: form.descricao.trim() ? undefined : "Descreva o que foi pago.",
    categoria: form.categoria ? undefined : "Escolha uma categoria.",
    valor: form.valor > 0 ? undefined : "Informe um valor maior que zero.",
    data: form.data ? undefined : "Informe a data do lançamento.",
  };

  const valido = Object.values(erros).every((erro) => erro === undefined);

  // O erro só aparece depois que o usuário saiu do campo — nada de formulário vermelho de saída.
  function marcarTocado(campo: string) {
    setTocados((atual) => (atual.includes(campo) ? atual : [...atual, campo]));
  }

  function erroDe(campo: keyof typeof erros): string | undefined {
    return tocados.includes(campo) ? erros[campo] : undefined;
  }

  const categoriaAceitaPrestador = form.categoria ? ehCategoriaPrestador(form.categoria) : false;
  const prestadoresDaCategoria = categoriaAceitaPrestador
    ? prestadores.filter((prestador) => prestador.categoria === form.categoria)
    : [];
  const prestadorSelecionado = prestadores.find((item) => item.id === form.prestadorId);

  function handleCategoriaChange(categoria: CategoriaDespesa) {
    // Um prestador só faz sentido para a categoria em que foi cadastrado — trocar de
    // Mão de obra para Serviço (ou para Material), por exemplo, solta o vínculo.
    const mantemPrestador = prestadorSelecionado?.categoria === categoria;
    setForm({ ...form, categoria, prestadorId: mantemPrestador ? form.prestadorId : null });
  }

  // Ao editar, o valor antigo volta para o caixa antes de descontar o novo.
  const saldoBase = resumo.saldo + (despesaExistente?.valor ?? 0);
  const saldoDepois = saldoBase - form.valor;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!valido || !form.categoria) return;

    setErroEnvio(null);
    setSalvando(true);

    const dados = {
      descricao: form.descricao.trim(),
      categoria: form.categoria,
      valor: form.valor,
      data: form.data,
      fornecedor: prestadorSelecionado ? prestadorSelecionado.nome : form.fornecedor.trim() || undefined,
      prestadorId: prestadorSelecionado?.id,
      notaFiscal: form.notaFiscal.trim() || undefined,
      etapa: form.etapa ?? undefined,
      observacoes: form.observacoes.trim() || undefined,
    };

    try {
      if (despesaExistente) {
        await atualizarDespesa(despesaExistente.id, dados);
      } else {
        await criarDespesa(dados);
      }
      router.push("/despesas");
    } catch {
      setErroEnvio("Não foi possível salvar a despesa. Tente novamente.");
      setSalvando(false);
    }
  }

  return (
    <>
      <PageHeader
        title={despesaExistente ? "Editar despesa" : "Nova despesa"}
        description={
          despesaExistente
            ? "Ajuste os dados do lançamento e salve para atualizar o orçamento."
            : "Registre um gasto da obra. Os campos marcados são obrigatórios."
        }
        action={
          <Button variant="ghost" onClick={() => router.push("/despesas")}>
            <ArrowLeft size={16} />
            Voltar
          </Button>
        }
      />

      <form onSubmit={handleSubmit} noValidate className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Reveal className="lg:col-span-3">
          <div className="space-y-5 rounded-2xl border border-line bg-surface-1 p-5 sm:p-6">
            <Field
              id="despesa-descricao"
              label="Descrição"
              required
              error={erroDe("descricao")}
            >
              <Input
                id="despesa-descricao"
                value={form.descricao}
                onChange={(event) => setForm({ ...form, descricao: event.target.value })}
                onBlur={() => marcarTocado("descricao")}
                aria-invalid={Boolean(erroDe("descricao"))}
                autoFocus
              />
            </Field>

            <div className="space-y-1.5">
              <p className="text-xs font-medium tracking-wide text-ink-muted">
                Categoria<span className="ml-0.5 text-accent-text">*</span>
              </p>
              <CategorySegmented
                value={form.categoria}
                onChange={handleCategoriaChange}
                invalid={Boolean(erroDe("categoria"))}
              />
              {erroDe("categoria") ? (
                <p className="flex items-center gap-1.5 text-xs text-danger">
                  <Warning size={12} weight="fill" />
                  {erros.categoria}
                </p>
              ) : null}
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Field
                id="despesa-valor"
                label="Valor"
                required
                error={erroDe("valor")}
              >
                <MoneyInput
                  id="despesa-valor"
                  scale="lg"
                  value={form.valor}
                  onValueChange={(valor) => setForm({ ...form, valor })}
                  onBlur={() => marcarTocado("valor")}
                  invalid={Boolean(erroDe("valor"))}
                />
              </Field>

              <Field
                id="despesa-data"
                label="Data"
                required
                error={erroDe("data")}
              >
                <Input
                  id="despesa-data"
                  type="date"
                  value={form.data}
                  onChange={(event) => setForm({ ...form, data: event.target.value })}
                  onBlur={() => marcarTocado("data")}
                  className="h-14 font-mono text-base"
                  aria-invalid={Boolean(erroDe("data"))}
                />
              </Field>
            </div>

            {categoriaAceitaPrestador ? (
              <div className="space-y-1.5">
                <div className="flex items-baseline justify-between gap-3">
                  <Label htmlFor="despesa-prestador">
                    Prestador <span className="text-[11px] font-normal text-ink-faint">opcional</span>
                  </Label>
                  <PrestadorModal
                    onSubmit={(dados) => criarPrestador(dados)}
                    trigger={
                      <button
                        type="button"
                        className="text-[11px] font-medium text-accent-text transition-colors hover:text-accent"
                      >
                        + Novo prestador
                      </button>
                    }
                  />
                </div>
                <Select
                  value={form.prestadorId ?? FORNECEDOR_AVULSO}
                  onValueChange={(valor) =>
                    setForm({ ...form, prestadorId: valor === FORNECEDOR_AVULSO ? null : valor })
                  }
                >
                  <SelectTrigger id="despesa-prestador">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={FORNECEDOR_AVULSO}>Fornecedor avulso (sem cadastro)</SelectItem>
                    {prestadoresDaCategoria.map((prestador) => (
                      <SelectItem key={prestador.id} value={prestador.id}>
                        {prestador.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-[11px] text-ink-faint">
                  {prestadorSelecionado
                    ? "Este pagamento entra no histórico do prestador, com saldo devedor atualizado."
                    : "Vincule a um prestador cadastrado para acompanhar quanto já foi pago a ele."}
                </p>
              </div>
            ) : null}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {!prestadorSelecionado ? (
                <Field
                  id="despesa-fornecedor"
                  label="Fornecedor"
                  hint="opcional"
                >
                  <Input
                    id="despesa-fornecedor"
                    value={form.fornecedor}
                    onChange={(event) => setForm({ ...form, fornecedor: event.target.value })}
                  />
                </Field>
              ) : null}

              <Field id="despesa-nf" label="Nota fiscal / NF-e" hint="opcional">
                <Input
                  id="despesa-nf"
                  value={form.notaFiscal}
                  onChange={(event) => setForm({ ...form, notaFiscal: event.target.value })}
                  className="font-mono"
                />
              </Field>
            </div>

            <Field id="despesa-etapa" label="Etapa da obra" hint="opcional">
              <Select
                value={form.etapa ?? SEM_ETAPA}
                onValueChange={(valor) =>
                  setForm({ ...form, etapa: valor === SEM_ETAPA ? null : (valor as EtapaObra) })
                }
              >
                <SelectTrigger id="despesa-etapa">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SEM_ETAPA}>Não informar</SelectItem>
                  {ETAPAS.map((etapa) => (
                    <SelectItem key={etapa} value={etapa}>
                      {ETAPA_LABEL[etapa]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field
              id="despesa-observacoes"
              label="Observações"
              hint={`${form.observacoes.length}/${MAX_OBSERVACOES}`}
            >
              <Textarea
                id="despesa-observacoes"
                rows={4}
                maxLength={MAX_OBSERVACOES}
                value={form.observacoes}
                onChange={(event) => setForm({ ...form, observacoes: event.target.value })}
              />
            </Field>
          </div>
        </Reveal>

        <Reveal delay={0.06} className="lg:col-span-2">
          <div className="rounded-2xl border border-line bg-surface-1 p-5 lg:sticky lg:top-20">
            <h3 className="text-sm font-semibold text-ink">Resumo do lançamento</h3>

            <div className="mt-4 space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-ink-muted">Categoria</p>
                <div className="mt-1.5">
                  {form.categoria ? (
                    <CategoryBadge category={form.categoria} size="md" />
                  ) : (
                    <span className="text-sm text-ink-faint">Nenhuma selecionada</span>
                  )}
                </div>
              </div>

              {prestadorSelecionado ? (
                <div>
                  <p className="text-xs uppercase tracking-wide text-ink-muted">Prestador</p>
                  <p className="mt-1 text-sm text-ink">{prestadorSelecionado.nome}</p>
                </div>
              ) : null}

              <div>
                <p className="text-xs uppercase tracking-wide text-ink-muted">Valor</p>
                <p className="mt-1 font-mono text-3xl font-semibold tabular-nums tracking-tight text-ink sm:text-4xl">
                  {formatBRL(form.valor)}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-ink-muted">Data</p>
                <p className="mt-1 font-mono text-sm tabular-nums text-ink">
                  {form.data ? formatDate(form.data) : "—"}
                </p>
              </div>

              <div className="border-t border-line pt-4">
                <p className="text-xs uppercase tracking-wide text-ink-muted">
                  Saldo após este lançamento
                </p>
                <p
                  className={`mt-1 font-mono text-lg font-semibold tabular-nums ${
                    saldoDepois >= 0 ? "text-success" : "text-danger"
                  }`}
                >
                  {formatBRL(saldoDepois)}
                </p>
                {saldoDepois < 0 ? (
                  <p className="mt-2 flex items-start gap-1.5 text-xs text-danger">
                    <Warning size={12} weight="fill" className="mt-0.5 shrink-0" />
                    Este lançamento ultrapassa o valor já aportado na obra.
                  </p>
                ) : null}
              </div>
            </div>

            <div className="mt-6 space-y-2">
              {erroEnvio ? (
                <p className="flex items-center gap-1.5 text-xs text-danger">
                  <Warning size={12} weight="fill" />
                  {erroEnvio}
                </p>
              ) : null}
              <Button
                type="submit"
                className="w-full"
                disabled={!valido}
                loading={salvando}
                loadingLabel="Salvando"
              >
                {despesaExistente ? "Salvar alterações" : "Salvar despesa"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => router.push("/despesas")}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </Reveal>
      </form>
    </>
  );
}
