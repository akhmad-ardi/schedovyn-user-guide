import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { PUBLIC_ENV } from "@/lib/env";
import { DOCS_MODULES, getAllDocArticles } from "@/lib/docs-registry";
import {
  extractHeadingsFromMdx,
  slugifyHeading,
  type TocHeadingItem,
} from "@/lib/mdx-loader";
import { Callout } from "@/components/docs/Callout";
import { StepItem, StepList } from "@/components/docs/StepList";
import { DocsNavbar } from "@/components/docs/DocsNavbar";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { DocsPager } from "@/components/docs/DocsPager";
import { TableOfContents } from "@/components/docs/TableOfContents";
import { ThemeProvider } from "@/components/docs/ThemeProvider";

const mockPathname = vi.fn<() => string>();

vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname(),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

describe("TASK-02: MDX Heading Extractor, Tata Letak 3 Kolom, Navigasi 6 Modul & Komponen Dokumentasi", () => {
  beforeEach(() => {
    mockPathname.mockReturnValue("/docs/01-pengenalan/mengenal-schedovyn");
  });

  describe("1. Pemuat MDX & Ekstraktor Sub-Judul (src/lib/mdx-loader.ts)", () => {
    it("mengubah teks sub-judul H2/H3 menjadi ID jangkar URL deterministik melalui slugifyHeading", () => {
      expect(slugifyHeading("2.1 Mengatur Jam Belajar & Istirahat")).toBe(
        "21-mengatur-jam-belajar-istirahat"
      );
      expect(slugifyHeading("Ringkasan Panduan")).toBe("ringkasan-panduan");
      expect(
        slugifyHeading("Menangani TEACHER_OVERLAP (Bentrokan Guru)")
      ).toBe("menangani-teacher-overlap-bentrokan-guru");
    });

    it("mengekstrak daftar H2 dan H3 secara berurutan serta mengabaikan tanda # di dalam blok kode berpagar (```)", () => {
      const sampleMdx = [
        "---",
        "title: Panduan Contoh",
        "---",
        "",
        "## Ringkasan Panduan",
        "Paragraf pembuka panduan.",
        "",
        "```bash",
        "## Ini komentar di dalam blok kode yang harus diabaikan",
        "### Sub-komentar di dalam kode",
        "```",
        "",
        "### Persiapan Data Awal",
        "Penjelasan sub-bagian.",
        "",
        "## Langkah Operasional Utama",
        "### Menyimpan & Memeriksa Status",
      ].join("\n");

      const headings = extractHeadingsFromMdx(sampleMdx);

      expect(headings).toEqual([
        {
          id: "ringkasan-panduan",
          text: "Ringkasan Panduan",
          level: 2,
        },
        {
          id: "persiapan-data-awal",
          text: "Persiapan Data Awal",
          level: 3,
        },
        {
          id: "langkah-operasional-utama",
          text: "Langkah Operasional Utama",
          level: 2,
        },
        {
          id: "menyimpan-memeriksa-status",
          text: "Menyimpan & Memeriksa Status",
          level: 3,
        },
      ]);
    });
  });

  describe("2. Bilah Navigasi Atas DocsNavbar (AC-UG-06, R-03)", () => {
    it("merender identitas Schedovyn, lencana PANDUAN, pemicu pencarian Ctrl+K, tombol ganti tema, dan CTA Buka Aplikasi Schedovyn menuju PUBLIC_ENV.APP_URL", () => {
      const handleOpenSearch = vi.fn();
      const handleOpenMobileSidebar = vi.fn();

      render(
        <ThemeProvider>
          <DocsNavbar
            onOpenSearch={handleOpenSearch}
            onOpenMobileSidebar={handleOpenMobileSidebar}
            showMobileMenuButton={true}
          />
        </ThemeProvider>
      );

      expect(screen.getByText("Schedovyn")).toBeInTheDocument();
      expect(screen.getByText("PANDUAN")).toBeInTheDocument();

      const searchButton = screen.getByRole("button", {
        name: /Cari panduan atau kode konflik/i,
      });
      expect(searchButton).toBeInTheDocument();
      fireEvent.click(searchButton);
      expect(handleOpenSearch).toHaveBeenCalledTimes(1);

      const mobileMenuButton = screen.getByRole("button", {
        name: "Buka navigasi modul",
      });
      expect(mobileMenuButton).toBeInTheDocument();
      fireEvent.click(mobileMenuButton);
      expect(handleOpenMobileSidebar).toHaveBeenCalledTimes(1);

      const themeButton = screen.getByRole("button", {
        name: "Ganti tema tampilan",
      });
      expect(themeButton).toBeInTheDocument();

      const appCtaLink = screen.getByRole("link", {
        name: /Buka Aplikasi Schedovyn/i,
      });
      expect(appCtaLink).toHaveAttribute("href", PUBLIC_ENV.APP_URL);
    });
  });

  describe("3. Navigasi Samping 6 Modul DocsSidebar (FR-UG-01, AC-UG-02)", () => {
    it("merender seluruh 6 grup modul (01 s.d. 06) dan seluruh tautan artikel tanpa broken links serta menandai artikel aktif dengan aria-current='page'", () => {
      mockPathname.mockReturnValue("/docs/01-pengenalan/mengenal-schedovyn");

      render(<DocsSidebar modules={DOCS_MODULES} />);

      for (const moduleGroup of DOCS_MODULES) {
        expect(screen.getByText(moduleGroup.title)).toBeInTheDocument();
      }

      const allArticles = getAllDocArticles();
      expect(allArticles).toHaveLength(21);

      for (const article of allArticles) {
        const links = screen.getAllByRole("link", {
          name: new RegExp(article.title, "i"),
        });
        expect(links.length).toBeGreaterThan(0);
        expect(links[0]).toHaveAttribute("href", article.href);
      }

      const activeLinks = screen
        .getAllByRole("link", {
          name: /Mengenal Schedovyn & Prinsip Kerja/i,
        })
        .filter((el) => el.getAttribute("aria-current") === "page");

      expect(activeLinks.length).toBeGreaterThan(0);
    });

    it("menandai artikel pertama pada modul ketika pathname berada di root /docs atau /docs/[moduleSlug]", () => {
      mockPathname.mockReturnValue("/docs/04-kamus-konflik-dan-validasi");

      render(<DocsSidebar modules={DOCS_MODULES} />);

      const activeLinks = screen
        .getAllByRole("link", {
          name: /Memahami 4 Status Validasi Jadwal/i,
        })
        .filter((el) => el.getAttribute("aria-current") === "page");

      expect(activeLinks.length).toBeGreaterThan(0);
    });
  });

  describe("4. Navigasi Urutan Halaman DocsPager (FR-UG-01, AC-UG-02)", () => {
    it("hanya merender tombol 'Artikel Selanjutnya' (1.2) ketika berada di artikel pertama (1.1)", () => {
      render(
        <DocsPager currentHref="/docs/01-pengenalan/mengenal-schedovyn" />
      );

      expect(
        screen.queryByText(/Artikel Sebelumnya/i)
      ).not.toBeInTheDocument();
      expect(screen.getByText(/Artikel Selanjutnya/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Panduan Mulai Cepat 10 Menit/i)
      ).toBeInTheDocument();

      const nextLink = screen.getByRole("link", {
        name: /Panduan Mulai Cepat 10 Menit/i,
      });
      expect(nextLink).toHaveAttribute(
        "href",
        "/docs/01-pengenalan/mulai-cepat-10-menit"
      );
    });

    it("merender 'Artikel Sebelumnya' (2.3) dan 'Artikel Selanjutnya' (3.2) ketika berada di artikel tengah (3.1)", () => {
      render(
        <DocsPager currentHref="/docs/03-menyusun-jadwal-editor/memilih-kelas-aktif" />
      );

      expect(screen.getByText(/Artikel Sebelumnya/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Menyusun Kebutuhan Pembelajaran Mingguan/i)
      ).toBeInTheDocument();

      expect(screen.getByText(/Artikel Selanjutnya/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Menempatkan Sesi dari Panel Belum Terjadwal/i)
      ).toBeInTheDocument();
    });

    it("hanya merender tombol 'Artikel Sebelumnya' (6.3) ketika berada di artikel terakhir (6.4)", () => {
      render(
        <DocsPager currentHref="/docs/06-penyimpanan-pwa-dan-pintasan/studi-kasus-smp-nusantara" />
      );

      expect(screen.getByText(/Artikel Sebelumnya/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Daftar Lengkap Pintasan Keyboard/i)
      ).toBeInTheDocument();
      expect(
        screen.queryByText(/Artikel Selanjutnya/i)
      ).not.toBeInTheDocument();
    });
  });

  describe("5. Daftar Isi Halaman TableOfContents (FR-UG-01)", () => {
    it("merender judul 'Di Halaman Ini' beserta tautan jangkar #id untuk sub-judul H2 dan H3", () => {
      const sampleHeadings: readonly TocHeadingItem[] = [
        {
          id: "ringkasan-panduan",
          text: "Ringkasan Panduan",
          level: 2,
        },
        {
          id: "langkah-awal",
          text: "Langkah Awal",
          level: 3,
        },
      ];

      render(<TableOfContents headings={sampleHeadings} />);

      expect(screen.getByText("Di Halaman Ini")).toBeInTheDocument();

      const h2Link = screen.getByRole("link", { name: "Ringkasan Panduan" });
      expect(h2Link).toHaveAttribute("href", "#ringkasan-panduan");

      const h3Link = screen.getByRole("link", { name: "Langkah Awal" });
      expect(h3Link).toHaveAttribute("href", "#langkah-awal");
    });
  });

  describe("6. Komponen Artikel Callout & StepList (NFR-UG-01)", () => {
    it("merender Callout dengan atribut data-callout, judul default sesuai varian, dan isi pesan bebas em dash", () => {
      const { container } = render(
        <div>
          <Callout variant="info">
            Jadwal tersimpan otomatis di peramban lokal Anda.
          </Callout>
          <Callout variant="tip">
            Gunakan fitur Salin Jadwal untuk kelas paralel.
          </Callout>
          <Callout variant="warning">
            Periksa kembali jam istirahat hari Jumat.
          </Callout>
          <Callout variant="danger" title="Bentrokan Guru Terdeteksi">
            Guru tidak dapat mengajar di dua kelas pada jam yang sama.
          </Callout>
        </div>
      );

      expect(
        container.querySelector('[data-callout="info"]')
      ).toBeInTheDocument();
      expect(screen.getByText("Catatan")).toBeInTheDocument();
      expect(screen.getByText("Tips Kurikulum")).toBeInTheDocument();
      expect(screen.getByText("Penting")).toBeInTheDocument();
      expect(screen.getByText("Bentrokan Guru Terdeteksi")).toBeInTheDocument();
      expect(container.textContent).not.toContain("\u2014");
    });

    it("merender StepList dan StepItem dengan atribut data-step-list serta nomor langkah tabular-nums", () => {
      const { container } = render(
        <StepList>
          <StepItem step={1} title="Buka Ruang Kerja Contoh">
            Pilih tombol Muat Data Contoh SMP Negeri 1 Nusantara.
          </StepItem>
          <StepItem step={2} title="Tempatkan Sesi ke Grid">
            Klik tombol Tempatkan ke Jadwal pada panel sesi belum terjadwal.
          </StepItem>
        </StepList>
      );

      expect(container.querySelector("[data-step-list]")).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(
        screen.getByText("Buka Ruang Kerja Contoh")
      ).toBeInTheDocument();
      expect(screen.getByText("Tempatkan Sesi ke Grid")).toBeInTheDocument();
    });
  });
});
