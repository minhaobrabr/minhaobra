import * as React from "react";
import Link from "next/link";

import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="px-4 sm:px-6">
      <ScrollReveal className="mx-auto my-16 max-w-4xl rounded-2xl bg-surface-1 p-10 sm:p-12">
        <h2 className="text-center text-4xl font-semibold tracking-tight text-ink">
          Comece agora. É grátis.
        </h2>
        <p className="mt-3 text-center text-ink-muted">
          30 dias para testar sem comprometer nada.
        </p>
        <div className="mt-8 flex justify-center">
          <Button asChild size="lg" className="px-8 text-base">
            <Link href="/register">Começar 30 dias grátis</Link>
          </Button>
        </div>
      </ScrollReveal>
    </section>
  );
}
