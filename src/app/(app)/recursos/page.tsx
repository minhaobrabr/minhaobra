import type { Metadata } from "next";

import { RecursosView } from "@/components/recursos/recursos-view";

export const metadata: Metadata = { title: "Recursos" };

export default function RecursosPage() {
  return <RecursosView />;
}
