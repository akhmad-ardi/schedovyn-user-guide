"use client";

import * as React from "react";
import {
  Building2,
  Copy,
  HelpCircle,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type WorkspaceInitModeReplica = "BLANK" | "SEED_DEFAULT";
export type WorkspaceDuplicateModeReplica = "MASTER_DATA_ONLY" | "FULL_COPY";

export interface ReplicaWorkspaceItem {
  readonly id: string;
  readonly name: string;
  readonly academicPeriod: string;
  readonly snapIntervalMinutes: 5 | 10 | 15 | 30 | 60;
  readonly classesCount: number;
  readonly teachersCount: number;
  readonly scheduledSessionsCount: number;
  readonly unscheduledSessionsCount: number;
  readonly validationStatusLabel: string;
}

export interface WorkspaceSwitcherReplicaProps {
  readonly initialWorkspaceId?: string;
  readonly initialInitMode?: WorkspaceInitModeReplica;
  readonly initialDuplicateMode?: WorkspaceDuplicateModeReplica;
}

const REPLICA_WORKSPACES: readonly ReplicaWorkspaceItem[] = [
  {
    id: "ws-ganjil",
    name: "SMPN 1 Nusantara",
    academicPeriod: "Semester Ganjil 2026/2027",
    snapIntervalMinutes: 30,
    classesCount: 2,
    teachersCount: 3,
    scheduledSessionsCount: 12,
    unscheduledSessionsCount: 0,
    validationStatusLabel: "Jadwal lengkap dan valid",
  },
  {
    id: "ws-genap",
    name: "SMPN 1 Nusantara",
    academicPeriod: "Semester Genap 2026/2027",
    snapIntervalMinutes: 30,
    classesCount: 2,
    teachersCount: 3,
    scheduledSessionsCount: 0,
    unscheduledSessionsCount: 12,
    validationStatusLabel: "Belum lengkap",
  },
];

export function WorkspaceSwitcherReplica({
  initialWorkspaceId = "ws-ganjil",
  initialInitMode = "BLANK",
  initialDuplicateMode = "MASTER_DATA_ONLY",
}: WorkspaceSwitcherReplicaProps): React.ReactElement {
  const [activeWorkspaceId, setActiveWorkspaceId] =
    React.useState<string>(initialWorkspaceId);
  const [initMode, setInitMode] =
    React.useState<WorkspaceInitModeReplica>(initialInitMode);
  const [duplicateMode, setDuplicateMode] =
    React.useState<WorkspaceDuplicateModeReplica>(initialDuplicateMode);
  const [workspacesCountSim, setWorkspacesCountSim] = React.useState<number>(2);

  const activeWorkspace =
    REPLICA_WORKSPACES.find((ws) => ws.id === activeWorkspaceId) ??
    REPLICA_WORKSPACES[0];

  const isOnlyOneWorkspace = workspacesCountSim === 1;

  return (
    <div className="my-6 rounded-none border border-[var(--border)] bg-[var(--surface-subtle)] p-4 sm:p-5 print-avoid-break">
      {/* Header Peraga */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] pb-2.5">
        <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
          PERAGA INTERAKTIF ANTARMUKA SCHEDOVYN
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] text-[var(--muted-foreground)]">
          <HelpCircle className="size-3.5" aria-hidden="true" />
          <span>Simulasi fitur multi-ruang kerja Schedovyn FR-13</span>
        </span>
      </div>

      <div className="space-y-6">
        {/* Bagian 1: Pemilih Ruang Kerja Aktif (Workspace Switcher) */}
        <div>
          <div className="mb-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="size-4 text-[var(--primary)]" aria-hidden="true" />
              <h4 className="font-heading text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]">
                1. Pemilih Ruang Kerja Aktif (Workspace Switcher)
              </h4>
            </div>
            <span className="font-mono text-[11px] tabular-nums text-[var(--muted-foreground)]">
              Penyimpanan Browser: localStorage
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {REPLICA_WORKSPACES.map((ws) => {
              const isActive = ws.id === activeWorkspaceId;
              return (
                <button
                  key={ws.id}
                  type="button"
                  onClick={() => setActiveWorkspaceId(ws.id)}
                  aria-pressed={isActive}
                  className={cn(
                    "flex flex-col gap-1.5 rounded-none border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]",
                    isActive
                      ? "border-[var(--primary)] bg-[var(--background)] shadow-sm"
                      : "border-[var(--border)] bg-[var(--background)]/60 hover:border-[var(--primary)] hover:bg-[var(--background)]"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-heading text-sm font-bold text-[var(--foreground)]">
                      {ws.name}
                    </span>
                    {isActive ? (
                      <Badge variant="default" className="text-[10px]">
                        Aktif
                      </Badge>
                    ) : (
                      <span className="font-mono text-[11px] text-[var(--muted-foreground)]">
                        Pilih
                      </span>
                    )}
                  </div>
                  <div className="font-heading text-xs font-medium text-[var(--primary)]">
                    {ws.academicPeriod}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] tabular-nums text-[var(--muted-foreground)]">
                    <span>{ws.classesCount} Kelas</span>
                    <span>&bull;</span>
                    <span>{ws.teachersCount} Guru</span>
                    <span>&bull;</span>
                    <span>{ws.scheduledSessionsCount} Sesi Terjadwal</span>
                    <span>&bull;</span>
                    <span>{ws.unscheduledSessionsCount} Belum Terjadwal</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Kartu Status Ruang Kerja Aktif */}
          <div className="mt-3 rounded-none border border-[var(--border)] bg-[var(--background)] p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-heading font-semibold text-[var(--foreground)]">
                  Status Validasi:
                </span>
                <span
                  className={cn(
                    "inline-flex items-center rounded-none border px-2 py-0.5 font-heading text-xs font-semibold",
                    activeWorkspace.validationStatusLabel === "Jadwal lengkap dan valid"
                      ? "border-emerald-600/30 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                      : "border-amber-600/30 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
                  )}
                >
                  {activeWorkspace.validationStatusLabel}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
                <RotateCcw className="size-3.5 text-[var(--primary)]" aria-hidden="true" />
                <span>
                  Riwayat Undo/Redo:{" "}
                  <strong className="font-mono font-semibold tabular-nums text-[var(--foreground)]">
                    0 langkah (Direset saat berpindah ruang kerja)
                  </strong>
                </span>
              </div>
            </div>
            <div className="mt-2 text-[11px] leading-5 text-[var(--muted-foreground)]">
              Evaluasi konflik guru dan ruangan dihitung terisolasi pada ruang kerja aktif (
              <span className="font-mono text-[var(--foreground)]">
                workspaceId: {activeWorkspace.id}
              </span>
              ). Preferensi disimpan pada peramban via{" "}
              <code className="font-mono text-[var(--primary)]">
                schedovyn_active_workspace_id
              </code>
              .
            </div>
          </div>
        </div>

        {/* Bagian 2: Mode Inisialisasi Ruang Kerja Baru (WorkspaceInitMode) */}
        <div className="border-t border-[var(--border)] pt-4">
          <div className="mb-2.5 flex items-center gap-2">
            <Sparkles className="size-4 text-[var(--primary)]" aria-hidden="true" />
            <h4 className="font-heading text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]">
              2. Mode Inisialisasi Ruang Kerja Baru (WorkspaceInitMode)
            </h4>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setInitMode("BLANK")}
              aria-pressed={initMode === "BLANK"}
              className={cn(
                "inline-flex h-8 items-center gap-2 rounded-none border px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]",
                initMode === "BLANK"
                  ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:border-[var(--primary)]"
              )}
            >
              <span>Ruang Kerja Kosong</span>
              <span className="font-mono text-[10px] opacity-80">(BLANK)</span>
            </button>

            <button
              type="button"
              onClick={() => setInitMode("SEED_DEFAULT")}
              aria-pressed={initMode === "SEED_DEFAULT"}
              className={cn(
                "inline-flex h-8 items-center gap-2 rounded-none border px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]",
                initMode === "SEED_DEFAULT"
                  ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:border-[var(--primary)]"
              )}
            >
              <span>Muat Data Contoh</span>
              <span className="font-mono text-[10px] opacity-80">(SEED_DEFAULT)</span>
            </button>
          </div>

          <div className="mt-3 rounded-none border border-[var(--border)] bg-[var(--background)] p-3 text-xs leading-5">
            {initMode === "BLANK" ? (
              <div>
                <div className="flex items-center gap-2 font-heading font-semibold text-[var(--foreground)]">
                  <span className="font-mono text-[11px] text-[var(--primary)]">BLANK</span>
                  <span>Inisialisasi Kanvas Kosong</span>
                </div>
                <p className="mt-1 text-[var(--muted-foreground)]">
                  Ruang kerja diinisialisasi dengan konfigurasi hari sekolah standar (Senin sampai Jumat aktif, Sabtu dan Minggu libur) dengan snap 30 menit. Tabel data master dan jadwal sesi berstatus 0 data master dan 0 sesi terjadwal, siap dikonfigurasi mandiri dari nol.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 font-heading font-semibold text-[var(--foreground)]">
                  <span className="font-mono text-[11px] text-[var(--primary)]">SEED_DEFAULT</span>
                  <span>Inisialisasi Data Percontohan</span>
                </div>
                <p className="mt-1 text-[var(--muted-foreground)]">
                  Ruang kerja baru otomatis diisi paket data percontohan SMP Negeri 1 Nusantara (2 kelas paralel Kelas VII-A dan VII-B, 3 guru pengajar, ruangan Lab IPA, serta jadwal pembelajaran terpadu). Seluruh entitas dibangkitkan dengan identitas UUID baru sehingga aman dan tidak menimpa data ruang kerja lainnya.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bagian 3: Mode Duplikasi Ruang Kerja (WorkspaceDuplicateMode) */}
        <div className="border-t border-[var(--border)] pt-4">
          <div className="mb-2.5 flex items-center gap-2">
            <Copy className="size-4 text-[var(--primary)]" aria-hidden="true" />
            <h4 className="font-heading text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]">
              3. Mode Duplikasi Ruang Kerja (WorkspaceDuplicateMode)
            </h4>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setDuplicateMode("MASTER_DATA_ONLY")}
              aria-pressed={duplicateMode === "MASTER_DATA_ONLY"}
              className={cn(
                "inline-flex h-8 items-center gap-2 rounded-none border px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]",
                duplicateMode === "MASTER_DATA_ONLY"
                  ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:border-[var(--primary)]"
              )}
            >
              <span>Konfigurasi & Data Master Saja</span>
              <span className="font-mono text-[10px] opacity-80">(MASTER_DATA_ONLY)</span>
            </button>

            <button
              type="button"
              onClick={() => setDuplicateMode("FULL_COPY")}
              aria-pressed={duplicateMode === "FULL_COPY"}
              className={cn(
                "inline-flex h-8 items-center gap-2 rounded-none border px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]",
                duplicateMode === "FULL_COPY"
                  ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:border-[var(--primary)]"
              )}
            >
              <span>Salin Penuh Beserta Jadwal</span>
              <span className="font-mono text-[10px] opacity-80">(FULL_COPY)</span>
            </button>
          </div>

          <div className="mt-3 rounded-none border border-[var(--border)] bg-[var(--background)] p-3 text-xs leading-5">
            {duplicateMode === "MASTER_DATA_ONLY" ? (
              <div>
                <div className="flex items-center gap-2 font-heading font-semibold text-[var(--foreground)]">
                  <span className="font-mono text-[11px] text-[var(--primary)]">MASTER_DATA_ONLY</span>
                  <span>Duplikasi Konfigurasi Tanpa Sesi</span>
                </div>
                <p className="mt-1 text-[var(--muted-foreground)]">
                  Menyalin jam operasional sekolah, waktu istirahat, kelas, guru, mata pelajaran, ruangan, dan target kebutuhan pembelajaran mingguan dengan pemetaan ulang ID baru. Seluruh posisi sesi jadwal dikosongkan (sessions = []) sehingga sangat ideal untuk persiapan semester genap atau tahun ajaran baru.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 font-heading font-semibold text-[var(--foreground)]">
                  <span className="font-mono text-[11px] text-[var(--primary)]">FULL_COPY</span>
                  <span>Duplikasi Komprehensif Seluruh Grid</span>
                </div>
                <p className="mt-1 text-[var(--muted-foreground)]">
                  Menduplikasi seluruh data ruang kerja sumber secara komprehensif, mencakup seluruh data master serta posisi penempatan sesi terjadwal pada kanvas grid mingguan. Cocok digunakan sebagai ruang kerja simulasi uji coba perubahan jadwal tanpa merusak jadwal utama.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bagian 4: Proteksi Penghapusan Ruang Kerja Terakhir */}
        <div className="border-t border-[var(--border)] pt-4">
          <div className="mb-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="size-4 text-[var(--primary)]" aria-hidden="true" />
              <h4 className="font-heading text-xs font-semibold uppercase tracking-wider text-[var(--foreground)]">
                4. Proteksi Penghapusan Ruang Kerja Terakhir
              </h4>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setWorkspacesCountSim(2)}
                className={cn(
                  "h-7 rounded-none border px-2.5 font-mono text-[11px] transition-colors",
                  workspacesCountSim === 2
                    ? "border-[var(--primary)] bg-[var(--surface-subtle)] font-bold text-[var(--primary)]"
                    : "border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)]"
                )}
              >
                Simulasi: 2 Ruang Kerja Tersimpan
              </button>
              <button
                type="button"
                onClick={() => setWorkspacesCountSim(1)}
                className={cn(
                  "h-7 rounded-none border px-2.5 font-mono text-[11px] transition-colors",
                  workspacesCountSim === 1
                    ? "border-[var(--primary)] bg-[var(--surface-subtle)] font-bold text-[var(--primary)]"
                    : "border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)]"
                )}
              >
                Simulasi: 1 Ruang Kerja Tersisa
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 rounded-none border border-[var(--border)] bg-[var(--background)] p-3">
            <Button
              type="button"
              variant="destructive"
              disabled={isOnlyOneWorkspace}
              className="h-8 rounded-none px-3 font-heading text-xs"
            >
              <Trash2 className="size-3.5" aria-hidden="true" />
              <span>Hapus Ruang Kerja</span>
            </Button>

            {isOnlyOneWorkspace ? (
              <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
                Sistem wajib mempertahankan minimal satu ruang kerja aktif. Tombol hapus dinonaktifkan secara otomatis.
              </span>
            ) : (
              <span className="text-xs text-[var(--muted-foreground)]">
                Ruang kerja aktif dapat dihapus. Sistem akan secara otomatis mengalihkan tampilan ke ruang kerja tersisa lainnya.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
