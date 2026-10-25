"use client";

import * as React from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type ValidationStatusCode =
  | "CONFLICT_DETECTED"
  | "INCOMPLETE"
  | "NO_CONFLICT_CURRENT_DATA"
  | "COMPLETE_AND_VALID";

export type ValidationBadgeTone = "error" | "warning" | "info" | "valid";

export interface ValidationStatusItem {
  readonly code: ValidationStatusCode;
  readonly label: string;
  readonly tone: ValidationBadgeTone;
  readonly activeClassCondition: string;
  readonly workspaceCondition: string;
  readonly summary: string;
  readonly schoolExample: string;
  readonly recommendedAction: string;
}

export interface ValidationStatusBadgesReplicaProps {
  readonly initialStatus?: ValidationStatusCode;
}

export const VALIDATION_STATUS_ITEMS: readonly ValidationStatusItem[] = [
  {
    code: "CONFLICT_DETECTED",
    label: "Konflik ditemukan",
    tone: "error",
    activeClassCondition:
      "Terdapat minimal 1 bentrokan waktu nyata pada kelas aktif atau lintas kelas.",
    workspaceCondition:
      "Terdapat minimal 1 bentrokan waktu di dalam ruang kerja sekolah.",
    summary:
      "Menandakan adanya tabrakan jadwal yang wajib diselesaikan sebelum jadwal dicetak, seperti guru mengajar di dua kelas pada jam yang sama atau sesi memotong jam istirahat.",
    schoolExample:
      "Budi Santoso, S.Pd. terjadwal mengajar Matematika di Kelas VII-A dan Kelas VII-B secara bersamaan pada hari Senin pukul 07:30 - 09:00.",
    recommendedAction:
      "Klik lencana status untuk membuka Dialog Ringkasan Validasi, periksa daftar kode Error merah, lalu geser jam sesi atau gunakan tombol Lepas dari Grid pada salah satu sesi yang bertabrakan.",
  },
  {
    code: "INCOMPLETE",
    label: "Belum lengkap",
    tone: "warning",
    activeClassCondition:
      "0 bentrokan waktu, namun masih ada kebutuhan sesi mingguan yang belum ditempatkan ke grid atau terdapat peringatan kelengkapan.",
    workspaceCondition:
      "Belum seluruh target sesi mingguan di sekolah terpenuhi.",
    summary:
      "Jadwal yang sudah terpasang di grid aman dari bentrokan waktu, tetapi alokasi jam pelajaran kelas ini masih kurang atau belum lengkap.",
    schoolExample:
      "Pada Kelas VII-A, mata pelajaran Ilmu Pengetahuan Alam (IPA) baru terjadwal 1 sesi dari target 2 sesi per minggu, atau sesi belum memilih Lab IPA.",
    recommendedAction:
      "Periksa Panel Belum Terjadwal di sisi kiri editor, lalu gunakan tarik-lepas atau tombol Tempatkan ke Jadwal hingga indikator Belum Terjadwal mencapai 0 sesi.",
  },
  {
    code: "NO_CONFLICT_CURRENT_DATA",
    label: "Tidak ada konflik pada data saat ini",
    tone: "info",
    activeClassCondition:
      "Kelas aktif sudah 100% lengkap (0 sesi belum terjadwal) dan 0 konflik.",
    workspaceCondition:
      "Masih ada kelas lain di dalam ruang kerja sekolah yang belum selesai disusun atau belum dikonfigurasi.",
    summary:
      "Kelas yang sedang Anda buka sudah selesai dan aman, tetapi secara keseluruhan sekolah masih terdapat kelas lain yang belum tuntas.",
    schoolExample:
      "Jadwal Kelas VII-A sudah terisi penuh 24 / 24 sesi tanpa konflik, namun jadwal Kelas VII-B baru terisi sebagian.",
    recommendedAction:
      "Gunakan pemilih Kelas Aktif di bagian atas editor atau gunakan fitur Salin Jadwal untuk menyelesaikan penyusunan jadwal pada kelas paralel lainnya.",
  },
  {
    code: "COMPLETE_AND_VALID",
    label: "Jadwal lengkap dan valid",
    tone: "valid",
    activeClassCondition: "Kelas aktif 100% lengkap dan 0 konflik.",
    workspaceCondition:
      "Seluruh kelas di ruang kerja sekolah 100% lengkap dan 0 konflik.",
    summary:
      "Kondisi ideal siap cetak. Seluruh kebutuhan pembelajaran mingguan di semua kelas telah terjadwal tanpa satu pun bentrokan guru, ruangan, maupun jam operasional.",
    schoolExample:
      "Seluruh rombongan belajar di SMP Negeri 1 Nusantara (Kelas VII-A dan Kelas VII-B) telah terisi lengkap dan bebas dari peringatan.",
    recommendedAction:
      "Jadwal siap diunduh dan dibagikan melalui menu Ekspor PDF Landscape atau Ekspor Excel (.xlsx).",
  },
];

