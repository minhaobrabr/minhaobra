import * as React from "react";
import Link from "next/link";

import { Logo } from "@/components/layout/logo";

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
  /** Faixa de contexto (ex.: oferta de trial) — exibida entre o subtítulo e o formulário. */
  banner?: React.ReactNode;
}

export function AuthShell({ title, subtitle, children, footer, banner }: AuthShellProps) {
  return (
    <div className="flex min-h-[100dvh] flex-col justify-between px-6 py-8 sm:px-10 lg:px-14">
      <Link href="/" className="inline-flex w-fit">
        <Logo />
      </Link>

      <div className="mx-auto w-full max-w-sm py-12">
        <h1 className="text-3xl font-semibold tracking-tight text-ink">{title}</h1>
        <p className="mt-2 text-sm text-ink-muted">{subtitle}</p>
        {banner ? <div className="mt-5">{banner}</div> : null}
        <div className="mt-8">{children}</div>
      </div>

      <div className="text-xs text-ink-faint">{footer}</div>
    </div>
  );
}
