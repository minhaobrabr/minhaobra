"use client";

import * as React from "react";
import { CircleNotch } from "@phosphor-icons/react/dist/ssr";
import { motion, useReducedMotion } from "motion/react";

/** Tela cheia usada só entre a sessão confirmada e os dados carregados do Supabase. */
export function FullPageLoading() {
  const reduced = useReducedMotion();

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background">
      {reduced ? (
        <CircleNotch size={28} weight="bold" className="text-accent-text" />
      ) : (
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        >
          <CircleNotch size={28} weight="bold" className="text-accent-text" />
        </motion.span>
      )}
    </div>
  );
}
