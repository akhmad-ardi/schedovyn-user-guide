"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Search, ShieldAlert } from "lucide-react";
import { DocsNavbar } from "@/components/docs/DocsNavbar";
import { SearchCommandDialog } from "@/components/docs/SearchCommandDialog";

const QUICK_SAMPLE_QUERIES: readonly string[] = [
  "jam istirahat Jumat",
  "TEACHER_OVERLAP",
  "salin jadwal",
  "excel",
];

export interface HomeHeaderAndSearchProps {
  readonly children: React.ReactNode;
}

export function HomePortalFrame({
  children,
}: HomeHeaderAndSearchProps): React.ReactElement {
  const [searchOpen, setSearchOpen] = React.useState<boolean>(false);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      <DocsNavbar
        onOpenSearch={() => setSearchOpen(true)}
        showMobileMenuButton={false}
      />

      <SearchCommandDialog open={searchOpen} onOpenChange={setSearchOpen} />

      <section className="border-b border-[var(--border)] bg-[var(--surface-subtle)]">
        <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 sm:py-14">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 border border-[var(--border)] bg-[var(--background)] px-2.5 py-1 font-mono text-xs font-medium tabular-nums text-[var(--primary)]">
              <span>BUKU PEDOMAN OPERASIONAL & KAMUS REFERENSI AKADEMIK</span>
            </div>

            <h1 className="font-heading text-2xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
              Panduan Pemakaian & Referensi Resmi Schedovyn
            </h1>

            <p className="mt-3 text-base leading-7 text-[var(--muted-foreground)]">
              Dokumentasi langkah demi langkah untuk Staf Kurikulum, Operator
              Sekolah, Wakil Kepala Sekolah Bidang Kurikulum, dan Guru Penyusun
              Jadwal. Dirancang agar dapat dibuka berdampingan saat Anda
              menyusun jadwal pelajaran di kanvas editor.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="flex h-11 w-full max-w-2xl items-center justify-between gap-3 rounded-none border border-[var(--border)] bg-[var(--background)] px-3.5 text-left text-sm text-[var(--muted-foreground)] transition-colors hover:border-[var(--primary)] hover:text-[var(--foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
              >
                <span className="inline-flex items-center gap-2.5 truncate">
                  <Search
                    className="size-4 shrink-0 text-[var(--primary)]"
                    aria-hidden="true"
                  />
                  <span className="truncate">
                    Cari panduan, langkah perbaikan konflik, atau pintasan
                    keyboard...
                  </span>
                </span>
                <kbd className="inline-flex shrink-0 items-center rounded-none border border-[var(--border)] bg-[var(--surface-subtle)] px-2 py-0.5 font-mono text-xs font-medium text-[var(--foreground)]">
                  Ctrl K
                </kbd>
              </button>

              <div className="flex flex-wrap items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
                <span className="font-medium">Contoh pencarian cepat:</span>
                {QUICK_SAMPLE_QUERIES.map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => setSearchOpen(true)}
                    className="inline-flex h-6 items-center rounded-none border border-[var(--border)] bg-[var(--background)] px-2 font-mono text-[11px] text-[var(--foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/docs/01-pengenalan/mulai-cepat-10-menit"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-none border border-[var(--primary)] bg-[var(--primary)] px-4 font-heading text-xs font-semibold text-[var(--primary-foreground)] hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
              >
                <BookOpen className="size-3.5 shrink-0" aria-hidden="true" />
                <span>Mulai Cepat dalam 10 Menit</span>
                <ArrowRight className="size-3.5 shrink-0" aria-hidden="true" />
              </Link>

              <Link
                href="/docs/04-kamus-konflik-dan-validasi/empat-status-validasi"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-none border border-[var(--border)] bg-[var(--background)] px-4 font-heading text-xs font-semibold text-[var(--foreground)] hover:border-[var(--primary)] hover:bg-[var(--surface-subtle)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
              >
                <ShieldAlert
                  className="size-3.5 shrink-0 text-[var(--primary)]"
                  aria-hidden="true"
                />
                <span>Kamus Konflik & Validasi</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1">{children}</main>
    </div>
  );
}
