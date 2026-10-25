import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getAdjacentArticles } from "@/lib/docs-registry";

export interface DocsPagerProps {
  readonly currentHref: string;
}

export function DocsPager({
  currentHref,
}: DocsPagerProps): React.ReactElement | null {
  const { prev, next } = getAdjacentArticles(currentHref);

  if (!prev && !next) {
    return null;
  }

  return (
    <nav
      data-docs-chrome
      aria-label="Navigasi urutan artikel"
      className="no-print mt-12 grid grid-cols-1 gap-4 border-t border-[var(--border)] pt-6 sm:grid-cols-2"
    >
      <div>
        {prev && (
          <Link
            href={prev.href}
            className="flex h-full flex-col justify-between gap-1.5 rounded-none border border-[var(--border)] bg-[var(--background)] p-4 transition-colors hover:border-[var(--primary)] hover:bg-[var(--surface-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
          >
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--muted-foreground)]">
              <ArrowLeft className="size-3.5 shrink-0" aria-hidden="true" />
              <span>Artikel Sebelumnya</span>
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="font-mono text-xs font-semibold tabular-nums text-[var(--primary)]">
                Bab {prev.order} ({prev.moduleTitle})
              </span>
              <span className="font-heading text-sm font-semibold text-[var(--foreground)]">
                {prev.title}
              </span>
            </div>
          </Link>
        )}
      </div>

      <div>
        {next && (
          <Link
            href={next.href}
            className="flex h-full flex-col justify-between gap-1.5 rounded-none border border-[var(--border)] bg-[var(--background)] p-4 text-left sm:items-end sm:text-right transition-colors hover:border-[var(--primary)] hover:bg-[var(--surface-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
          >
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--muted-foreground)]">
              <span>Artikel Selanjutnya</span>
              <ArrowRight className="size-3.5 shrink-0" aria-hidden="true" />
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="font-mono text-xs font-semibold tabular-nums text-[var(--primary)]">
                Bab {next.order} ({next.moduleTitle})
              </span>
              <span className="font-heading text-sm font-semibold text-[var(--foreground)]">
                {next.title}
              </span>
            </div>
          </Link>
        )}
      </div>
    </nav>
  );
}
