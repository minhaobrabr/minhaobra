"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Bell, List } from "@phosphor-icons/react/dist/ssr";

import { useObra } from "@/components/providers/obra-store";
import { Badge } from "@/components/ui/badge";
import { tituloDaRota } from "@/lib/navigation";

export function TopBar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const pathname = usePathname();
  const { obra, usuario } = useObra();

  return (
    <header className="topbar sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b border-line bg-background/85 px-4 backdrop-blur lg:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Abrir menu"
          className="-ml-1 rounded-full p-2 text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink lg:hidden"
        >
          <List size={18} />
        </button>
        <h1 className="truncate text-sm font-semibold text-ink">{tituloDaRota(pathname)}</h1>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="neutral" className="hidden max-w-[16rem] truncate sm:inline-flex">
          {obra.nome}
        </Badge>
        <button
          type="button"
          aria-label="Notificações"
          className="relative rounded-full p-2 text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
        >
          <Bell size={18} />
          <span
            aria-hidden
            className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent"
          />
        </button>
        <span
          aria-hidden
          className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-2 text-xs font-semibold text-ink"
        >
          {usuario.nome.charAt(0)}
        </span>
      </div>
    </header>
  );
}
