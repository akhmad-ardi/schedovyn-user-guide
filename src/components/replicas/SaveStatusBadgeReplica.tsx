"use client";

import * as React from "react";
import {
  AlertCircle,
  CheckCircle2,
  Database,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type SaveStatusState = "saving" | "saved" | "error";

export interface SaveStatusBadgeReplicaProps {
  readonly initialState?: SaveStatusState;
}

export function SaveStatusBadgeReplica({
  initialState = "saved",
}: SaveStatusBadgeReplicaProps): React.ReactElement {
  const [state, setState] = React.useState<SaveStatusState>(initialState);

  return (
    <div className="my-6 rounded-none border border-[var(--border)] bg-[var(--surface-subtle)] p-4 sm:p-5 print-avoid-break">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] pb-2.5">
        <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
          PERAGA INTERAKTIF ANTARMUKA SCHEDOVYN
        </span>
        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[var(--muted-foreground)]">
          <Database className="size-3.5" />
          <span>Local-First (IndexedDB)</span>
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setState("saving")}
          className={cn(
            "inline-flex h-8 items-center gap-1.5 rounded-none border px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]",
            state === "saving"
              ? "border-[var(--primary)] bg-[var(--background)] ring-1 ring-[var(--primary)]"
              : "border-[var(--border)] bg-[var(--background)] hover:bg-[var(--surface-subtle)]"
          )}
        >
          <Badge variant="outline" className="gap-1.5 border-0 px-0">
            <Loader2 className="size-3 animate-spin text-[var(--primary)]" />
            <span>Menyimpan...</span>
          </Badge>
        </button>

        <button
          type="button"
          onClick={() => setState("saved")}
          className={cn(
            "inline-flex h-8 items-center gap-1.5 rounded-none border px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]",
            state === "saved"
              ? "border-[var(--status-valid-border)] bg-[var(--background)] ring-1 ring-[var(--status-valid-border)]"
              : "border-[var(--border)] bg-[var(--background)] hover:bg-[var(--surface-subtle)]"
          )}
        >
          <Badge variant="valid" className="gap-1.5 border-0 px-0">
            <CheckCircle2 className="size-3 text-[var(--status-valid-fg)]" />
            <span>Tersimpan di browser</span>
          </Badge>
        </button>

        <button
          type="button"
          onClick={() => setState("error")}
          className={cn(
            "inline-flex h-8 items-center gap-1.5 rounded-none border px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]",
            state === "error"
              ? "border-[var(--status-error-border)] bg-[var(--background)] ring-1 ring-[var(--status-error-border)]"
              : "border-[var(--border)] bg-[var(--background)] hover:bg-[var(--surface-subtle)]"
          )}
        >
          <Badge variant="error" className="gap-1.5 border-0 px-0">
            <AlertCircle className="size-3 text-[var(--status-error-fg)]" />
            <span>Gagal menyimpan lokal</span>
          </Badge>
        </button>
      </div>

      <div className="mt-4 rounded-none border border-[var(--border)] bg-[var(--background)] p-4">
        {state === "saving" && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Loader2 className="size-4 animate-spin text-[var(--primary)]" />
              <span className="font-heading text-sm font-semibold text-[var(--foreground)]">
                Proses Penulisan Transaksi
              </span>
            </div>
            <p className="text-xs leading-5 text-[var(--muted-foreground)]">
              Sedang menulis transaksi sesi ke database lokal peramban Anda.
              Operasi ini berlangsung cepat dalam hitungan milidetik secara asinkron
              tanpa memerlukan koneksi internet.
            </p>
          </div>
        )}

        {state === "saved" && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-2.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-[var(--status-valid-fg)]" />
                <span className="font-heading text-sm font-semibold text-[var(--foreground)]">
                  Penyimpanan Database Aman
                </span>
              </div>
              <span className="font-mono text-xs tabular-nums text-[var(--muted-foreground)]">
                Waktu Simpan Terakhir: 10:42:18
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 text-xs">
              <div className="rounded-none border border-[var(--border)] bg-[var(--surface-subtle)] p-3">
                <span className="font-heading text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Target Penyimpanan
                </span>
                <p className="mt-1 font-mono text-xs text-[var(--foreground)]">
                  IndexedDB (schedovyn_local_db)
                </p>
              </div>

              <div className="rounded-none border border-[var(--border)] bg-[var(--surface-subtle)] p-3">
                <span className="font-heading text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Estimasi Kuota Penyimpanan
                </span>
                <p className="mt-1 font-mono text-xs text-[var(--foreground)]">
                  1,4 MB terpakai dari 1.024 MB (0,1%)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 rounded-none border border-[var(--border)] p-3 text-xs text-[var(--muted-foreground)]">
              <ShieldCheck className="size-4 shrink-0 text-[var(--primary)] mt-0.5" />
              <p>
                Data tersimpan aman di komputer ini. Jangan menghapus data situs
                (Site Data/IndexedDB) peramban Anda sebelum mengekspor cadangan jadwal
                ke format Excel atau PDF.
              </p>
            </div>
          </div>
        )}

        {state === "error" && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2.5">
              <AlertCircle className="size-4 text-[var(--status-error-fg)]" />
              <span className="font-heading text-sm font-semibold text-[var(--status-error-fg)]">
                Kendala Penyimpanan Database
              </span>
            </div>

            <p className="text-xs leading-5 text-[var(--foreground)]">
              Peramban tidak dapat menulis perubahan jadwal ke penyimpanan lokal.
              Berikut dua penyebab paling umum dan langkah mengatasinya:
            </p>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 text-xs">
              <div className="rounded-none border border-[var(--status-error-border)] bg-[var(--status-error-bg)] p-3 text-[var(--foreground)]">
                <span className="font-heading text-[11px] font-bold uppercase tracking-wider text-[var(--status-error-fg)]">
                  1. Ruang Penyimpanan Browser Penuh
                </span>
                <p className="mt-1 text-xs leading-5">
                  Kuota penyimpanan lokal peramban (QuotaExceededError) telah habis.
                  Bersihkan cache berkas peramban lain atau ekspor jadwal Anda terlebih dahulu.
                </p>
              </div>

              <div className="rounded-none border border-[var(--status-error-border)] bg-[var(--status-error-bg)] p-3 text-[var(--foreground)]">
                <span className="font-heading text-[11px] font-bold uppercase tracking-wider text-[var(--status-error-fg)]">
                  2. Akses Penyimpanan Dibatasi
                </span>
                <p className="mt-1 text-xs leading-5">
                  Anda membuka aplikasi pada mode penyamaran (Incognito/Private) dengan
                  kebijakan pemblokiran IndexedDB aktif. Buka Schedovyn di jendela normal.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
