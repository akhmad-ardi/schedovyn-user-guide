"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { ArrowUpRight, Menu, Moon, Search, Sun } from "lucide-react";
import { PUBLIC_ENV } from "@/lib/env";

export interface DocsNavbarProps {
  readonly onOpenSearch?: () => void;
  readonly onOpenMobileSidebar?: () => void;
  readonly showMobileMenuButton?: boolean;
}

export function DocsNavbar({
  onOpenSearch,
  onOpenMobileSidebar,
  showMobileMenuButton = false,
}: DocsNavbarProps): React.ReactElement {
  const { resolvedTheme, theme, setTheme } = useTheme();

  const handleToggleTheme = (): void => {
    const activeTheme = resolvedTheme ?? theme ?? "light";
    setTheme(activeTheme === "dark" ? "light" : "dark");
  };

  return (
    <header
      data-docs-chrome
      className="no-print sticky top-0 z-40 h-14 w-full border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-md"
    >
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          {showMobileMenuButton && (
            <button
              type="button"
              onClick={onOpenMobileSidebar}
              aria-label="Buka navigasi modul"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-none border border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--foreground)] hover:bg-[var(--border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] lg:hidden"
            >
              <Menu className="size-4" aria-hidden="true" />
            </button>
          )}

          <Link
            href="/"
            className="inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-none border border-[var(--primary)] bg-[var(--primary)] font-mono text-xs font-bold text-[var(--primary-foreground)]">
              S
            </span>
            <span className="font-heading text-sm font-bold tracking-tight text-[var(--foreground)]">
              Schedovyn
            </span>
            <span className="rounded-none border border-[var(--border)] bg-[var(--surface-subtle)] px-1.5 py-0.5 font-mono text-[11px] font-semibold text-[var(--muted-foreground)]">
              PANDUAN
            </span>
          </Link>

          <nav
            aria-label="Navigasi utama portal"
            className="hidden md:flex items-center gap-4 pl-3 border-l border-[var(--border)] text-xs font-medium text-[var(--muted-foreground)]"
          >
            <Link
              href="/docs/01-pengenalan/mengenal-schedovyn"
              className="hover:text-[var(--foreground)] transition-colors"
            >
              Dokumentasi
            </Link>
            <a
              href={PUBLIC_ENV.LANDING_URL}
              className="hover:text-[var(--foreground)] transition-colors"
            >
              Halaman Produk
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenSearch}
            aria-label="Cari panduan atau kode konflik"
            className="inline-flex h-8 items-center justify-between gap-3 rounded-none border border-[var(--border)] bg-[var(--surface-subtle)] px-2.5 text-xs text-[var(--muted-foreground)] hover:border-[var(--primary)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] sm:w-64"
          >
            <span className="inline-flex items-center gap-1.5 truncate">
              <Search className="size-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">
                Cari panduan atau kode konflik...
              </span>
            </span>
            <kbd className="hidden sm:inline-flex items-center rounded-none border border-[var(--border)] bg-[var(--background)] px-1.5 py-0.5 font-mono text-[10px] font-medium text-[var(--muted-foreground)]">
              Ctrl K
            </kbd>
          </button>

          <button
            type="button"
            onClick={handleToggleTheme}
            aria-label="Ganti tema tampilan"
            title="Ganti tema tampilan (Pintasan: D)"
            className="inline-flex h-8 w-8 items-center justify-center rounded-none border border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--foreground)] hover:bg-[var(--border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
          >
            <Sun
              className="size-3.5 dark:hidden"
              aria-hidden="true"
            />
            <Moon
              className="hidden size-3.5 dark:block"
              aria-hidden="true"
            />
          </button>

          <a
            href={PUBLIC_ENV.APP_URL}
            className="inline-flex h-8 items-center justify-center gap-1.5 rounded-none border border-[var(--primary)] bg-[var(--primary)] px-3 font-heading text-xs font-medium text-[var(--primary-foreground)] hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
          >
            <span>Buka Aplikasi Schedovyn</span>
            <ArrowUpRight className="size-3.5 shrink-0" aria-hidden="true" />
          </a>
        </div>
      </div>
    </header>
  );
}
