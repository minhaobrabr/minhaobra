import type { Metadata } from "next";
import { Suspense } from "react";

import { DespesaForm } from "@/components/despesas/despesa-form";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Nova despesa" };

export default function NovaDespesaPage() {
  return (
    <Suspense
      fallback={
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          <Skeleton className="h-[640px] rounded-2xl lg:col-span-3" />
          <Skeleton className="h-96 rounded-2xl lg:col-span-2" />
        </div>
      }
    >
      <DespesaForm />
    </Suspense>
  );
}
