"use client";

import * as React from "react";
import Link from "next/link";
import { EnvelopeSimple, Image as ImageIcon, ShieldCheck, User } from "@phosphor-icons/react/dist/ssr";

import { GoogleButton } from "@/components/auth/google-button";

const DADOS_ACESSADOS = [
  { icon: ImageIcon, label: "Foto de perfil" },
  { icon: User, label: "Nome" },
  { icon: EnvelopeSimple, label: "E-mail" },
];

interface GoogleAuthFormProps {
  mode: "login" | "register";
}

export function GoogleAuthForm({ mode }: GoogleAuthFormProps) {
  const label = mode === "register" ? "Criar conta com Google" : "Entrar com Google";

  return (
    <div className="space-y-6">
      <GoogleButton label={label} />

      <div className="flex items-start gap-2.5 rounded-xl border border-line bg-surface-2 px-4 py-3">
        <ShieldCheck size={18} weight="fill" className="mt-0.5 shrink-0 text-success" />
        <p className="text-sm text-ink-muted">
          <span className="font-medium text-ink">A forma mais segura de entrar.</span> Sem senha
          para criar, lembrar ou perder. Sua conta fica protegida pela segurança do Google.
        </p>
      </div>

      <div>
        <p className="text-xs font-medium tracking-wide text-ink-muted">
          O que o ObraControl acessa da sua conta Google
        </p>
        <ul className="mt-2.5 grid grid-cols-3 gap-2">
          {DADOS_ACESSADOS.map((item) => (
            <li
              key={item.label}
              className="flex flex-col items-center gap-1.5 rounded-xl border border-line bg-surface-2 px-2 py-3 text-center text-xs text-ink-muted"
            >
              <item.icon size={16} className="shrink-0 text-accent-text" />
              {item.label}
            </li>
          ))}
        </ul>
        <p className="mt-2.5 text-xs text-ink-faint">
          Nada além disso. Sem acesso a contatos, arquivos ou outros dados da sua conta.
        </p>
      </div>

      <p className="text-sm text-ink-muted">
        {mode === "register" ? (
          <>
            Já tem conta?{" "}
            <Link href="/login" className="font-medium text-accent-text hover:text-accent">
              Entrar
            </Link>
          </>
        ) : (
          <>
            Ainda não tem conta?{" "}
            <Link href="/register" className="font-medium text-accent-text hover:text-accent">
              Criar conta
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
