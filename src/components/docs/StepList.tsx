import * as React from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface StepListProps {
  readonly children: ReactNode;
  readonly className?: string;
}

export interface StepItemProps {
  readonly step: number | string;
  readonly title: string;
  readonly children: ReactNode;
}

export function StepList({
  children,
  className,
}: StepListProps): React.ReactElement {
  return (
    <ol
      data-step-list
      className={cn(
        "my-6 flex flex-col gap-0 border-l border-[var(--border)] pl-0 list-none print-avoid-break",
        className
      )}
    >
      {children}
    </ol>
  );
}

export function StepItem({
  step,
  title,
  children,
}: StepItemProps): React.ReactElement {
  return (
    <li
      data-step-item
      className="relative flex gap-4 pb-6 last:pb-0 pl-4 print-avoid-break"
    >
      <div
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-none border border-[var(--primary)] bg-[var(--surface-subtle)] font-mono text-xs font-bold tabular-nums text-[var(--primary)]"
        aria-hidden="true"
      >
        {step}
      </div>
      <div className="flex-1 min-w-0 pt-0.5">
        <h4 className="font-heading text-sm font-semibold leading-snug text-[var(--foreground)] mb-1.5">
          {title}
        </h4>
        <div className="text-sm leading-6 text-[var(--muted-foreground)]">
          {children}
        </div>
      </div>
    </li>
  );
}
