"use client";

import * as React from "react";

import { Field } from "@/components/shared/field";
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

interface DeleteAccountDialogProps {
  trigger: React.ReactNode;
  email: string;
  onConfirm: () => void | Promise<void>;
}

export function DeleteAccountDialog({ trigger, email, onConfirm }: DeleteAccountDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [digitado, setDigitado] = React.useState("");
  const [excluindo, setExcluindo] = React.useState(false);

  React.useEffect(() => {
    if (!open) setDigitado("");
  }, [open]);

  const confirmado = digitado.trim().toLowerCase() === email.toLowerCase();

  async function handleConfirm() {
    setExcluindo(true);
    try {
      await onConfirm();
      setOpen(false);
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => (excluindo ? null : setOpen(next))}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir minha conta</DialogTitle>
          <DialogDescription>
            A exclusão definitiva dos seus dados ainda depende de uma etapa de backend que falta
            configurar. Por enquanto, confirmar aqui encerra sua sessão nesta conta. Digite seu
            e-mail para confirmar.
          </DialogDescription>
        </DialogHeader>

        <Field id="confirmar-email" label={email}>
          <Input
            id="confirmar-email"
            value={digitado}
            onChange={(event) => setDigitado(event.target.value)}
            autoComplete="off"
            autoFocus
          />
        </Field>

        <DialogFooter>
          <Button type="button" variant="ghost" disabled={excluindo} onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            type="button"
            variant="danger"
            disabled={!confirmado}
            loading={excluindo}
            loadingLabel="Encerrando"
            onClick={handleConfirm}
          >
            Encerrar sessão
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
