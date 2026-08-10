import * as React from "react";
import { Warning } from "@phosphor-icons/react/dist/ssr";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}

/** Label sempre acima do controle — nunca placeholder fazendo o papel de label. */
export function Field({ id, label, required, hint, error, className, children }: FieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <Label htmlFor={id}>
          {label}
          {required ? <span className="ml-0.5 text-accent-text">*</span> : null}
        </Label>
        {hint ? <span className="text-[11px] text-ink-faint">{hint}</span> : null}
      </div>
      {children}
      {error ? (
        <p className="flex items-center gap-1.5 text-xs text-danger">
          <Warning size={12} weight="fill" />
          {error}
        </p>
      ) : null}
    </div>
  );
}
