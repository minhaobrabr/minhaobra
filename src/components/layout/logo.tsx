import * as React from "react";
import { HardHat } from "@phosphor-icons/react/dist/ssr";

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md";
}

export function Logo({ className, size = "md" }: LogoProps) {
  const iconSize = size === "sm" ? 16 : 18;

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span
        aria-hidden
        className={cn(
          "flex items-center justify-center rounded-lg bg-accent-dim/40 text-accent-text",
          size === "sm" ? "h-6 w-6" : "h-7 w-7",
        )}
      >
        <HardHat size={iconSize} weight="fill" />
      </span>
      <span
        className={cn(
          "font-semibold tracking-tight text-ink",
          size === "sm" ? "text-sm" : "text-[15px]",
        )}
      >
        Obra<span className="text-accent-text">Real</span>
      </span>
    </span>
  );
}
