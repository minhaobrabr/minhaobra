import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "@phosphor-icons/react/dist/ssr";

import { DashboardView } from "@/components/dashboard/dashboard-view";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Visão geral da obra"
        description="Quanto entrou, quanto saiu e quanto ainda resta do orçamento."
        action={
          <Button asChild>
            <Link href="/despesas/nova">
              <Plus size={16} weight="bold" />
              Nova despesa
            </Link>
          </Button>
        }
      />
      <DashboardView />
    </>
  );
}
