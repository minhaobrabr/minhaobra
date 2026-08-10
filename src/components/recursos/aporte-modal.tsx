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
import { formatBRL, toISODate } from "@/lib/formatters";
import type { Aporte, Recurso } from "@/types";

interface AporteModalProps {
  trigger: React.ReactNode;
  recurso: Recurso;
  onSubmit: (dados: Omit<Aporte, "id">) => void | Promise<void>;
}

export function AporteModal({ trigger, recurso, onSubmit }: AporteModalProps) {
  const [open, setOpen] = React.useState(false);
  const [data, setData] = React.useState(() => toISODate(new Date()));
  const [valor, setValor] = React.useState(0);
  const [observacao, setObservacao] = React.useState("");
  const [erro, setErro] = React.useState<string | undefined>();
  const [salvando, setSalvando] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    setData(toISODate(new Date()));
    setValor(0);
    setObservacao("");
    setErro(undefined);
  }, [open]);


  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (valor <= 0) {
      setErro("Informe o valor aportado.");
      return;
    }

    setSalvando(true);
    try {
      await onSubmit({ data, valor, observacao: observacao.trim() || undefined });
      setOpen(false);
    } catch {
      setErro("Não foi possível registrar o aporte. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Novo aporte</DialogTitle>
          <DialogDescription>
            Registre o aporte para {recurso.nome}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <Field id="aporte-data" label="Data do aporte" required>
            <Input
              id="aporte-data"
              type="date"
              value={data}
              onChange={(event) => setData(event.target.value)}
              className="font-mono"
            />
          </Field>

          <Field id="aporte-valor" label="Valor aportado" required error={erro}>
            <MoneyInput
              id="aporte-valor"
              value={valor}
              onValueChange={setValor}
              invalid={Boolean(erro)}
              autoFocus
            />
          </Field>

          <Field id="aporte-obs" label="Observação" hint="opcional">
            <Textarea
              id="aporte-obs"
              rows={2}
              value={observacao}
              onChange={(event) => setObservacao(event.target.value)}
              maxLength={160}
            />
          </Field>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" loading={salvando} loadingLabel="Registrando">
              Registrar aporte
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
