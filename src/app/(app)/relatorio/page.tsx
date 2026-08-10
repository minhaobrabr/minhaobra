import type { Metadata } from "next";

import { RelatorioView } from "@/components/relatorio/relatorio-view";

export const metadata: Metadata = { title: "Relatório" };

export default function RelatorioPage() {
  return <RelatorioView />;
}
