import type { Metadata } from "next";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";

import { Logo } from "@/components/layout/logo";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";

export const metadata: Metadata = { title: "Configurar obra" };

export default function OnboardingPage() {
  return (
    <div className="relative min-h-[100dvh]">
      <div className="fixed right-4 top-4 z-10 flex items-center gap-1.5 rounded-full border border-line bg-surface-1 px-3 py-1.5 text-xs text-ink-muted">
        <CheckCircle size={12} className="text-success" />
        30 dias grátis ativos
      </div>

      <div className="mx-auto flex min-h-[100dvh] max-w-xl flex-col justify-center px-4 py-16">
        <div className="flex justify-center">
          <Logo size="sm" />
        </div>
        <h1 className="mt-8 text-center text-2xl font-semibold text-ink">
          Vamos configurar sua obra
        </h1>
        <p className="mt-2 text-center text-sm text-ink-muted">
          Você pode editar qualquer informação depois.
        </p>

        <div className="mt-8">
          <OnboardingForm />
        </div>
      </div>
    </div>
  );
}
