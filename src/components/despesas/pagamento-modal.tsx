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
import { toISODate } from "@/lib/formatters";
import type { Despesa, Prestador } from "@/types";

interface PagamentoModalProps {
  trigger: React.ReactNode;
  prestador: Prestador;
  onSubmit: (dados: Omit<Despesa, "id">) => void | Promise<void>;
}

export function PagamentoModal({ trigger, prestador, onSubmit }: PagamentoModalProps) {
  const [open, setOpen] = React.useState(false);
  const [descricao, setDescricao] = React.useState("");
  const [data, setData] = React.useState(() => toISODate(new Date()));
  const [valor, setValor] = React.useState(0);
  const [observacao, setObservacao] = React.useState("");
  const [erro, setErro] = React.useState<string | undefined>();
  const [salvando, setSalvando] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    setDescricao(`Pagamento — ${prestador.nome}`);
    setData(toISODate(new Date()));
    setValor(0);
    setObservacao("");
    setErro(undefined);
  }, [open, prestador]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (valor <= 0) {
      setErro("Informe o valor pago.");
      return;
    }

    setSalvando(true);
    try {
      await onSubmit({
        descricao: descricao.trim() || `Pagamento — ${prestador.nome}`,
        categoria: prestador.categoria,
        valor,
        data,
        fornecedor: prestador.nome,
        prestadorId: prestador.id,
        observacoes: observacao.trim() || undefined,
      });
      setOpen(false);
    } catch {
      setErro("Não foi possível registrar o pagamento. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Novo pagamento</DialogTitle>
          <DialogDescription>Registre um pagamento feito a {prestador.nome}.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Field id="pagamento-descricao" label="Descrição" required>
            <Input
              id="pagamento-descricao"
              value={descricao}
              onChange={(event) => setDescricao(event.target.value)}
              autoFocus
            />
          </Field>

          <Field id="pagamento-valor" label="Valor pago" required error={erro}>
            <MoneyInput
              id="pagamento-valor"
              value={valor}
              onValueChange={setValor}
              invalid={Boolean(erro)}
            />
          </Field>

          <Field id="pagamento-data" label="Data" required>
            <Input
              id="pagamento-data"
              type="date"
              value={data}
              onChange={(event) => setData(event.target.value)}
              className="font-mono"
            />
          </Field>

          <Field id="pagamento-obs" label="Observação" hint="opcional">
            <Textarea
              id="pagamento-obs"
              rows={2}
              value={observacao}
              onChange={(event) => setObservacao(event.target.value)}
              maxLength={200}
            />
          </Field>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" loading={salvando} loadingLabel="Registrando">
              Registrar pagamento
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
