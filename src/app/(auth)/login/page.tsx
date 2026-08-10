import type { Metadata } from "next";

import { AuthShell } from "@/components/auth/auth-shell";
import { GoogleAuthForm } from "@/components/auth/google-auth-form";

export const metadata: Metadata = { title: "Entrar" };

export default function LoginPage() {
  return (
    <AuthShell
      title="Controle total da sua obra."
      subtitle="Entre com sua conta Google para continuar."
      footer="ObraControl: controle financeiro de obra para quem constrói."
    >
      <GoogleAuthForm mode="login" />
    </AuthShell>
  );
}
