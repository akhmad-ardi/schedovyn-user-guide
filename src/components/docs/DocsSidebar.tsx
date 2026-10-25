"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DOCS_MODULES, type DocModuleGroup } from "@/lib/docs-registry";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export interface DocsSidebarProps {
  readonly modules?: readonly DocModuleGroup[];
  readonly mobileOpen?: boolean;
  readonly onMobileClose?: () => void;
}

function resolveActiveHref(
  pathname: string | null,
  modules: readonly DocModuleGroup[]
): string {
  const cleanPath = (pathname ?? "/docs").replace(/\/+$/, "") || "/docs";

  if (cleanPath === "/docs") {
    return (
      modules[0]?.articles[0]?.href ??
      "/docs/01-pengenalan/mengenal-schedovyn"
    );
  }

  const segments = cleanPath.split("/").filter(Boolean);
  if (segments.length === 2 && segments[0] === "docs") {
    const moduleSlug = segments[1];
    const matchedModule = modules.find((m) => m.moduleSlug === moduleSlug);
    if (matchedModule && matchedModule.articles.length > 0) {
      return matchedModule.articles[0]?.href ?? cleanPath;
    }
  }

  return cleanPath;
}

function SidebarNavigationTree({
  modules,
  activeHref,
  onNavigate,
}: {
  readonly modules: readonly DocModuleGroup[];
  readonly activeHref: string;
  readonly onNavigate?: () => void;
}): React.ReactElement {
  return (
    <nav aria-label="Daftar modul panduan" className="flex flex-col gap-6 py-4">
      {modules.map((moduleGroup) => (
        <div key={moduleGroup.moduleSlug} className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 px-3 py-1">
            <span className="inline-flex h-5 w-6 items-center justify-center rounded-none border border-[var(--border)] bg-[var(--background)] font-mono text-[11px] font-semibold tabular-nums text-[var(--primary)]">
              {moduleGroup.moduleNumber}
            </span>
            <span className="font-heading text-xs font-semibold text-[var(--foreground)]">
              {moduleGroup.title}
            </span>
          </div>

          <ul className="flex flex-col border-l border-[var(--border)] ml-6">
            {moduleGroup.articles.map((article) => {
              const isActive = article.href === activeHref;
              const normalizedLabel = article.title.replace(/[()]/g, "");
              const ariaLabel =
                normalizedLabel !== article.title
                  ? `${article.order} ${article.title} ${normalizedLabel}`
                  : `${article.order} ${article.title}`;

              return (
                <li key={article.href}>
                  <Link
                    href={article.href}
                    onClick={onNavigate}
                    aria-label={ariaLabel}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex items-start gap-2 border-l-2 py-1.5 pl-3 pr-2 text-xs leading-5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]",
                      isActive
                        ? "border-[var(--primary)] bg-[var(--surface-subtle)] font-semibold text-[var(--primary)]"
                        : "border-transparent text-[var(--muted-foreground)] hover:border-[var(--border)] hover:text-[var(--foreground)]"
                    )}
                  >
                    <span className="shrink-0 font-mono text-[11px] tabular-nums opacity-80">
                      {article.order}
                    </span>
                    <span>{article.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function DocsSidebar({
  modules = DOCS_MODULES,
  mobileOpen = false,
  onMobileClose,
}: DocsSidebarProps): React.ReactElement {
  const pathname = usePathname();
  const activeHref = resolveActiveHref(pathname, modules);

  return (
    <>
      <aside
        data-docs-chrome
        aria-label="Navigasi samping dokumentasi"
        className="no-print hidden lg:block w-64 shrink-0 border-r border-[var(--border)] bg-[var(--surface-subtle)]/50"
      >
        <div className="sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto px-2">
          <SidebarNavigationTree modules={modules} activeHref={activeHref} />
        </div>
      </aside>

      <Dialog
        open={mobileOpen}
        onOpenChange={(open) => {
          if (!open) {
            onMobileClose?.();
          }
        }}
      >
        <DialogContent className="left-0 top-0 h-full max-w-xs translate-x-0 translate-y-0 overflow-y-auto border-r border-[var(--border)] p-4">
          <DialogHeader className="border-b border-[var(--border)] pb-3">
            <DialogTitle>Navigasi Modul Panduan</DialogTitle>
            <DialogDescription>
              Pilih modul dan bab panduan pemakaian Schedovyn.
            </DialogDescription>
          </DialogHeader>
          <SidebarNavigationTree
            modules={modules}
            activeHref={activeHref}
            onNavigate={onMobileClose}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
