"use client";

import { PageHeader } from "@/components/layout/page-header";
import { AccountDetailsCard } from "@/components/perfil/account-details-card";
import { BillingHistory } from "@/components/perfil/billing-history";
import { DeleteAccountDialog } from "@/components/perfil/delete-account-dialog";
import { SubscriptionCard } from "@/components/perfil/subscription-card";
import { useObra } from "@/components/providers/obra-store";
import { Reveal } from "@/components/shared/reveal";
import { Button } from "@/components/ui/button";

export function PerfilView() {
  const { usuario, subscription, billingHistory, signOut } = useObra();

  const mensagemVazia =
    subscription.status === "trial"
      ? "Seu período grátis está ativo."
      : "Assine para começar a acompanhar suas cobranças aqui.";

  return (
    <>
      <PageHeader title="Perfil" description="Seus dados de conta e o status da sua assinatura." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Reveal className="lg:col-span-5">
          <AccountDetailsCard />
        </Reveal>
        <Reveal delay={0.05} className="lg:col-span-7">
          <SubscriptionCard subscription={subscription} />
        </Reveal>
      </div>

      <Reveal delay={0.1} className="mt-4">
        <BillingHistory itens={billingHistory} mensagemVazia={mensagemVazia} />
      </Reveal>

      <div className="mt-8 border-t border-line pt-8">
        <h2 className="text-sm font-medium text-danger">Zona de perigo</h2>
        <p className="mt-1.5 max-w-md text-sm text-ink-muted">
          Excluir a conta remove permanentemente todos os dados desta obra.
        </p>
        <DeleteAccountDialog
          email={usuario.email}
          onConfirm={signOut}
          trigger={
            <Button variant="outline" className="mt-4 border-danger text-danger hover:bg-danger/10">
              Excluir minha conta
            </Button>
          }
        />
      </div>
    </>
  );
}
