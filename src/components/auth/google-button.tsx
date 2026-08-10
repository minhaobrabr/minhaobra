"use client";

import * as React from "react";
import { Warning } from "@phosphor-icons/react/dist/ssr";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden focusable="false">
      <path
        fill="#4285F4"
        d="M23.06 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h6.19a5.29 5.29 0 0 1-2.3 3.47v2.88h3.72c2.17-2 3.45-4.95 3.45-8.36z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.11 0 5.72-1.03 7.63-2.79l-3.72-2.88c-1.03.69-2.35 1.1-3.91 1.1-3 0-5.55-2.03-6.46-4.76H1.69v2.98A11.5 11.5 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.54 14.67a6.9 6.9 0 0 1 0-4.41V7.28H1.69a11.51 11.51 0 0 0 0 10.37l3.85-2.98z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.69 0 3.21.58 4.4 1.72l3.3-3.3C17.71 1.19 15.1 0 12 0 7.53 0 3.66 2.57 1.69 6.31l3.85 2.98C6.45 6.78 9 4.75 12 4.75z"
      />
    </svg>
  );
}

interface GoogleButtonProps {
  label: string;
}

export function GoogleButton({ label }: GoogleButtonProps) {
  const [carregando, setCarregando] = React.useState(false);
  const [erro, setErro] = React.useState<string | null>(null);

  async function handleClick() {
    setErro(null);
    setCarregando(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setErro(
        error.message.toLowerCase().includes("provider")
          ? "O login com Google ainda não foi habilitado neste projeto."
          : "Não foi possível conectar com o Google. Tente novamente.",
      );
      setCarregando(false);
      return;
    }

    // Sucesso: o navegador sai para a tela de consentimento do Google.
    // Não há mais nada a fazer aqui — o /auth/callback cuida da volta.
  }

  return (
    <div>
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full text-base"
        loading={carregando}
        loadingLabel="Conectando com o Google"
        onClick={handleClick}
      >
        <GoogleMark />
        {label}
      </Button>
      {erro ? (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-danger">
          <Warning size={12} weight="fill" />
          {erro}
        </p>
      ) : null}
    </div>
  );
}
