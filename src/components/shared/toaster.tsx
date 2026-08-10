"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle, X } from "@phosphor-icons/react/dist/ssr";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

interface ToastInput {
  title: string;
  actionLabel?: string;
  actionHref?: string;
}

interface ToastItem extends ToastInput {
  id: string;
}

const EVENTO = "obracontrol:toast";

/**
 * API imperativa simples: qualquer client component pode chamar `toast(...)`
 * sem precisar de um provider no topo da árvore — o evento é ouvido pelo
 * `<Toaster />` montado uma vez no layout do app.
 */
export function toast(input: ToastInput) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<ToastInput>(EVENTO, { detail: input }));
}

export function Toaster() {
  const [itens, setItens] = React.useState<ToastItem[]>([]);
  const reduced = useReducedMotion();

  React.useEffect(() => {
    function handleToast(event: Event) {
      const detail = (event as CustomEvent<ToastInput>).detail;
      const id = Math.random().toString(36).slice(2, 9);
      setItens((atual) => [...atual, { ...detail, id }]);
      window.setTimeout(() => {
        setItens((atual) => atual.filter((item) => item.id !== id));
      }, 6000);
    }

    window.addEventListener(EVENTO, handleToast);
    return () => window.removeEventListener(EVENTO, handleToast);
  }, []);

  function dispensar(id: string) {
    setItens((atual) => atual.filter((item) => item.id !== id));
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4 sm:items-end sm:right-4 sm:left-auto">
      <AnimatePresence>
        {itens.map((item) => (
          <motion.div
            key={item.id}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border border-line bg-surface-1 p-4 shadow-float"
          >
            <CheckCircle size={18} weight="fill" className="mt-0.5 shrink-0 text-success" />
            <div className="min-w-0 flex-1">
              <p className="text-sm text-ink">{item.title}</p>
              {item.actionLabel && item.actionHref ? (
                <Link
                  href={item.actionHref}
                  onClick={() => dispensar(item.id)}
                  className="mt-1.5 inline-block text-sm font-medium text-accent-text hover:text-accent"
                >
                  {item.actionLabel}
                </Link>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => dispensar(item.id)}
              aria-label="Fechar notificação"
              className="shrink-0 rounded-full p-1 text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
