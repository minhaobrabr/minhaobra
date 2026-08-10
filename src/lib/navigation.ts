import { ChartLine, Coins, FileText, Receipt } from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";

export interface NavItem {
  href: string;
  label: string;
  icon: Icon;
  /** Título mostrado na TopBar. */
  title: string;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", title: "Dashboard", icon: ChartLine },
  { href: "/recursos", label: "Recursos", title: "Recursos", icon: Coins },
  { href: "/despesas", label: "Despesas", title: "Despesas", icon: Receipt },
  { href: "/relatorio", label: "Relatório", title: "Relatório", icon: FileText },
];

const TITULOS_EXTRAS: Record<string, string> = {
  "/despesas/nova": "Nova despesa",
  "/perfil": "Perfil",
};

export function tituloDaRota(pathname: string): string {
  if (TITULOS_EXTRAS[pathname]) return TITULOS_EXTRAS[pathname];
  const item = NAV_ITEMS.find(
    (nav) => pathname === nav.href || pathname.startsWith(`${nav.href}/`),
  );
  return item?.title ?? "ObraControl";
}
