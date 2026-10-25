"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, Search } from "lucide-react";
import {
  DEFAULT_SEARCHABLE_SECTIONS,
  searchDocsGroupedByModule,
  type SearchableDocSection,
} from "@/lib/search-engine";
import { DOCS_MODULES } from "@/lib/docs-registry";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface SearchCommandDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly sections?: readonly SearchableDocSection[];
}

const POPULAR_KEYWORDS: readonly string[] = [
  "istirahat",
  "konflik guru",
  "salin jadwal",
  "excel",
  "undo",
];

function isEditableElement(element: Element | EventTarget | null): boolean {
  if (!element || typeof (element as HTMLElement).tagName !== "string") {
    return false;
  }
  const htmlEl = element as HTMLElement;
  const tagName = htmlEl.tagName.toUpperCase();
  return (
    tagName === "INPUT" ||
    tagName === "TEXTAREA" ||
    tagName === "SELECT" ||
    htmlEl.isContentEditable
  );
}

export function SearchCommandDialog({
  open,
  onOpenChange,
  sections = DEFAULT_SEARCHABLE_SECTIONS,
}: SearchCommandDialogProps): React.ReactElement {
  const router = useRouter();
  const [query, setQuery] = React.useState<string>("");

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (
        (event.ctrlKey || event.metaKey) &&
        (event.key === "k" || event.key === "K")
      ) {
        event.preventDefault();
        onOpenChange(!open);
        return;
      }

      if (
        event.key === "/" &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey
      ) {
        if (
          isEditableElement(event.target) ||
          isEditableElement(document.activeElement)
        ) {
          return;
        }
        event.preventDefault();
        onOpenChange(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onOpenChange]);

  const trimmedQuery = query.trim();
  const groupedResults = React.useMemo(
    () =>
      trimmedQuery.length > 0
        ? searchDocsGroupedByModule(trimmedQuery, sections)
        : [],
    [trimmedQuery, sections]
  );

  const handleSelectHref = (href: string): void => {
    onOpenChange(false);
    setQuery("");
    router.push(href);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl gap-0 p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Pencarian Panduan Schedovyn</DialogTitle>
          <DialogDescription>
            Cari artikel panduan, langkah penyelesaian konflik, atau pintasan
            keyboard.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2.5 border-b border-[var(--border)] bg-[var(--surface-subtle)] px-4 py-2.5 pr-12">
          <Search
            className="size-4 shrink-0 text-[var(--muted-foreground)]"
            aria-hidden="true"
          />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari panduan, topik, atau kode konflik (misal: istirahat, TEACHER_OVERLAP, excel)..."
            className="h-8 w-full bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none"
          />
        </div>

        <div className="max-h-[65vh] overflow-y-auto p-4">
          {trimmedQuery.length === 0 ? (
            <div className="flex flex-col gap-5">
              <div>
                <p className="mb-2 font-heading text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                  Kata Kunci Pencarian Populer
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_KEYWORDS.map((kw) => (
                    <button
                      key={kw}
                      type="button"
                      onClick={() => setQuery(kw)}
                      className="inline-flex h-7 items-center rounded-none border border-[var(--border)] bg-[var(--surface-subtle)] px-2.5 font-mono text-xs text-[var(--foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                    >
                      {kw}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 font-heading text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">
                  Akses Cepat 6 Modul Panduan
                </p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {DOCS_MODULES.map((mod) => {
                    const firstArticle = mod.articles[0];
                    if (!firstArticle) {
                      return null;
                    }
                    return (
                      <button
                        key={mod.moduleSlug}
                        type="button"
                        onClick={() => handleSelectHref(firstArticle.href)}
                        className="flex items-start gap-2.5 rounded-none border border-[var(--border)] bg-[var(--background)] p-2.5 text-left hover:border-[var(--primary)] hover:bg-[var(--surface-subtle)]"
                      >
                        <span className="inline-flex h-5 w-6 shrink-0 items-center justify-center rounded-none border border-[var(--border)] bg-[var(--surface-subtle)] font-mono text-[11px] font-bold tabular-nums text-[var(--primary)]">
                          {mod.moduleNumber}
                        </span>
                        <span className="font-heading text-xs font-semibold text-[var(--foreground)]">
                          {mod.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : groupedResults.length === 0 ? (
            <div className="flex flex-col gap-3 border border-[var(--border)] bg-[var(--surface-subtle)] p-5 text-sm">
              <p className="font-heading font-semibold text-[var(--foreground)]">
                {`Tidak ditemukan panduan untuk kata kunci '${trimmedQuery}'.`}
              </p>
              <p className="text-xs leading-5 text-[var(--muted-foreground)]">
                Coba gunakan kata kunci seperti &apos;istirahat&apos;,
                &apos;konflik guru&apos;, &apos;salin jadwal&apos;,
                &apos;excel&apos;, atau &apos;undo&apos;, atau buka referensi
                lengkap pada halaman Kamus Konflik.
              </p>
              <div className="pt-1">
                <Link
                  href="/docs/04-kamus-konflik-dan-validasi/empat-status-validasi"
                  onClick={() => onOpenChange(false)}
                  className="inline-flex h-8 items-center justify-center rounded-none border border-[var(--primary)] bg-[var(--primary)] px-3 font-heading text-xs font-medium text-[var(--primary-foreground)] hover:opacity-90"
                >
                  Buka Kamus Konflik & Validasi
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {groupedResults.map((group) => (
                <div key={group.moduleNumber} className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 border-b border-[var(--border)] pb-1">
                    <span className="font-mono text-xs font-bold tabular-nums text-[var(--primary)]">
                      Modul {group.moduleNumber}
                    </span>
                    <span className="font-heading text-xs font-semibold text-[var(--muted-foreground)]">
                      {group.moduleTitle}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    {group.items.map((item) => {
                      const displayHeading = item.sectionHeading.includes(
                        item.articleTitle
                      )
                        ? item.sectionHeading
                        : `${item.articleTitle}: ${item.sectionHeading}`;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectHref(item.href)}
                          className="flex w-full flex-col gap-1 rounded-none border border-[var(--border)] bg-[var(--background)] p-3 text-left transition-colors hover:border-[var(--primary)] hover:bg-[var(--surface-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                        >
                          <div className="flex items-center gap-2">
                            <FileText
                              className="size-3.5 shrink-0 text-[var(--primary)]"
                              aria-hidden="true"
                            />
                            <span className="font-heading text-sm font-semibold text-[var(--foreground)]">
                              {displayHeading}
                            </span>
                          </div>
                          <p className="pl-5.5 text-xs leading-5 text-[var(--muted-foreground)]">
                            {item.excerpt}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
