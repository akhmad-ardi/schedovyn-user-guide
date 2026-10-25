import * as React from "react";
import type { ReactNode } from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type CalloutVariant = "info" | "tip" | "warning" | "danger";

export interface CalloutProps {
  readonly variant?: CalloutVariant;
  readonly title?: string;
  readonly children: ReactNode;
  readonly className?: string;
}

const DEFAULT_TITLES: Readonly<Record<CalloutVariant, string>> = {
  info: "Catatan",
  tip: "Tips Kurikulum",
  warning: "Penting",
  danger: "Peringatan Konflik & Data",
};

const VARIANT_STYLES: Readonly<Record<CalloutVariant, string>> = {
  info: "border-[var(--status-info-border)] bg-[var(--status-info-bg)] text-[var(--foreground)]",
  tip: "border-[var(--status-valid-border)] bg-[var(--status-valid-bg)] text-[var(--foreground)]",
  warning:
    "border-[var(--status-warning-border)] bg-[var(--status-warning-bg)] text-[var(--foreground)]",
  danger:
    "border-[var(--status-error-border)] bg-[var(--status-error-bg)] text-[var(--foreground)]",
};

const VARIANT_HEADER_STYLES: Readonly<Record<CalloutVariant, string>> = {
  info: "text-[var(--status-info-fg)]",
  tip: "text-[var(--status-valid-fg)]",
  warning: "text-[var(--status-warning-fg)]",
  danger: "text-[var(--status-error-fg)]",
};

function renderVariantIcon(variant: CalloutVariant): React.ReactElement {
  switch (variant) {
    case "info":
      return <Info className="size-4 shrink-0" aria-hidden="true" />;
    case "tip":
      return <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />;
    case "warning":
      return <AlertTriangle className="size-4 shrink-0" aria-hidden="true" />;
    case "danger":
      return <AlertCircle className="size-4 shrink-0" aria-hidden="true" />;
  }
}

export function Callout({
  variant = "info",
  title,
  children,
  className,
}: CalloutProps): React.ReactElement {
  const resolvedTitle = title ?? DEFAULT_TITLES[variant];

  return (
    <div
      data-callout={variant}
      role="note"
      className={cn(
        "my-5 rounded-none border p-4 text-sm leading-6 print-avoid-break",
        VARIANT_STYLES[variant],
        className
      )}
    >
      <div
        className={cn(
          "mb-1.5 flex items-center gap-2 font-heading text-xs font-bold uppercase tracking-wide",
          VARIANT_HEADER_STYLES[variant]
        )}
      >
        {renderVariantIcon(variant)}
        <span>{resolvedTitle}</span>
      </div>
      <div className="text-sm leading-6 text-[var(--foreground)]">
        {children}
      </div>
    </div>
  );
}
