"use client";

import * as React from "react";
import { ArrowRight, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { motion, useReducedMotion } from "motion/react";

import { PlanBadge } from "@/components/perfil/plan-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { toast } from "@/components/shared/toaster";
import { Button } from "@/components/ui/button";
import { formatBRL, formatDate, parseISODate } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { PlanStatus, Subscription } from "@/types";

const DURACAO_TRIAL_DIAS = 30;

function diasEntre(inicio: string, fim: string): number {
  const ms = parseISODate(fim).getTime() - parseISODate(inicio).getTime();
  return Math.round(ms / 86_400_000);
}

interface SubscriptionCardProps {
  subscription: Subscription;
}

export function SubscriptionCard({ subscription }: SubscriptionCardProps) {
  const reduced = useReducedMotion();
  // Override local só para a demonstração — cancelar/assinar aqui não persiste no backend,
  // mas deixa a tela reagir de verdade ao clique em vez de ficar estática.
  const [status, setStatus] = React.useState<PlanStatus>(subscription.status);
  const [cancelando, setCancelando] = React.useState(false);

  function handleAssinar() {
    setStatus("active");
    toast({ title: "Assinatura ativada. Bem-vindo ao ObraReal Pro." });
  }

  function handleAdicionarPagamento() {
    toast({ title: "Em breve: formulário de pagamento." });
  }

  async function handleCancelar() {
    setStatus("canceled");
    toast({ title: "Assinatura cancelada. Seus dados ficam acessíveis por 30 dias." });
  }

  if (status === "trial") {
    const hoje = new Date().toISOString().slice(0, 10);
    const diaAtual = Math.min(
      Math.max(diasEntre(subscription.trialStartedAt, hoje) + 1, 1),
      DURACAO_TRIAL_DIAS,
    );
    const diasRestantes = Math.max(DURACAO_TRIAL_DIAS - diaAtual, 0);
    const progresso = (diaAtual / DURACAO_TRIAL_DIAS) * 100;

    return (
      <div className="rounded-2xl border border-success/40 bg-surface-1 p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <PlanBadge status="trial" />
            <p className="mt-3 text-2xl font-semibold text-ink">30 dias grátis</p>
            <p className="mt-1 text-sm text-ink-muted">
              Seu período grátis termina em{" "}
              <span className="font-medium text-ink">{formatDate(subscription.trialEndsAt)}</span>
            </p>
          </div>
          <CheckCircle size={24} weight="fill" className="shrink-0 text-success" />
        </div>

        <div className="mt-5">
          <div className="mb-1.5 flex justify-between text-xs text-ink-faint">
            <span>
              Dia {diaAtual} de {DURACAO_TRIAL_DIAS}
            </span>
            <span>{diasRestantes} dias restantes</span>
          </div>
          <div className="h-1.5 rounded-full bg-surface-3">
            <motion.div
              className="h-full rounded-full bg-success"
              initial={{ width: reduced ? `${progresso}%` : 0 }}
              animate={{ width: `${progresso}%` }}
              transition={{ duration: reduced ? 0 : 0.8, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>

        <div className="mt-5 border-t border-line pt-5">
          <p className="text-sm text-ink-muted">
            Após o período grátis, a assinatura é{" "}
            <span className="font-medium text-ink">{formatBRL(subscription.planPrice)}/mês</span>.
            Nenhuma cobrança até lá.
          </p>
          <button
            type="button"
            onClick={handleAdicionarPagamento}
            className="mt-3 flex items-center gap-1 text-sm text-accent-text hover:underline"
          >
            Adicionar forma de pagamento agora
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  if (status === "active") {
    return (
      <div className="rounded-2xl border border-line bg-surface-1 p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <PlanBadge status="active" />
            <p className="mt-3 text-2xl font-semibold text-ink">
              {formatBRL(subscription.planPrice)}
              <span className="text-base font-normal text-ink-muted">/mês</span>
            </p>
            <p className="mt-1 text-sm text-ink-muted">
              Próxima cobrança em{" "}
              <span className="font-medium text-ink">
                {subscription.nextBillingAt ? formatDate(subscription.nextBillingAt) : "-"}
              </span>
            </p>
          </div>
          <CheckCircle size={24} weight="fill" className="shrink-0 text-success" />
        </div>

        <div className="mt-5 space-y-2 border-t border-line pt-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink-muted">1 obra ativa</span>
            <CheckCircle size={14} className="text-success" />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink-muted">
              Cartão terminado em {subscription.paymentMethod ?? "4821"}
            </span>
            <button
              type="button"
              onClick={handleAdicionarPagamento}
              className="text-xs text-accent-text hover:underline"
            >
              Alterar
            </button>
          </div>
        </div>

        <ConfirmDialog
          open={cancelando}
          onOpenChange={setCancelando}
          title="Cancelar assinatura"
          itemName="Sua assinatura do ObraReal Pro"
          description="Ao cancelar, você continua com acesso até o fim do período já pago."
          consequence="não será renovada no próximo ciclo."
          confirmLabel="Cancelar assinatura"
          onConfirm={handleCancelar}
        />
        <button
          type="button"
          onClick={() => setCancelando(true)}
          className="mt-5 text-sm text-ink-faint transition-colors hover:text-danger"
        >
          Cancelar assinatura
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-2xl border p-6",
        status === "canceled" ? "border-danger/40 bg-surface-1" : "border-warning/40 bg-surface-1",
      )}
    >
      <PlanBadge status={status} />
      <p className="mt-3 text-lg font-semibold text-ink">
        {status === "canceled" ? "Sua assinatura foi cancelada" : "Seu período grátis encerrou"}
      </p>
      <p className="mt-1 text-sm text-ink-muted">
        Assine para continuar acessando sua obra e todo o histórico.
      </p>
      <Button onClick={handleAssinar} className="mt-5 w-full">
        Assinar por {formatBRL(subscription.planPrice)}/mês
      </Button>
      <p className="mt-2 text-center text-xs text-ink-faint">
        Seus dados ficam seguros por 30 dias após o encerramento.
      </p>
    </div>
  );
}
