"use client";

import * as React from "react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  /** Omitido quando o diálogo é controlado por fora (ex.: item de menu). */
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  /** Nome explícito do item afetado — o usuário precisa ler o que vai perder. */
  itemName: string;
  description?: string;
  /** Completa a frase "<itemName> ..." — ajuste para ações que não são exclusão. */
  consequence?: string;
  confirmLabel?: string;
  onConfirm: () => void | Promise<void>;
}

export function ConfirmDialog({
  trigger,
  open,
  onOpenChange,
  title,
  itemName,
  description,
  consequence = "será removido permanentemente.",
  confirmLabel = "Excluir",
  onConfirm,
}: ConfirmDialogProps) {
  const [openInterno, setOpenInterno] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const aberto = open ?? openInterno;
  const setAberto = onOpenChange ?? setOpenInterno;

  async function handleConfirm() {
    setLoading(true);
    try {
      await onConfirm();
      setAberto(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AlertDialog open={aberto} onOpenChange={(next) => (loading ? null : setAberto(next))}>
      {trigger ? <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger> : null}
      <AlertDialogContent>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>
          {description ?? "Esta ação não pode ser desfeita."}{" "}
          <span className="font-medium text-ink">{itemName}</span> {consequence}
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="ghost" type="button" disabled={loading}>
              Cancelar
            </Button>
          </AlertDialogCancel>
          <Button
            variant="danger"
            type="button"
            loading={loading}
            loadingLabel="Excluindo"
            onClick={handleConfirm}
          >
            {confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
