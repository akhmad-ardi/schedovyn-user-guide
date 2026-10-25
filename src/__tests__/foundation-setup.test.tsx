import * as React from "react";
import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { useTheme } from "next-themes";
import { PUBLIC_ENV } from "@/lib/env";
import {
  DOCS_MODULES,
  getAdjacentArticles,
  getAllDocArticles,
  getDocArticleBySlug,
} from "@/lib/docs-registry";
import {
  searchDocsGroupedByModule,
  searchDocsSections,
  type SearchableDocSection,
} from "@/lib/search-engine";
import { ThemeProvider } from "@/components/docs/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

function ThemeInspector(): React.ReactElement {
  const { theme, resolvedTheme } = useTheme();
  return (
    <div>
      <span data-testid="active-theme">{resolvedTheme ?? theme}</span>
      <input data-testid="text-input" type="text" placeholder="Ketik..." />
    </div>
  );
}

describe("TASK-01 Foundation Setup: Environment, Registry, Search, Theme & UI Primitives", () => {
  it("menyediakan konfigurasi PUBLIC_ENV untuk APP_URL dan LANDING_URL (AC-UG-06)", () => {
    expect(PUBLIC_ENV.APP_URL).toBeTruthy();
    expect(PUBLIC_ENV.APP_URL).toContain("http");
    expect(PUBLIC_ENV.LANDING_URL).toBeTruthy();
    expect(PUBLIC_ENV.LANDING_URL).toContain("http");
  });

  it("mendaftarkan 6 modul dokumentasi secara berurutan tanpa tautan kosong dan bebas karakter em dash (AC-UG-02, NFR-UG-01)", () => {
    expect(DOCS_MODULES).toHaveLength(6);
    expect(DOCS_MODULES.map((m) => m.moduleNumber)).toEqual([
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
    ]);

    const articles = getAllDocArticles();
    expect(articles.length).toBeGreaterThanOrEqual(20);

    for (const moduleGroup of DOCS_MODULES) {
      expect(moduleGroup.title).not.toContain("\u2014");
      expect(moduleGroup.description).not.toContain("\u2014");
      expect(moduleGroup.articles.length).toBeGreaterThan(0);
    }

    for (const article of articles) {
      expect(article.title).not.toContain("\u2014");
      expect(article.description).not.toContain("\u2014");
      expect(article.href).toMatch(/^\/docs\/[a-z0-9-]+\/[a-z0-9-]+$/);
      expect(article.filePath).toMatch(/^[a-z0-9-]+\/[a-z0-9-]+\.mdx$/);
    }
  });

  it("mengembalikan urutan prev dan next yang akurat pada getAdjacentArticles dan resolusi getDocArticleBySlug", () => {
    const articles = getAllDocArticles();
    const first = articles[0];
    const second = articles[1];
    const last = articles[articles.length - 1];

    expect(first).toBeDefined();
    expect(second).toBeDefined();
    expect(last).toBeDefined();

    if (!first || !second || !last) {
      return;
    }

    const firstAdj = getAdjacentArticles(first.href);
    expect(firstAdj.prev).toBeNull();
    expect(firstAdj.next?.href).toBe(second.href);

    const secondAdj = getAdjacentArticles(second.href);
    expect(secondAdj.prev?.href).toBe(first.href);

    const lastAdj = getAdjacentArticles(last.href);
    expect(lastAdj.next).toBeNull();
    expect(lastAdj.prev).not.toBeNull();

    expect(getDocArticleBySlug([])?.href).toBe(first.href);
    expect(
      getDocArticleBySlug([second.moduleSlug, second.articleSlug])?.href
    ).toBe(second.href);
  });

  it("mengindeks dan mencari artikel serta mengelompokkan hasil per modul pada search-engine.ts (FR-UG-02, AC-UG-03)", () => {
    const sampleSections: readonly SearchableDocSection[] = [
      {
        id: "/docs/02-ruang-kerja-dan-data-master/pengaturan-jam-belajar#istirahat-jumat",
        articleTitle: "Mengatur Identitas Sekolah & Jam Belajar",
        sectionHeading: "Mengatur Jam Istirahat Hari Jumat",
        moduleNumber: "02",
        moduleTitle: "Persiapan Ruang Kerja & Data Master",
        href: "/docs/02-ruang-kerja-dan-data-master/pengaturan-jam-belajar#istirahat-jumat",
        keywords: ["istirahat", "hari Jumat", "07:00 - 11:30"],
        content:
          "Atur jam mulai 07:00 dan jam selesai 11:30 untuk hari Jumat beserta periode waktu istirahat.",
      },
      {
        id: "/docs/04-kamus-konflik-dan-validasi/kamus-tujuh-konflik-waktu#teacher-overlap",
        articleTitle: "Kamus 7 Jenis Bentrokan Waktu (Error)",
        sectionHeading: "TEACHER_OVERLAP: Bentrokan Jadwal Guru",
        moduleNumber: "04",
        moduleTitle: "Kamus Konflik & Ringkasan Validasi",
        href: "/docs/04-kamus-konflik-dan-validasi/kamus-tujuh-konflik-waktu#teacher-overlap",
        keywords: ["TEACHER_OVERLAP", "konflik guru"],
        content:
          "Terjadi ketika satu guru dijadwalkan mengajar di dua kelas berbeda pada jam yang beririsan.",
      },
    ];

    const results = searchDocsSections("istirahat", sampleSections);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]?.href).toContain("pengaturan-jam-belajar");

    const grouped = searchDocsGroupedByModule(
      "TEACHER_OVERLAP",
      sampleSections
    );
    expect(grouped).toHaveLength(1);
    expect(grouped[0]?.moduleNumber).toBe("04");
    expect(grouped[0]?.items[0]?.sectionHeading).toContain("TEACHER_OVERLAP");

    const defaultResults = searchDocsGroupedByModule("excel");
    expect(defaultResults.length).toBeGreaterThan(0);
  });

  it("mengganti tema aktif saat tombol D ditekan di luar elemen input (Skenario 3)", () => {
    render(
      <ThemeProvider defaultTheme="light" enableSystem={false}>
        <ThemeInspector />
      </ThemeProvider>
    );

    const activeTheme = screen.getByTestId("active-theme");
    expect(activeTheme.textContent).toBe("light");

    fireEvent.keyDown(window, { key: "D" });
    expect(activeTheme.textContent).toBe("dark");

    const input = screen.getByTestId("text-input");
    fireEvent.keyDown(input, { key: "d" });
    expect(activeTheme.textContent).toBe("dark");

    fireEvent.keyDown(window, { key: "d" });
    expect(activeTheme.textContent).toBe("light");
  });

  it("merender primitif UI radix-lyra dengan sudut tajam rounded-none, tinggi h-8, dan tabular-nums (NFR-UG-01)", () => {
    render(
      <div>
        <Button data-testid="btn">Buka Aplikasi Schedovyn</Button>
        <Badge data-testid="badge" variant="valid">
          Jadwal lengkap dan valid
        </Badge>
        <Input data-testid="inp" placeholder="Cari panduan..." />
      </div>
    );

    expect(screen.getByTestId("btn").className).toContain("rounded-none");
    expect(screen.getByTestId("btn").className).toContain("h-8");
    expect(screen.getByTestId("badge").className).toContain("rounded-none");
    expect(screen.getByTestId("badge").className).toContain("tabular-nums");
    expect(screen.getByTestId("inp").className).toContain("rounded-none");
    expect(screen.getByTestId("inp").className).toContain("h-8");
  });
});
