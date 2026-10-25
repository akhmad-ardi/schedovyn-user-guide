import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import {
  ValidationStatusBadgesReplica,
  VALIDATION_STATUS_ITEMS,
} from "@/components/replicas/ValidationStatusBadgesReplica";
import {
  ConflictDictionaryExplorer,
  CONFLICT_DICTIONARY_ITEMS,
} from "@/components/replicas/ConflictDictionaryExplorer";
import { SaveStatusBadgeReplica } from "@/components/replicas/SaveStatusBadgeReplica";
import { SessionBlockOverlapReplica } from "@/components/replicas/SessionBlockOverlapReplica";
import { KeyboardShortcutSwitch } from "@/components/replicas/KeyboardShortcutSwitch";
import { compileDocArticle } from "@/lib/mdx-loader";
import { getDocArticleBySlug } from "@/lib/docs-registry";

describe("TASK-03: Implementasi 5 Komponen Replika UI Interaktif Schedovyn & Integrasi MDX", () => {
  describe("1. ValidationStatusBadgesReplica (FR-UG-03, AC-UG-04, AC-UG-05)", () => {
    it("mendaftarkan 4 status validasi resmi yang bebas dari karakter em dash", () => {
      expect(VALIDATION_STATUS_ITEMS).toHaveLength(4);

      const codes = VALIDATION_STATUS_ITEMS.map((item) => item.code);
      expect(codes).toEqual([
        "CONFLICT_DETECTED",
        "INCOMPLETE",
        "NO_CONFLICT_CURRENT_DATA",
        "COMPLETE_AND_VALID",
      ]);

      const labels = VALIDATION_STATUS_ITEMS.map((item) => item.label);
      expect(labels).toEqual([
        "Konflik ditemukan",
        "Belum lengkap",
        "Tidak ada konflik pada data saat ini",
        "Jadwal lengkap dan valid",
      ]);

      // Bebas em dash
      for (const item of VALIDATION_STATUS_ITEMS) {
        expect(item.label).not.toContain("\u2014");
        expect(item.activeClassCondition).not.toContain("\u2014");
        expect(item.workspaceCondition).not.toContain("\u2014");
        expect(item.summary).not.toContain("\u2014");
        expect(item.schoolExample).not.toContain("\u2014");
        expect(item.recommendedAction).not.toContain("\u2014");
      }
    });

    it("merender ke-4 lencana dan merespons interaksi pergantian status dengan menampilkan rincian kondisi serta contoh sekolah", () => {
      render(
        <ValidationStatusBadgesReplica initialStatus="CONFLICT_DETECTED" />
      );

      // Pastikan bingkai peraga teknis Schedovyn tampil
      expect(
        screen.getByText(/PERAGA INTERAKTIF ANTARMUKA SCHEDOVYN/i)
      ).toBeInTheDocument();

      // Status default CONFLICT_DETECTED
      expect(screen.getByText("CONFLICT_DETECTED")).toBeInTheDocument();
      expect(screen.getByText(/Budi Santoso, S\.Pd\./i)).toBeInTheDocument();
      expect(screen.getByText(/Lepas dari Grid/i)).toBeInTheDocument();

      // Klik lencana "Belum lengkap"
      fireEvent.click(
        screen.getByRole("button", { name: /Belum lengkap/i })
      );
      expect(screen.getByText("INCOMPLETE")).toBeInTheDocument();
      expect(screen.getByText(/Tempatkan ke Jadwal/i)).toBeInTheDocument();

      // Klik lencana "Tidak ada konflik pada data saat ini"
      fireEvent.click(
        screen.getByRole("button", {
          name: /Tidak ada konflik pada data saat ini/i,
        })
      );
      expect(screen.getByText("NO_CONFLICT_CURRENT_DATA")).toBeInTheDocument();
      expect(screen.getByText(/Salin Jadwal/i)).toBeInTheDocument();

      // Klik lencana "Jadwal lengkap dan valid"
      fireEvent.click(
        screen.getByRole("button", { name: /Jadwal lengkap dan valid/i })
      );
      expect(screen.getByText("COMPLETE_AND_VALID")).toBeInTheDocument();
      expect(screen.getByText(/Ekspor PDF Landscape/i)).toBeInTheDocument();
    });
  });

  describe("2. ConflictDictionaryExplorer (FR-UG-04, AC-UG-04, R-27)", () => {
    it("mendaftarkan 12 item kamus resmi (7 Error + 5 Warning) bebas dari karakter em dash", () => {
      expect(CONFLICT_DICTIONARY_ITEMS).toHaveLength(12);

      const errors = CONFLICT_DICTIONARY_ITEMS.filter(
        (i) => i.severity === "ERROR"
      );
      const warnings = CONFLICT_DICTIONARY_ITEMS.filter(
        (i) => i.severity === "WARNING"
      );

      expect(errors).toHaveLength(7);
      expect(warnings).toHaveLength(5);

      const errorCodes = errors.map((i) => i.code);
      expect(errorCodes).toEqual([
        "CLASS_OVERLAP",
        "TEACHER_OVERLAP",
        "ROOM_OVERLAP",
        "TEACHER_UNAVAILABLE",
        "ROOM_UNAVAILABLE",
        "OUTSIDE_OPERATING_HOURS",
        "BREAK_TIME_OVERLAP",
      ]);

      const warningCodes = warnings.map((i) => i.code);
      expect(warningCodes).toEqual([
        "UNFULFILLED_REQUIREMENT",
        "OVER_SCHEDULED_SESSION",
        "MISSING_TEACHER",
        "MISSING_REQUIRED_ROOM",
        "UNCONFIGURED_CLASS",
      ]);

      // Bebas em dash
      for (const item of CONFLICT_DICTIONARY_ITEMS) {
        expect(item.title).not.toContain("\u2014");
        expect(item.cause).not.toContain("\u2014");
        expect(item.resolution).not.toContain("\u2014");
        expect(item.exampleCase).not.toContain("\u2014");
      }
    });

    it("memfilter item berdasarkan kategori (Semua, Bentrokan Waktu / Error, Kelengkapan / Warning)", () => {
      render(<ConflictDictionaryExplorer initialFilter="ALL" />);

      // Awalnya menampilkan semua 12 item
      expect(screen.getByText("CLASS_OVERLAP")).toBeInTheDocument();
      expect(screen.getByText("UNCONFIGURED_CLASS")).toBeInTheDocument();

      // Filter hanya ERROR
      fireEvent.click(
        screen.getByRole("button", {
          name: /Bentrokan Waktu \/ Error/i,
        })
      );
      expect(screen.getByText("CLASS_OVERLAP")).toBeInTheDocument();
      expect(screen.getByText("TEACHER_OVERLAP")).toBeInTheDocument();
      expect(screen.queryByText("UNCONFIGURED_CLASS")).not.toBeInTheDocument();
      expect(screen.queryByText("MISSING_TEACHER")).not.toBeInTheDocument();

      // Filter hanya WARNING
      fireEvent.click(
        screen.getByRole("button", {
          name: /Kelengkapan \/ Warning/i,
        })
      );
      expect(screen.queryByText("CLASS_OVERLAP")).not.toBeInTheDocument();
      expect(screen.queryByText("TEACHER_OVERLAP")).not.toBeInTheDocument();
      expect(screen.getByText("UNCONFIGURED_CLASS")).toBeInTheDocument();
      expect(screen.getByText("MISSING_TEACHER")).toBeInTheDocument();
    });

    it("menyaring item secara real-time via input pencarian dan merender empty state jika tidak cocok", () => {
      render(<ConflictDictionaryExplorer initialFilter="ALL" />);

      const searchInput = screen.getByPlaceholderText(
        /Cari nama konflik atau kode/i
      );

      // Cari "TEACHER_OVERLAP"
      fireEvent.change(searchInput, { target: { value: "TEACHER_OVERLAP" } });
      expect(screen.getByText("TEACHER_OVERLAP")).toBeInTheDocument();
      expect(screen.queryByText("CLASS_OVERLAP")).not.toBeInTheDocument();

      // Cari kata kunci "istirahat"
      fireEvent.change(searchInput, { target: { value: "istirahat" } });
      expect(screen.getByText("BREAK_TIME_OVERLAP")).toBeInTheDocument();
      expect(screen.queryByText("TEACHER_OVERLAP")).not.toBeInTheDocument();

      // Cari kata kunci tidak ada
      fireEvent.change(searchInput, { target: { value: "tidakadakonflikxyz" } });
      expect(
        screen.getByText(/Tidak ditemukan konflik atau peringatan untuk kata kunci/i)
      ).toBeInTheDocument();

      // Tombol Reset
      const resetButton = screen.getByRole("button", {
        name: /Reset Filter & Pencarian/i,
      });
      fireEvent.click(resetButton);
      expect(screen.getByText("CLASS_OVERLAP")).toBeInTheDocument();
    });
  });

  describe("3. SaveStatusBadgeReplica (FR-UG-03, AC-UG-05)", () => {
    it("menampilkan 3 status penyimpanan otomatis lokal yang akurat dan rincian kuota IndexedDB", () => {
      render(<SaveStatusBadgeReplica initialState="saved" />);

      // State default 'saved' -> "Tersimpan di browser"
      expect(screen.getByText("Tersimpan di browser")).toBeInTheDocument();
      expect(screen.getByText(/IndexedDB \(schedovyn_local_db\)/i)).toBeInTheDocument();
      expect(screen.getByText(/1,4 MB terpakai dari 1\.024 MB/i)).toBeInTheDocument();

      // Ganti state ke "Menyimpan..."
      fireEvent.click(screen.getByRole("button", { name: "Menyimpan..." }));
      expect(screen.getByText("Menyimpan...")).toBeInTheDocument();
      expect(
        screen.getByText(/Sedang menulis transaksi sesi ke database lokal/i)
      ).toBeInTheDocument();

      // Ganti state ke "Gagal menyimpan lokal"
      fireEvent.click(
        screen.getByRole("button", { name: "Gagal menyimpan lokal" })
      );
      expect(screen.getByText("Gagal menyimpan lokal")).toBeInTheDocument();
      expect(
        screen.getByText(/Ruang Penyimpanan Browser Penuh/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Akses Penyimpanan Dibatasi/i)
      ).toBeInTheDocument();
    });
  });

  describe("4. SessionBlockOverlapReplica (FR-UG-03, AC-UG-05)", () => {
    it("memperagakan overlap cluster (CLASS_OVERLAP), simulasi 'Lepas dari Grid', dan penjadwalan berurutan bebas konflik", () => {
      render(<SessionBlockOverlapReplica initialMode="overlap" />);

      // Mode 1: Overlap Cluster
      expect(screen.getByText("CLASS_OVERLAP")).toBeInTheDocument();
      expect(screen.getByText("Konflik ditemukan")).toBeInTheDocument();
      expect(screen.getByText("Matematika")).toBeInTheDocument();
      expect(screen.getByText("Ilmu Pengetahuan Alam (IPA)")).toBeInTheDocument();

      // Klik Lepas dari Grid
      const lepasButton = screen.getByRole("button", {
        name: /Lepas dari Grid/i,
      });
      fireEvent.click(lepasButton);

      // Berpindah ke mode unscheduled_removed
      expect(screen.getByText(/Belum Terjadwal/i)).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Tempatkan ke Jadwal/i })
      ).toBeInTheDocument();
      expect(screen.queryByText("CLASS_OVERLAP")).not.toBeInTheDocument();

      // Klik tombol jadwal berurutan (07:30 - 09:00 & 09:00 - 10:30)
      const sequentialButton = screen.getByRole("button", {
        name: /Susun Berurutan/i,
      });
      fireEvent.click(sequentialButton);
      expect(screen.getByText(/07:30 - 09:00/i)).toBeInTheDocument();
      expect(screen.getByText(/09:00 - 10:30/i)).toBeInTheDocument();
      expect(screen.queryByText("CLASS_OVERLAP")).not.toBeInTheDocument();
    });
  });

  describe("5. KeyboardShortcutSwitch (FR-UG-04, AC-UG-05)", () => {
    it("menampilkan pintasan Windows / Linux secara default dan beralih ke macOS secara reaktif", () => {
      render(<KeyboardShortcutSwitch initialPlatform="windows-linux" />);

      // Platform default Windows / Linux
      expect(screen.getByText("Batal Perubahan")).toBeInTheDocument();
      expect(screen.getByText("Ulangi Perubahan")).toBeInTheDocument();
      expect(screen.getByText("Lepas dari Grid")).toBeInTheDocument();
      expect(screen.getByText("Ctrl")).toBeInTheDocument();
      expect(screen.getByText("Z")).toBeInTheDocument();

      // Beralih ke macOS
      fireEvent.click(screen.getByRole("button", { name: "macOS" }));
      expect(screen.getByText("Cmd")).toBeInTheDocument();
      expect(screen.getByText("Option")).toBeInTheDocument();
      expect(screen.queryByText("Ctrl")).not.toBeInTheDocument();
    });
  });

  describe("6. Integrasi MDX Komponen Replika (compileDocArticle)", () => {
    it("berhasil mengompilasi artikel panduan 4.1 dan 4.2 yang memuat replika status dan replika kamus konflik", async () => {
      const meta41 = getDocArticleBySlug([
        "04-kamus-konflik-dan-validasi",
        "empat-status-validasi",
      ]);
      expect(meta41).not.toBeNull();
      if (!meta41) return;

      const compiled41 = await compileDocArticle(meta41);
      expect(compiled41.headings.length).toBeGreaterThan(0);
      expect(compiled41.content).toBeDefined();

      const meta42 = getDocArticleBySlug([
        "04-kamus-konflik-dan-validasi",
        "kamus-tujuh-konflik-waktu",
      ]);
      expect(meta42).not.toBeNull();
      if (!meta42) return;

      const compiled42 = await compileDocArticle(meta42);
      expect(compiled42.headings.length).toBeGreaterThan(0);
      expect(compiled42.content).toBeDefined();
    });
  });
});
