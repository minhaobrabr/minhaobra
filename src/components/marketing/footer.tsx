import * as React from "react";
import Link from "next/link";

import { Logo } from "@/components/layout/logo";

const COLUNAS = [
  {
    titulo: "Produto",
    links: [
      { label: "Como funciona", href: "#como-funciona" },
      { label: "Funcionalidades", href: "#recursos" },
      { label: "Preço", href: "#preco" },
      { label: "Changelog", href: "#" },
    ],
  },
  {
    titulo: "Legal",
    links: [
      { label: "Privacidade", href: "#" },
      { label: "Termos de uso", href: "#" },
      { label: "Cookies", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <Logo />
            <p className="mt-3 max-w-[22ch] text-sm text-ink-muted">
              Controle total da sua obra.
            </p>
          </div>

          {COLUNAS.map((coluna) => (
            <div key={coluna.titulo}>
              <p className="text-sm font-medium text-ink">{coluna.titulo}</p>
              <ul className="mt-3 space-y-2.5">
                {coluna.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-ink-muted hover:text-ink">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="text-sm font-medium text-ink">Contato</p>
            <ul className="mt-3 space-y-2.5">
              <li>
                <Link href="mailto:hello@obrareal.app" className="text-sm text-ink-muted hover:text-ink">
                  hello@obrareal.app
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-12 text-xs text-ink-faint">© 2026 ObraReal. Feito com cuidado.</p>
      </div>
    </footer>
  );
}
