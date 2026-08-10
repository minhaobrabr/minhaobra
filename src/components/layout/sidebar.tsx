"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CaretUpDown, SignOut } from "@phosphor-icons/react/dist/ssr";
import { motion, useReducedMotion } from "motion/react";

import { Logo } from "@/components/layout/logo";
import { useObra } from "@/components/providers/obra-store";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { NAV_ITEMS } from "@/lib/navigation";
import { cn } from "@/lib/utils";

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: (typeof NAV_ITEMS)[number]["icon"];
  active: boolean;
  onNavigate?: () => void;
}) {
  const reduced = useReducedMotion();

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors duration-150",
        active
          ? "bg-surface-2 text-ink"
          : "text-ink-muted hover:bg-surface-2/50 hover:text-ink",
      )}
    >
      {active ? (
        <motion.span
          layoutId={reduced ? undefined : "nav-active"}
          aria-hidden
          className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-accent"
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        />
      ) : null}
      <Icon size={20} weight={active ? "fill" : "regular"} />
      <span className="font-medium">{label}</span>
    </Link>
  );
}

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { obra, usuario, signOut } = useObra();

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-line px-4 py-4">
        <Logo />
        <button
          type="button"
          className="mt-4 flex w-full items-center justify-between gap-2 rounded-xl bg-surface-2 px-3 py-2.5 text-left transition-colors hover:bg-surface-3"
        >
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium text-ink">{obra.nome}</span>
            <span className="mt-0.5 block font-mono text-[11px] text-ink-faint">
              obra ativa
            </span>
          </span>
          <CaretUpDown size={14} className="shrink-0 text-ink-faint" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            active={pathname === item.href || pathname.startsWith(`${item.href}/`)}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <div className="border-t border-line p-3">
        <div className="flex items-center gap-1.5 rounded-xl px-1 py-1">
          <Link
            href="/perfil"
            className="flex min-w-0 flex-1 items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-surface-2"
          >
            <span
              aria-hidden
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-3 text-xs font-semibold text-ink"
            >
              {usuario.nome.charAt(0)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-ink">{usuario.nome}</span>
              <span className="block truncate font-mono text-[11px] text-ink-faint">
                {usuario.email}
              </span>
            </span>
          </Link>
          <ConfirmDialog
            title="Sair da conta"
            itemName="Sua sessão"
            description="Você precisará entrar novamente para acessar a obra."
            consequence="será encerrada agora."
            confirmLabel="Sair"
            onConfirm={signOut}
            trigger={
              <button
                type="button"
                aria-label="Sair da conta"
                className="rounded-full p-2 text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
              >
                <SignOut size={16} />
              </button>
            }
          />
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="sidebar hidden w-64 shrink-0 border-r border-line bg-surface-1 lg:block">
      <div className="sticky top-0 h-[100dvh]">
        <SidebarContent />
      </div>
    </aside>
  );
}
