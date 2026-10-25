import fs from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { getAllDocArticles } from "@/lib/docs-registry";
import { compileDocArticle } from "@/lib/mdx-loader";

const REQUIRED_REPLICA_BINDINGS: Record<string, string> = {
  "01-pengenalan/mengenal-schedovyn.mdx": "<ValidationStatusBadgesReplica",
  "01-pengenalan/tata-letak-aplikasi.mdx": "<SaveStatusBadgeReplica",
  "03-menyusun-jadwal-editor/menyunting-dan-memindahkan-sesi.mdx":
    "<SessionBlockOverlapReplica",
  "04-kamus-konflik-dan-validasi/empat-status-validasi.mdx":
    "<ValidationStatusBadgesReplica",
  "04-kamus-konflik-dan-validasi/kamus-tujuh-konflik-waktu.mdx":
    "<ConflictDictionaryExplorer",
  "04-kamus-konflik-dan-validasi/kamus-lima-peringatan-kelengkapan.mdx":
    "<ConflictDictionaryExplorer",
  "06-penyimpanan-pwa-dan-pintasan/penyimpanan-otomatis-indexeddb.mdx":
    "<SaveStatusBadgeReplica",
  "06-penyimpanan-pwa-dan-pintasan/daftar-pintasan-keyboard.mdx":
    "<KeyboardShortcutSwitch",
  "06-penyimpanan-pwa-dan-pintasan/studi-kasus-smp-nusantara.mdx":
    "<ValidationStatusBadgesReplica",
};