function getToneIcon(tone: ValidationBadgeTone): React.ReactElement {
  switch (tone) {
    case "error":
      return <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />;
    case "warning":
      return <AlertTriangle className="size-3.5 shrink-0" aria-hidden="true" />;
    case "info":
      return <Info className="size-3.5 shrink-0" aria-hidden="true" />;
    case "valid":
      return <CheckCircle2 className="size-3.5 shrink-0" aria-hidden="true" />;
  }
}

export function ValidationStatusBadgesReplica({
  initialStatus = "CONFLICT_DETECTED",
}: ValidationStatusBadgesReplicaProps): React.ReactElement {
  const [selectedCode, setSelectedCode] =
    React.useState<ValidationStatusCode>(initialStatus);

  const selectedItem =
    VALIDATION_STATUS_ITEMS.find((item) => item.code === selectedCode) ??
    VALIDATION_STATUS_ITEMS[0];

  return (
    <div className="my-6 rounded-none border border-[var(--border)] bg-[var(--surface-subtle)] p-4 sm:p-5 print-avoid-break">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] pb-2.5">
        <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
          PERAGA INTERAKTIF ANTARMUKA SCHEDOVYN
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] text-[var(--muted-foreground)]">
          <HelpCircle className="size-3.5" aria-hidden="true" />
          <span>Klik lencana untuk melihat detail</span>
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {VALIDATION_STATUS_ITEMS.map((item) => {
          const isSelected = item.code === selectedCode;
          return (
            <button
              key={item.code}
              type="button"
              onClick={() => setSelectedCode(item.code)}
              aria-pressed={isSelected}
              className={cn(
                "inline-flex h-8 items-center gap-1.5 rounded-none border px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]",
                isSelected
                  ? "border-[var(--primary)] ring-1 ring-[var(--primary)]"
                  : "border-[var(--border)] hover:bg-[var(--background)]"
              )}
            >
              <Badge variant={item.tone} className="gap-1 border-0 px-0">
                {getToneIcon(item.tone)}
                <span>{item.label}</span>
              </Badge>
            </button>
          );
        })}
      </div>

      <div className="mt-4 rounded-none border border-[var(--border)] bg-[var(--background)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] pb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[var(--primary)]">
              {selectedItem.code}
            </span>
            <Badge variant={selectedItem.tone} className="text-[11px]">
              {selectedItem.label}
            </Badge>
          </div>
        </div>

        <p className="mt-3 text-xs leading-5 text-[var(--foreground)]">
          {selectedItem.summary}
        </p>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-none border border-[var(--border)] bg-[var(--surface-subtle)] p-3">
            <span className="font-heading text-[11px] font-bold uppercase tracking-wide text-[var(--muted-foreground)]">
              Kondisi Kelas Aktif
            </span>
            <p className="mt-1 text-xs leading-5 text-[var(--foreground)]">
              {selectedItem.activeClassCondition}
            </p>
          </div>

          <div className="rounded-none border border-[var(--border)] bg-[var(--surface-subtle)] p-3">
            <span className="font-heading text-[11px] font-bold uppercase tracking-wide text-[var(--muted-foreground)]">
              Kondisi Seluruh Ruang Kerja
            </span>
            <p className="mt-1 text-xs leading-5 text-[var(--foreground)]">
              {selectedItem.workspaceCondition}
            </p>
          </div>
        </div>

        <div className="mt-3 rounded-none border border-[var(--border)] p-3">
          <span className="font-heading text-[11px] font-bold uppercase tracking-wide text-[var(--primary)]">
            Contoh Nyata di Sekolah
          </span>
          <p className="mt-1 font-mono text-xs leading-5 text-[var(--foreground)]">
            {selectedItem.schoolExample}
          </p>
        </div>

        <div className="mt-3 rounded-none border border-[var(--border)] bg-[var(--surface-subtle)] p-3">
          <span className="font-heading text-[11px] font-bold uppercase tracking-wide text-[var(--muted-foreground)]">
            Tindakan yang Disarankan
          </span>
          <p className="mt-1 text-xs leading-5 text-[var(--foreground)]">
            {selectedItem.recommendedAction}
          </p>
        </div>
      </div>
    </div>
  );
}
