"use client";

import * as React from "react";

import { Field } from "@/components/shared/field";
import { MoneyInput } from "@/components/shared/money-input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIAS_PRESTADOR, CATEGORIA_META } from "@/lib/domain";
import type { CategoriaPrestador, Prestador } from "@/types";

type DadosPrestador = Omit<Prestador, "id">;

interface PrestadorModalProps {
  /** Omitido quando o modal é controlado por fora (ex.: item de menu). */
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Preenchido quando o modal está editando um prestador existente. */
  prestador?: Prestador;
  onSubmit: (dados: DadosPrestador) => void | Promise<void>;
}

const VAZIO: DadosPrestador = { nome: "", categoria: "MAO_DE_OBRA" };

export function PrestadorModal({
  trigger,
  open,
  onOpenChange,
  prestador,
  onSubmit,
}: PrestadorModalProps) {
  const [openInterno, setOpenInterno] = React.useState(false);
  const [nome, setNome] = React.useState("");
  const [categoria, setCategoria] = React.useState<CategoriaPrestador>("MAO_DE_OBRA");
  const [valorContratado, setValorContratado] = React.useState(0);
  const [observacoes, setObservacoes] = React.useState("");
  const [erro, setErro] = React.useState<string | undefined>();
  const [salvando, setSalvando] = React.useState(false);

  const aberto = open ?? openInterno;
  const setAberto = onOpenChange ?? setOpenInterno;

  React.useEffect(() => {
    if (!aberto) return;
    const dados = prestador ?? VAZIO;
    setNome(dados.nome);
    setCategoria(dados.categoria);
    setValorContratado(dados.valorContratado ?? 0);
    setObservacoes(prestador?.observacoes ?? "");
    setErro(undefined);
  }, [aberto, prestador]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!nome.trim()) {
      setErro("Informe o nome do prestador.");
      return;
    }

    setSalvando(true);
    try {
      await onSubmit({
        nome: nome.trim(),
        categoria,
        valorContratado: valorContratado > 0 ? valorContratado : undefined,
        observacoes: observacoes.trim() || undefined,
      });
      setAberto(false);
    } catch {
      setErro("Não foi possível salvar. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Dialog open={aberto} onOpenChange={setAberto}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{prestador ? "Editar prestador" : "Adicionar prestador"}</DialogTitle>
          <DialogDescription>
            Cadastre quem presta o serviço para acompanhar quanto já foi pago e quanto falta.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Field id="prestador-nome" label="Nome" required error={erro}>
            <Input
              id="prestador-nome"
              value={nome}
              onChange={(event) => setNome(event.target.value)}
              aria-invalid={Boolean(erro)}
              autoFocus
            />
          </Field>

          <div className="space-y-1.5">
            <p className="text-xs font-medium tracking-wide text-ink-muted">
              Categoria<span className="ml-0.5 text-accent-text">*</span>
            </p>
            <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Categoria do prestador">
              {CATEGORIAS_PRESTADOR.map((opcao) => {
                const meta = CATEGORIA_META[opcao];
                const ativo = categoria === opcao;
                return (
                  <button
                    key={opcao}
                    type="button"
                    role="radio"
                    aria-checked={ativo}
                    onClick={() => setCategoria(opcao)}
                    className={
                      ativo
                        ? "flex items-center gap-2.5 rounded-xl border border-accent bg-surface-2 px-3.5 py-3 text-left text-ink ring-1 ring-accent transition-colors duration-150"
                        : "flex items-center gap-2.5 rounded-xl border border-line bg-surface-1 px-3.5 py-3 text-left text-ink-muted transition-colors duration-150 hover:border-line-strong hover:text-ink"
                    }
                  >
                    <meta.icon
                      size={20}
                      style={ativo ? { color: meta.color } : undefined}
                      className={ativo ? undefined : "text-ink-faint"}
                    />
                    <span className="text-xs font-medium">{meta.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <Field
            id="prestador-valor"
            label="Valor combinado"
            hint="opcional — deixe em branco se não houver valor fechado"
          >
            <MoneyInput
              id="prestador-valor"
              value={valorContratado}
              onValueChange={setValorContratado}
            />
          </Field>

          <Field id="prestador-observacoes" label="Observação" hint="opcional">
            <Textarea
              id="prestador-observacoes"
              value={observacoes}
              onChange={(event) => setObservacoes(event.target.value)}
              maxLength={280}
            />
          </Field>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setAberto(false)}>
              Cancelar
            </Button>
            <Button type="submit" loading={salvando} loadingLabel="Salvando">
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
