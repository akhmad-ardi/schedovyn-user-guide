"use client";

import * as React from "react";
import {
  AlertCircle,
  CheckCircle2,
  Layers,
  MapPin,
  Plus,
  Trash2,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type OverlapScenarioMode =
  | "overlap"
  | "resolved_sequential"
  | "unscheduled_removed";

export interface SessionBlockOverlapReplicaProps {
  readonly initialMode?: OverlapScenarioMode;
}

export function SessionBlockOverlapReplica({
  initialMode = "overlap",
}: SessionBlockOverlapReplicaProps): React.ReactElement {
  const [mode, setMode] = React.useState<OverlapScenarioMode>(initialMode);

  return (
    <div className="my-6 rounded-none border border-[var(--border)] bg-[var(--surface-subtle)] p-4 sm:p-5 print-avoid-break">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] pb-2.5">
        <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
          PERAGA INTERAKTIF ANTARMUKA SCHEDOVYN
        </span>
        <span className="font-mono text-[11px] tabular-nums text-[var(--muted-foreground)]">
          Kanvas Grid Waktu: Kelas VII-A (Senin)
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setMode("overlap")}
          className={cn(
            "inline-flex h-8 items-center gap-1.5 rounded-none border px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]",
            mode === "overlap"
              ? "border-[var(--status-error-border)] bg-[var(--status-error-bg)] text-[var(--status-error-fg)] font-semibold"
              : "border-[var(--border)] bg-[var(--background)] hover:bg-[var(--surface-subtle)]"
          )}
        >
          <AlertCircle className="size-3.5" />
          <span>Kondisi Sesi Bertabrakan</span>
        </button>

        <button
          type="button"
          onClick={() => setMode("resolved_sequential")}
          className={cn(
            "inline-flex h-8 items-center gap-1.5 rounded-none border px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]",
            mode === "resolved_sequential"
              ? "border-[var(--status-valid-border)] bg-[var(--status-valid-bg)] text-[var(--status-valid-fg)] font-semibold"
              : "border-[var(--border)] bg-[var(--background)] hover:bg-[var(--surface-subtle)]"
          )}
        >
          <CheckCircle2 className="size-3.5" />
          <span>Susun Berurutan</span>
        </button>

        <button
          type="button"
          onClick={() => setMode("unscheduled_removed")}
          className={cn(
            "inline-flex h-8 items-center gap-1.5 rounded-none border px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]",
            mode === "unscheduled_removed"
              ? "border-[var(--primary)] bg-[var(--background)] text-[var(--primary)] font-semibold"
              : "border-[var(--border)] bg-[var(--background)] hover:bg-[var(--surface-subtle)]"
          )}
        >
          <Layers className="size-3.5" />
          <span>Lepas ke Panel</span>
        </button>
      </div>

      <div className="mt-4 rounded-none border border-[var(--border)] bg-[var(--background)] p-4">
        {mode === "overlap" && (
          <div>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--status-error-border)] bg-[var(--status-error-bg)] p-2.5 text-xs text-[var(--status-error-fg)]">
              <div className="flex items-center gap-2">
                <AlertCircle className="size-4 shrink-0" />
                <span className="font-mono font-bold">CLASS_OVERLAP</span>
                <span className="font-heading font-semibold">
                  Jadwal Kelas Tumpang Tindih
                </span>
              </div>
              <Badge variant="error">Konflik ditemukan</Badge>
            </div>

            <p className="mb-3 text-xs leading-5 text-[var(--muted-foreground)]">
              Dua sesi berada pada rentang waktu yang sama. Grid membagi kolom hari
              menjadi 2 lajur berdampingan dengan bingkai merah peringatan:
            </p>

            <div className="grid grid-cols-2 gap-2 border border-[var(--status-error-border)] p-2 bg-[var(--surface-subtle)]">
              <div className="flex flex-col justify-between border-l-4 border-l-blue-600 border border-[var(--border)] bg-[var(--background)] p-3">
                <div>
                  <div className="flex items-center justify-between gap-1 text-[11px] font-mono text-[var(--muted-foreground)] tabular-nums">
                    <span>Slot Pagi</span>
                    <Badge variant="outline" className="text-[10px]">90 Menit</Badge>
                  </div>
                  <h4 className="mt-1 font-heading text-xs font-bold text-[var(--foreground)]">
                    Matematika
                  </h4>
                  <div className="mt-2 flex flex-col gap-1 text-[11px] text-[var(--muted-foreground)]">
                    <span className="inline-flex items-center gap-1">
                      <User className="size-3" /> Budi Santoso, S.Pd.
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3" /> Ruang VII-A
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between border-l-4 border-l-emerald-600 border border-[var(--status-error-border)] bg-[var(--status-error-bg)] p-3">
                <div>
                  <div className="flex items-center justify-between gap-1 text-[11px] font-mono text-[var(--status-error-fg)] tabular-nums">
                    <span>Slot Tumpang Tindih</span>
                    <Badge variant="error" className="text-[10px]">Bentrokan</Badge>
                  </div>
                  <h4 className="mt-1 font-heading text-xs font-bold text-[var(--foreground)]">
                    Ilmu Pengetahuan Alam (IPA)
                  </h4>
                  <div className="mt-2 flex flex-col gap-1 text-[11px] text-[var(--muted-foreground)]">
                    <span className="inline-flex items-center gap-1">
                      <User className="size-3" /> Siti Aminah, M.Pd.
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3" /> Lab IPA
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-[var(--status-error-border)] flex justify-end">
                  <button
                    type="button"
                    onClick={() => setMode("unscheduled_removed")}
                    className="inline-flex h-7 items-center gap-1 rounded-none border border-[var(--status-error-border)] bg-[var(--background)] px-2.5 text-[11px] font-medium text-[var(--status-error-fg)] hover:bg-[var(--status-error-bg)]"
                  >
                    <Trash2 className="size-3" />
                    <span>Lepas dari Grid</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {mode === "resolved_sequential" && (
          <div>
            <div className="mb-3 flex items-center justify-between border-b border-[var(--status-valid-border)] bg-[var(--status-valid-bg)] p-2.5 text-xs text-[var(--status-valid-fg)]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 shrink-0" />
                <span className="font-heading font-semibold">
                  Jadwal Berurutan Bebas Konflik
                </span>
              </div>
              <Badge variant="valid">Valid</Badge>
            </div>

            <p className="mb-3 text-xs leading-5 text-[var(--muted-foreground)]">
              Sesi kedua digeser ke jam berikutnya. Sesi yang berakhir tepat pada jam mulai
              sesi berikutnya tidak dianggap bertabrakan.
            </p>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between border-l-4 border-l-blue-600 border border-[var(--border)] bg-[var(--surface-subtle)] p-3 text-xs">
                <div>
                  <span className="font-mono text-xs tabular-nums text-[var(--primary)]">
                    07:30 - 09:00
                  </span>
                  <h4 className="font-heading text-xs font-bold text-[var(--foreground)]">
                    Matematika
                  </h4>
                  <span className="text-[11px] text-[var(--muted-foreground)]">
                    Budi Santoso, S.Pd. (Ruang VII-A)
                  </span>
                </div>
                <Badge variant="outline">90 Menit</Badge>
              </div>

              <div className="flex items-center justify-between border-l-4 border-l-emerald-600 border border-[var(--border)] bg-[var(--surface-subtle)] p-3 text-xs">
                <div>
                  <span className="font-mono text-xs tabular-nums text-[var(--primary)]">
                    09:00 - 10:30
                  </span>
                  <h4 className="font-heading text-xs font-bold text-[var(--foreground)]">
                    Ilmu Pengetahuan Alam (IPA)
                  </h4>
                  <span className="text-[11px] text-[var(--muted-foreground)]">
                    Siti Aminah, M.Pd. (Lab IPA)
                  </span>
                </div>
                <Badge variant="outline">90 Menit</Badge>
              </div>
            </div>
          </div>
        )}

        {mode === "unscheduled_removed" && (
          <div>
            <div className="mb-3 flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface-subtle)] p-2.5 text-xs text-[var(--foreground)]">
              <div className="flex items-center gap-2">
                <Layers className="size-4 shrink-0 text-[var(--primary)]" />
                <span className="font-heading font-semibold">
                  Sesi Berhasil Dilepas
                </span>
              </div>
              <Badge variant="info">Tersimpan</Badge>
            </div>

            <p className="mb-3 text-xs leading-5 text-[var(--muted-foreground)]">
              Grid waktu kembali memuat 1 sesi penuh Matematika, sedangkan sesi IPA
              masuk kembali ke daftar yang belum ditempatkan:
            </p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="border border-[var(--border)] p-3 bg-[var(--surface-subtle)]">
                <span className="font-heading text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Grid Hari Senin (Kelas VII-A)
                </span>
                <div className="mt-2 border-l-4 border-l-blue-600 border border-[var(--border)] bg-[var(--background)] p-3 text-xs">
                  <span className="font-mono text-xs tabular-nums text-[var(--primary)]">
                    Sesi Pagi
                  </span>
                  <h4 className="font-heading text-xs font-bold text-[var(--foreground)]">
                    Matematika
                  </h4>
                  <span className="text-[11px] text-[var(--muted-foreground)]">
                    Budi Santoso, S.Pd. (Ruang VII-A)
                  </span>
                </div>
              </div>

              <div className="border border-[var(--border)] p-3 bg-[var(--surface-subtle)]">
                <span className="font-heading text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Belum Terjadwal
                </span>
                <div className="mt-2 border border-[var(--border)] bg-[var(--background)] p-3 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-heading text-xs font-bold text-[var(--foreground)]">
                      Ilmu Pengetahuan Alam (IPA)
                    </h4>
                    <span className="font-mono text-[11px] tabular-nums text-[var(--muted-foreground)]">
                      90 Menit
                    </span>
                  </div>
                  <span className="text-[11px] text-[var(--muted-foreground)] block mt-1">
                    Siti Aminah, M.Pd. (Lab IPA)
                  </span>

                  <div className="mt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setMode("resolved_sequential")}
                      className="inline-flex h-7 items-center gap-1 rounded-none border border-[var(--primary)] bg-[var(--primary)] px-2.5 text-[11px] font-medium text-[var(--primary-foreground)] hover:opacity-90"
                    >
                      <Plus className="size-3" />
                      <span>Tempatkan ke Jadwal</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
