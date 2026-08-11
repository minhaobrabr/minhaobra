import type { Metadata } from "next";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";

import { AuthShell } from "@/components/auth/auth-shell";
import { GoogleAuthForm } from "@/components/auth/google-auth-form";

export const metadata: Metadata = { title: "Criar conta" };

export default function RegisterPage() {
  return (
    <AuthShell
      title="Comece a controlar sua obra."
      subtitle="Crie sua conta em segundos, com o Google."
      footer="ObraReal: controle financeiro de obra para quem constrói."
      banner={
        <div className="flex items-start gap-2.5 rounded-xl border border-accent-dim bg-accent-dim/30 px-4 py-3">
          <CheckCircle size={16} weight="fill" className="mt-0.5 shrink-0 text-accent-text" />
          <p className="text-sm text-ink">
            30 dias grátis, sem cartão de crédito. Depois, R$ 19,90/mês.
          </p>
        </div>
      }
    >
      <GoogleAuthForm mode="register" />
    </AuthShell>
  );
}