describe("TASK-04: Integritas Konten 21 Berkas MDX, Studi Kasus SMP Nusantara & Kepatuhan Standar", () => {
  const allArticles = getAllDocArticles();

  it("mendaftarkan 21 artikel panduan resmi di dalam docs-registry", () => {
    expect(allArticles.length).toBe(21);
  });

  it("memastikan seluruh 21 berkas .mdx fisik benar-benar ada di disk dan bukan berkas kosong (AC-UG-01, AC-UG-02)", async () => {
    for (const article of allArticles) {
      const fullPath = path.join(
        process.cwd(),
        "src/content/docs",
        article.filePath
      );

      const stat = await fs.stat(fullPath);
      expect(
        stat.isFile(),
        `Berkas MDX tidak ditemukan di: ${article.filePath}`
      ).toBe(true);

      const content = await fs.readFile(fullPath, "utf-8");
      expect(
        content.trim().length,
        `Berkas MDX kosong: ${article.filePath}`
      ).toBeGreaterThan(100);

      expect(content).toMatch(/^---\r?\n[\s\S]*?\r?\n---/);
      expect(content).toContain(`title: "${article.title}"`);
      expect(content).toContain(`order: "${article.order}"`);
    }
  });

  it("memastikan 0 karakter em dash (\\u2014) di seluruh 21 berkas MDX (NFR-UG-01, R-02)", async () => {
    const emDashErrors: string[] = [];

    for (const article of allArticles) {
      const fullPath = path.join(
        process.cwd(),
        "src/content/docs",
        article.filePath
      );

      try {
        const content = await fs.readFile(fullPath, "utf-8");
        const lines = content.split(/\r?\n/);

        lines.forEach((line, index) => {
          if (line.includes("\u2014")) {
            emDashErrors.push(
              `${article.filePath}:${index + 1} memuat karakter em dash: "${line}"`
            );
          }
        });
      } catch {
        emDashErrors.push(`Gagal membaca berkas: ${article.filePath}`);
      }
    }

    expect(
      emDashErrors,
      `Ditemukan karakter em dash di berkas MDX:\n${emDashErrors.join("\n")}`
    ).toHaveLength(0);
  });

  it("memastikan penyematan komponen replika UI pada artikel kunci sesuai tabel TDD Bab 2.2 (FR-UG-03, FR-UG-04)", async () => {
    for (const [filePath, replicaSnippet] of Object.entries(
      REQUIRED_REPLICA_BINDINGS
    )) {
      const fullPath = path.join(process.cwd(), "src/content/docs", filePath);
      const content = await fs.readFile(fullPath, "utf-8");

      expect(
        content,
        `Berkas ${filePath} harus menyematkan komponen replika: ${replicaSnippet}`
      ).toContain(replicaSnippet);
    }
  });

  it("memastikan artikel studi kasus SMP Negeri 1 Nusantara memuat alur terpadu lengkap (FR-UG-05)", async () => {
    const caseStudyPath = path.join(
      process.cwd(),
      "src/content/docs/06-penyimpanan-pwa-dan-pintasan/studi-kasus-smp-nusantara.mdx"
    );

    const content = await fs.readFile(caseStudyPath, "utf-8");

    // Kelas paralel
    expect(content).toContain("Kelas VII-A");
    expect(content).toContain("Kelas VII-B");

    // Guru bersama & Ruang Khusus
    expect(content).toContain("Budi Santoso, S.Pd.");
    expect(content).toContain("Siti Aminah, M.Pd.");
    expect(content).toContain("Lab IPA");

    // Konflik & Aksi
    expect(content).toContain("TEACHER_OVERLAP");
    expect(content).toContain("ROOM_OVERLAP");
    expect(content).toContain("Salin Jadwal");
    expect(content).toContain("Lepas dari Grid");
    expect(content).toContain("Jadwal lengkap dan valid");

    // Komponen
    expect(content).toContain("<StepList>");
    expect(content).toContain(
      '<ValidationStatusBadgesReplica initialStatus="COMPLETE_AND_VALID"'
    );
  });

  it("memverifikasi akurasi istilah resmi antarmuka Schedovyn di seluruh panduan (AC-UG-05)", async () => {
    const termMap: Record<string, string> = {
      "01-pengenalan/tata-letak-aplikasi.mdx": "Tersimpan di browser",
      "03-menyusun-jadwal-editor/menempatkan-sesi-belum-terjadwal.mdx":
        "Tempatkan ke Jadwal",
      "03-menyusun-jadwal-editor/menyunting-dan-memindahkan-sesi.mdx":
        "Lepas dari Grid",
      "03-menyusun-jadwal-editor/riwayat-undo-dan-redo.mdx": "Batal Perubahan",
      "03-menyusun-jadwal-editor/menyalin-jadwal-antar-kelas.mdx":
        "Salin Jadwal",
      "06-penyimpanan-pwa-dan-pintasan/penyimpanan-otomatis-indexeddb.mdx":
        "Gagal menyimpan lokal",
      "06-penyimpanan-pwa-dan-pintasan/pasang-aplikasi-pwa-offline.mdx":
        "Pasang Aplikasi",
    };

    for (const [filePath, expectedTerm] of Object.entries(termMap)) {
      const fullPath = path.join(process.cwd(), "src/content/docs", filePath);
      const content = await fs.readFile(fullPath, "utf-8");
      expect(
        content,
        `Berkas ${filePath} wajib memuat istilah resmi "${expectedTerm}"`
      ).toContain(expectedTerm);
    }
  });

  it("memastikan seluruh 21 berkas MDX berhasil dikompilasi oleh compileDocArticle dengan minimal 2 sub-judul H2 (AC-UG-01, NFR-UG-02)", async () => {
    for (const article of allArticles) {
      const compiled = await compileDocArticle(article);

      expect(
        compiled.headings.length,
        `Artikel ${article.filePath} harus memiliki sub-judul untuk TOC`
      ).toBeGreaterThanOrEqual(2);

      const h2Headings = compiled.headings.filter((h) => h.level === 2);
      expect(
        h2Headings.length,
        `Artikel ${article.filePath} minimal harus memiliki satu H2`
      ).toBeGreaterThanOrEqual(1);

      expect(compiled.content).toBeDefined();
    }
  });
});
