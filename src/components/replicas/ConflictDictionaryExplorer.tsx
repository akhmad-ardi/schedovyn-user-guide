"use client";

import * as React from "react";
import { AlertCircle, AlertTriangle, RotateCcw, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type ConflictSeverity = "ERROR" | "WARNING";
export type ConflictCategoryFilter = "ALL" | "ERROR" | "WARNING";

export type ConflictCode =
  | "CLASS_OVERLAP"
  | "TEACHER_OVERLAP"
  | "ROOM_OVERLAP"
  | "TEACHER_UNAVAILABLE"
  | "ROOM_UNAVAILABLE"
  | "OUTSIDE_OPERATING_HOURS"
  | "BREAK_TIME_OVERLAP"
  | "UNFULFILLED_REQUIREMENT"
  | "OVER_SCHEDULED_SESSION"
  | "MISSING_TEACHER"
  | "MISSING_REQUIRED_ROOM"
  | "UNCONFIGURED_CLASS";

export interface ConflictDictionaryItem {
  readonly code: ConflictCode;
  readonly severity: ConflictSeverity;
  readonly title: string;
  readonly cause: string;
  readonly resolution: string;
  readonly exampleCase: string;
}

export interface ConflictDictionaryExplorerProps {
  readonly initialFilter?: ConflictCategoryFilter;
}

export const CONFLICT_DICTIONARY_ITEMS: readonly ConflictDictionaryItem[] = [
  {
    code: "CLASS_OVERLAP",
    severity: "ERROR",
    title: "Jadwal Kelas Tumpang Tindih",
    cause:
      "Dua atau lebih sesi pembelajaran ditempatkan pada hari dan rentang jam yang saling beririsan di dalam rombongan belajar (kelas) yang sama.",
    resolution:
      "Klik salah satu blok sesi pada overlap cluster di grid, lalu geser ke jam kosong pada Panel Detail Sesi atau tekan tombol Lepas dari Grid.",
    exampleCase:
      "Di Kelas VII-A pada hari Senin pukul 07:30 - 09:00 terdapat sesi Matematika sekaligus Bahasa Indonesia.",
  },
  {
    code: "TEACHER_OVERLAP",
    severity: "ERROR",
    title: "Bentrokan Jadwal Guru",
    cause:
      "Satu guru yang sama dijadwalkan mengajar di dua atau lebih kelas berbeda pada hari dan rentang waktu yang beririsan (deteksi lintas kelas otomatis).",
    resolution:
      "Pindahkan jam mengajar guru tersebut di salah satu kelas ke slot waktu lain, atau ganti guru pengajar sesi melalui Panel Detail Sesi.",
    exampleCase:
      "Setelah menyalin jadwal dari Kelas VII-A ke Kelas VII-B, Budi Santoso, S.Pd. tercatat mengajar di kedua kelas pada hari Senin pukul 07:30 - 09:00.",
  },
  {
    code: "ROOM_OVERLAP",
    severity: "ERROR",
    title: "Bentrokan Pemakaian Ruangan",
    cause:
      "Satu fasilitas atau ruangan yang sama dipakai oleh dua atau lebih kelas berbeda pada hari dan jam yang beririsan.",
    resolution:
      "Ubah jam pelaksanaan sesi praktik di salah satu kelas agar pemakaian ruangan bergantian, atau pilih ruangan lain yang tersedia di Panel Detail Sesi.",
    exampleCase:
      "Kelas VII-A dan Kelas VII-B sama-sama dijadwalkan menggunakan Lab IPA pada hari Selasa pukul 09:00 - 10:30.",
  },
  {
    code: "TEACHER_UNAVAILABLE",
    severity: "ERROR",
    title: "Guru Tidak Bersedia",
    cause:
      "Sesi dijadwalkan pada hari dan rentang jam ketika guru pengajar tercatat tidak dapat hadir (unavailable interval) pada pengaturan Data Master Guru.",
    resolution:
      "Geser sesi ke hari atau jam ketika guru tersebut hadir di sekolah, atau sesuaikan jadwal ketersediaan guru pada menu Data Master -> Tab Guru.",
    exampleCase:
      "Siti Aminah, M.Pd. dijadwalkan mengajar pada hari Jumat pukul 07:00 - 08:30, padahal tercatat tidak bersedia setiap Jumat pagi.",
  },
  {
    code: "ROOM_UNAVAILABLE",
    severity: "ERROR",
    title: "Ruangan Tidak Tersedia",
    cause:
      "Sesi ditempatkan pada rentang waktu ketika ruangan sedang ditutup atau dipakai kegiatan sekolah lain pada pengaturan Data Master Ruangan.",
    resolution:
      "Pindahkan sesi ke jam lain di luar waktu penutupan ruangan, atau pilih ruangan alternatif pada Panel Detail Sesi.",
    exampleCase:
      "Lab IPA digunakan pada hari Kamis pukul 13:00 - 14:30 saat jadwal pemeliharaan rutin laboratorium.",
  },
  {
    code: "OUTSIDE_OPERATING_HOURS",
    severity: "ERROR",
    title: "Sesi di Luar Jam Belajar",
    cause:
      "Jam mulai atau jam selesai sesi melewati batas jam operasional sekolah pada hari tersebut, atau ditempatkan pada hari sekolah yang dinonaktifkan.",
    resolution:
      "Geser sesi ke dalam rentang jam belajar aktif hari tersebut, atau sesuaikan Jam Mulai dan Jam Selesai harian pada menu Pengaturan Jam Belajar.",
    exampleCase:
      "Pada hari Jumat yang berakhir pukul 11:30, terdapat sesi yang berlangsung pukul 10:30 - 12:00.",
  },
  {
    code: "BREAK_TIME_OVERLAP",
    severity: "ERROR",
    title: "Sesi Beririsan dengan Waktu Istirahat",
    cause:
      "Rentang waktu mulai hingga selesai sesi memotong periode Waktu Istirahat yang ditetapkan pada hari tersebut.",
    resolution:
      "Geser jam mulai sesi agar berakhir tepat sebelum istirahat dimulai, atau mulai tepat sesudah waktu istirahat selesai.",
    exampleCase:
      "Sesi dijadwalkan pukul 09:30 - 10:30, sedangkan Waktu Istirahat Pertama berlangsung pukul 10:00 - 10:30.",
  },
  {
    code: "UNFULFILLED_REQUIREMENT",
    severity: "WARNING",
    title: "Alokasi Sesi Belum Lengkap",
    cause:
      "Jumlah sesi yang telah ditempatkan ke grid waktu masih kurang dari target sesi mingguan (sessionsPerWeek) pada daftar Kebutuhan Pembelajaran Mingguan.",
    resolution:
      "Tempatkan sisa kartu sesi dari Panel Belum Terjadwal ke kolom hari pada grid menggunakan tarik-lepas atau tombol Tempatkan ke Jadwal.",
    exampleCase:
      "Matematika Kelas VII-A membutuhkan 3 sesi per minggu, tetapi baru 2 sesi yang ditempatkan ke jadwal.",
  },
  {
    code: "OVER_SCHEDULED_SESSION",
    severity: "WARNING",
    title: "Alokasi Sesi Melebihi Kebutuhan",
    cause:
      "Jumlah sesi yang terpasang di grid melebihi target sesi mingguan yang ditentukan pada Kebutuhan Pembelajaran Mingguan.",
    resolution:
      "Pilih sesi berlebih pada grid lalu klik tombol Lepas dari Grid, atau perbarui angka target sesi mingguan di menu Data Master.",
    exampleCase:
      "Target Bahasa Indonesia dikurangi dari 3 menjadi 2 sesi per minggu ketika ke-3 sesi sudah terpasang di grid.",
  },
  {
    code: "MISSING_TEACHER",
    severity: "WARNING",
    title: "Guru Belum Ditentukan",
    cause:
      "Sesi pada grid atau data Kebutuhan Pembelajaran Mingguan belum memiliki guru pengajar yang ditugaskan.",
    resolution:
      "Klik blok sesi pada grid, lalu pilih nama Guru Pengajar pada formulir Panel Detail Sesi di sebelah kanan.",
    exampleCase:
      "Jadwal Kelas VII-B hasil penyalinan dengan strategi Kosongkan belum diisi nama guru pengajarnya.",
  },
  {
    code: "MISSING_REQUIRED_ROOM",
    severity: "WARNING",
    title: "Ruangan Khusus Belum Dipilih",
    cause:
      "Kebutuhan pembelajaran mengaktifkan opsi Wajib Ruangan Khusus (roomRequired), tetapi sesi belum memilih ruangan.",
    resolution:
      "Klik sesi terkait pada grid, kemudian pilih ruangan khusus yang sesuai (misalnya Lab IPA atau Lapangan Olahraga) di Panel Detail Sesi.",
    exampleCase:
      "Sesi praktik Ilmu Pengetahuan Alam (IPA) mewajibkan laboratorium, tetapi kolom Ruangan pada sesi masih kosong.",
  },
  {
    code: "UNCONFIGURED_CLASS",
    severity: "WARNING",
    title: "Kelas Belum Dikonfigurasi",
    cause:
      "Rombongan belajar telah ditambahkan di Tab Kelas, namun belum memiliki satu pun item Kebutuhan Pembelajaran Mingguan.",
    resolution:
      "Buka menu Data Master -> Kebutuhan Pembelajaran Mingguan, lalu tambahkan alokasi mata pelajaran untuk kelas tersebut.",
    exampleCase:
      "Operator baru saja menambahkan Kelas VII-C di daftar kelas tetapi belum mengatur mata pelajaran untuk kelas tersebut.",
  },
];

export function ConflictDictionaryExplorer({
  initialFilter = "ALL",
}: ConflictDictionaryExplorerProps): React.ReactElement {
  const [filter, setFilter] =
    React.useState<ConflictCategoryFilter>(initialFilter);
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const filteredItems = React.useMemo(() => {
    return CONFLICT_DICTIONARY_ITEMS.filter((item) => {
      if (filter !== "ALL" && item.severity !== filter) {
        return false;
      }

      if (!searchQuery.trim()) {
        return true;
      }

      const q = searchQuery.toLowerCase().trim();
      return (
        item.code.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.cause.toLowerCase().includes(q) ||
        item.resolution.toLowerCase().includes(q) ||
        item.exampleCase.toLowerCase().includes(q)
      );
    });
  }, [filter, searchQuery]);

  const handleReset = (): void => {
    setFilter("ALL");
    setSearchQuery("");
  };

  return (
    <div className="my-6 rounded-none border border-border bg-surface-subtle p-4 sm:p-5 print-avoid-break">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2.5">
        <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          PERAGA INTERAKTIF ANTARMUKA SCHEDOVYN
        </span>
        <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
          Total Terdaftar: 12 Kode
        </span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setFilter("ALL")}
            className={cn(
              "inline-flex h-8 items-center rounded-none border px-3 text-xs font-medium tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              filter === "ALL"
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-foreground hover:bg-surface-subtle"
            )}
          >
            Semua (12)
          </button>
          <button
            type="button"
            onClick={() => setFilter("ERROR")}
            className={cn(
              "inline-flex h-8 items-center rounded-none border px-3 text-xs font-medium tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              filter === "ERROR"
                ? "border-status-error-border bg-status-error-bg text-status-error-fg font-semibold"
                : "border-border bg-background text-foreground hover:bg-surface-subtle"
            )}
          >
            Bentrokan Waktu / Error (7)
          </button>
          <button
            type="button"
            onClick={() => setFilter("WARNING")}
            className={cn(
              "inline-flex h-8 items-center rounded-none border px-3 text-xs font-medium tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              filter === "WARNING"
                ? "border-status-warning-border bg-status-warning-bg text-status-warning-fg font-semibold"
                : "border-border bg-background text-foreground hover:bg-surface-subtle"
            )}
          >
            Kelengkapan / Warning (5)
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2 size-4 text-muted-foreground" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama konflik atau kode (misal: TEACHER_OVERLAP, istirahat)..."
            className="pl-8 text-xs"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 rounded-none border border-border bg-background p-8 text-center">
            <AlertCircle className="size-6 text-muted-foreground" />
            <p className="font-heading text-sm font-semibold text-foreground">
              Tidak ditemukan konflik atau peringatan untuk kata kunci &quot;{searchQuery}&quot;
            </p>
            <p className="text-xs text-muted-foreground">
              Periksa ejaan kata kunci atau ganti filter kategori di atas.
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="mt-2 inline-flex h-8 items-center gap-1.5 rounded-none border border-primary bg-primary px-3 text-xs font-medium text-primary-foreground hover:opacity-90"
            >
              <RotateCcw className="size-3.5" />
              <span>Reset Filter & Pencarian</span>
            </button>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.code}
              className="rounded-none border border-border bg-background p-4 transition-colors hover:border-primary"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold text-primary">
                    {item.code}
                  </span>
                  <span className="font-heading text-sm font-semibold text-foreground">
                    {item.title}
                  </span>
                </div>
                <Badge variant={item.severity === "ERROR" ? "error" : "warning"}>
                  {item.severity === "ERROR" ? (
                    <span className="inline-flex items-center gap-1">
                      <AlertCircle className="size-3" />
                      Error
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1">
                      <AlertTriangle className="size-3" />
                      Warning
                    </span>
                  )}
                </Badge>
              </div>

              <div className="mt-3 flex flex-col gap-2 text-xs leading-5">
                <div>
                  <span className="font-heading font-semibold text-foreground">
                    Penyebab:{" "}
                  </span>
                  <span className="text-muted-foreground">
                    {item.cause}
                  </span>
                </div>
                <div>
                  <span className="font-heading font-semibold text-foreground">
                    Langkah Penyelesaian:{" "}
                  </span>
                  <span className="text-foreground">
                    {item.resolution}
                  </span>
                </div>
                <div className="mt-1 rounded-none border border-border bg-surface-subtle p-2.5">
                  <span className="font-heading text-[11px] font-bold uppercase tracking-wider text-primary">
                    Contoh Kasus:{" "}
                  </span>
                  <span className="font-mono text-[11px] text-foreground">
                    {item.exampleCase}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
