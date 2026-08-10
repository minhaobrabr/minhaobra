"use client";

import * as React from "react";
import Link from "next/link";
import { List, X } from "@phosphor-icons/react/dist/ssr";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";

const LINKS = [
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#recursos", label: "Recursos" },
  { href: "#preco", label: "Preço" },
];

export function Nav() {
  const [menuAberto, setMenuAberto] = React.useState(false);
  const reduced = useReducedMotion();

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-line/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-ink-muted transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost" size="sm">
            <Link href="/login">Entrar</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/register">Começar grátis</Link>
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setMenuAberto(true)}
          aria-label="Abrir menu"
          className="rounded-full p-2 text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink md:hidden"
        >
          <List size={20} />
        </button>
      </div>

      <AnimatePresence>
        {menuAberto ? (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col bg-background md:hidden"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex h-16 items-center justify-between border-b border-line px-4">
              <Logo />
              <button
                type="button"
                onClick={() => setMenuAberto(false)}
                aria-label="Fechar menu"
                className="rounded-full p-2 text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex flex-1 flex-col gap-1 p-4">
              {LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuAberto(false)}
                  className="rounded-xl px-3 py-3 text-base text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="flex flex-col gap-2 border-t border-line p-4">
              <Button asChild variant="outline" onClick={() => setMenuAberto(false)}>
                <Link href="/login">Entrar</Link>
              </Button>
              <Button asChild onClick={() => setMenuAberto(false)}>
                <Link href="/register">Começar grátis</Link>
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
