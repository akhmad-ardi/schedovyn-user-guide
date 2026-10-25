# TASK-01: Instalasi & Setup Fondasi Proyek Schedovyn User Guide

| Informasi Task | Detail |
|---|---|
| **ID Task** | `TASK-01` |
| **Judul Task** | Instalasi Dependensi, Setup Desain `radix-lyra`, Struktur 6 Modul, & Infrastruktur Pengujian |
| **Pelaksana Utama** | **Frontend Engineer** (`.agents/agents/frontend-engineer/agent.md`) |
| **Kolaborator Verifikasi** | **QA Engineer** (`.agents/agents/qa-engineer/agent.md`) |
| **Dokumen Acuan** | [docs/Schedovyn-User-Guide-PRD.md](../Schedovyn-User-Guide-PRD.md), [DESIGN.md](../../DESIGN.md), [AGENTS.md](../../AGENTS.md) |
| **Cakupan Persyaratan** | `FR-UG-01`..`FR-UG-04` (Fondasi), `NFR-UG-01`, `NFR-UG-02`, `NFR-UG-03`, `AC-UG-01`, `AC-UG-06` |

---

## 1. Konteks & Tujuan Fitur

### 1.1 Hasil Telusur Kondisi Awal Repositori
Berdasarkan pemeriksaan struktur awal proyek:
- Repositori saat ini masih berupa kerangka awal (*starter*) **Next.js 16.4.3** + **React 19.3.0** + **Tailwind CSS v4** (`@tailwindcss/turbopack`) dengan `packageManager: "bun@1.4.0"`.
- Pustaka wajib untuk merender MDX (`next-mdx-remote`, `gray-matter`, `remark-gfm`), pencarian instan *client-side* (`minisearch`, `cmdk`), pengelolaan tema (`next-themes`), ikon (`lucide-react`), utilitas komponen `shadcn/ui` (`clsx`, `tailwind-merge`, `class-variance-authority`, `radix-ui`), serta kerangka pengujian (`vitest`, `@testing-library/react`, `jsdom`) **belum terpasang**.
- `src/app/layout.tsx` dan `src/app/globals.css` masih menggunakan font bawaan `Geist` dan belum menerapkan token warna OKLCH `radix-lyra`, font `Figtree Variable` & `Inter Variable`, pintasan tema `D`, maupun aturan cetak `@media print`.
- Struktur direktori `src/components/ui/`, `src/components/docs/`, `src/components/replicas/`, `src/lib/`, `src/content/docs/` (6 modul), dan `src/__tests__/` belum tersedia.

### 1.2 Referensi Persyaratan PRD & DESIGN.md
- **PRD Bab 3.1 & 3.2:** Spesifikasi Tech Stack wajib (Bun, Next.js App Router, React 19 RSC + Client Components, MDX, Tailwind CSS v4 `radix-lyra`, shadcn/ui, FlexSearch/MiniSearch + `cmdk`, `next-themes`, Vitest + RTL) dan struktur direktori proyek.
- **PRD Bab 3.3 & `AC-UG-06`:** Konfigurasi `NEXT_PUBLIC_APP_URL` dan `NEXT_PUBLIC_LANDING_URL` untuk akses langsung menuju aplikasi utama Schedovyn dan halaman Landing Page.
- **`NFR-UG-01` & `DESIGN.md`:** Konsistensi desain `radix-lyra` (sudut tajam `rounded-none`, garis batas `1px`, tinggi kontrol `h-8`, aksen Indigo-Blue `#1547E6`, tipografi `Figtree Variable` + `Inter Variable` + `JetBrains Mono`, angka `tabular-nums`, dan bebas karakter *em dash*).
- **`NFR-UG-03`:** Aturan CSS `@media print` untuk menyembunyikan elemen navigasi saat halaman dicetak (`Ctrl+P`).
- **`AC-UG-01`:** Proyek berhasil dikompilasi menggunakan `bun run build` dengan `0` error TypeScript.

### 1.3 Tujuan & Batasan Ruang Lingkup
Task ini menyiapkan seluruh fondasi teknis, sistem desain, primitif UI, kontrak tipe TypeScript (`docs-registry.ts`, `search-engine.ts`, `env.ts`), struktur folder 6 modul dokumentasi, serta konfigurasi pengujian `Vitest` sehingga pengembangan fitur navigasi, pencarian, replika interaktif, dan penulisan 20 artikel MDX pada task berikutnya dapat langsung berjalan di atas fondasi yang teruji.

---

## 2. Kontrak Data & Arsitektur Teknis (Next.js App Router)

### 2.1 Kontrak Environment Variables (`src/lib/env.ts`)
```ts
export interface PublicEnvConfig {
  readonly APP_URL: string;
  readonly LANDING_URL: string;
}

export const PUBLIC_ENV: PublicEnvConfig = {
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || "https://app.schedovyn.com",
  LANDING_URL: process.env.NEXT_PUBLIC_LANDING_URL || "https://schedovyn.com",
};
```

### 2.2 Kontrak Tipe Registry Dokumentasi 6 Modul (`src/lib/docs-registry.ts`)
Seluruh metadata modul dan urutan halaman didefinisikan dengan tipe ketat (Zero `any` Policy) dan mencerminkan ke-6 Modul serta 20 artikel pada PRD Bab 3.2 & Bab 4:

```ts
export type ModuleNumber = "01" | "02" | "03" | "04" | "05" | "06";

export interface DocArticleMeta {
  /** Nomor urut bab dalam format tabular-nums, contoh: "1.1", "4.2" */
  readonly order: string;
  /** Judul lengkap artikel dalam Bahasa Indonesia (tanpa em dash) */
  readonly title: string;
  /** Ringkasan singkat artikel untuk kartu modul, SEO, dan cuplikan pencarian */
  readonly description: string;
  /** Nomor modul dua digit: "01" s.d. "06" */
  readonly moduleNumber: ModuleNumber;
  /** Slug folder modul, contoh: "01-pengenalan" */
  readonly moduleSlug: string;
  /** Nama modul, contoh: "Pengenalan & Mulai Cepat" */
  readonly moduleTitle: string;
  /** Slug berkas MDX tanpa ekstensi, contoh: "mengenal-schedovyn" */
  readonly articleSlug: string;
  /** Path rute penuh, contoh: "/docs/01-pengenalan/mengenal-schedovyn" */
  readonly href: string;
  /** Path relatif di dalam src/content/docs/, contoh: "01-pengenalan/mengenal-schedovyn.mdx" */
  readonly filePath: string;
}

export interface DocModuleGroup {
  readonly moduleNumber: ModuleNumber;
  readonly moduleSlug: string;
  readonly title: string;
  readonly description: string;
  readonly articles: readonly DocArticleMeta[];
}

export interface AdjacentArticles {
  readonly prev: DocArticleMeta | null;
  readonly next: DocArticleMeta | null;
}
```

Fungsi pembantu yang wajib diekspor dari `src/lib/docs-registry.ts`:
- `DOCS_MODULES: readonly DocModuleGroup[]`: Daftar hierarkis 6 modul beserta 20 artikelnya.
- ` getAllDocArticles(): readonly DocArticleMeta[]`: Mengembalikan urutan linier seluruh 20 artikel untuk `generateStaticParams` dan `DocsPager`.
- `getDocArticleBySlug(slugParts: readonly string[]): DocArticleMeta | null`: Mencocokkan parameter rute `/docs/[[...slug]]` (jika `slugParts` kosong `/docs`, arahkan atau kembalikan artikel pertama `01-pengenalan/mengenal-schedovyn`).
- `getAdjacentArticles(currentHref: string): AdjacentArticles`: Mengembalikan artikel sebelumnya (`prev`) dan selanjutnya (`next`) secara akurat.

### 2.3 Kontrak Tipe Mesin Pencarian Client-Side (`src/lib/search-engine.ts`)
```ts
import type { ModuleNumber } from "./docs-registry";

export interface SearchableDocSection {
  /** ID unik dokumen indeks, contoh: "/docs/04-kamus-konflik-dan-validasi/kamus-tujuh-konflik-waktu#teacher-overlap" */
  readonly id: string;
  readonly articleTitle: string;
  readonly sectionHeading: string;
  readonly moduleNumber: ModuleNumber;
  readonly moduleTitle: string;
  readonly href: string;
  /** Kata kunci tambahan termasuk kode konflik seperti TEACHER_OVERLAP, COMPLETE_AND_VALID */
  readonly keywords: readonly string[];
  /** Teks bersih untuk pengindeksan & cuplikan konteks */
  readonly content: string;
}

export interface SearchResultItem {
  readonly id: string;
  readonly articleTitle: string;
  readonly sectionHeading: string;
  readonly moduleNumber: ModuleNumber;
  readonly moduleTitle: string;
  readonly href: string;
  readonly excerpt: string;
  readonly score: number;
}

export interface SearchResultModuleGroup {
  readonly moduleNumber: ModuleNumber;
  readonly moduleTitle: string;
  readonly items: readonly SearchResultItem[];
}
```

### 2.4 Pemetaan Server Components vs Client Components
- **Server Components (Default):**
  - `src/app/layout.tsx` (memuat variabel font `Figtree`, `Inter`, dan `JetBrains_Mono`).
  - `src/app/page.tsx` (Halaman Beranda Portal Panduan).
  - `src/app/docs/layout.tsx` & `src/app/docs/[[...slug]]/page.tsx` (pemuat artikel MDX statis).
- **Client Components (`"use client"`):**
  - `src/components/docs/ThemeProvider.tsx` (pengelola tema `next-themes` + *listener* tombol pintasan keyboard `D`).
  - Primitif interaktif di `src/components/ui/` (`dialog.tsx`, `tabs.tsx`, `popover.tsx`).

---

## 3. Acceptance Criteria (Given-When-Then)

1. **Skenario 1: Kompilasi Statis & Pemeriksaan Tipe (`AC-UG-01` & `NFR-UG-02`)**
   - **Given** seluruh paket dan konfigurasi telah dipasang menggunakan Bun,
   - **When** perintah `bun run typecheck`, `bun run lint`, dan `bun run build` dijalankan,
   - **Then** proses kompilasi selesai dengan kode keluar `0` dan `0` error TypeScript maupun ESLint.

2. **Skenario 2: Konsistensi Desain `radix-lyra` & Bebas *Em Dash* (`NFR-UG-01`)**
   - **Given** berkas `src/app/globals.css`, `src/app/layout.tsx`, dan primitif `src/components/ui/` telah dikonfigurasi,
   - **When** aplikasi dirender pada Mode Terang maupun Mode Gelap,
   - **Then** variabel warna `--primary` (`#1547E6` / `#3B68F7`), font `Figtree` & `Inter`, sudut tajam `rounded-none`, tinggi kontrol `h-8`, dan angka `tabular-nums` aktif, serta tidak ditemukan satu pun karakter *em dash* di seluruh kode dan metadata.

3. **Skenario 3: Pintasan Keyboard `D` untuk Pergantian Tema**
   - **Given** pengguna sedang membuka halaman portal panduan dan fokus kursor tidak berada di dalam elemen `<input>` atau `<textarea>`,
   - **When** pengguna menekan tombol `D` pada keyboard,
   - **Then** `ThemeProvider` mengganti tema aktif antara Mode Terang (`light`) dan Mode Gelap (`dark`).

4. **Skenario 4: Aturan Cetak Kertas (`NFR-UG-03`)**
   - **Given** `src/app/globals.css` telah dimuat,
   - **When** peramban masuk ke mode cetak (`@media print` / `Ctrl+P`),
   - **Then** elemen dengan kelas `.no-print`, header navigasi, sidebar kiri, daftar isi kanan, dan navigasi bawah artikel disembunyikan (`display: none !important`), sementara isi artikel melebar penuh di atas latar putih.

5. **Skenario 5: Kesiapan Registry 6 Modul & Pengujian Vitest (`AC-UG-02` & `AC-UG-06`)**
   - **Given** `src/lib/docs-registry.ts` dan `vitest.config.ts` telah disiapkan,
   - **When** `bun run test` dijalankan,
   - **Then** Vitest memverifikasi bahwa ke-6 modul dan ke-20 metadata artikel terdaftar secara berurutan tanpa tautan kosong, serta `PUBLIC_ENV.APP_URL` tersedia untuk tombol `"Buka Aplikasi Schedovyn"`.

---

## 4. Breakdown Task Eksekusi (TDD & Implementation Roadmap)

### Langkah 0: Eksplorasi Awal `codegraph`
Sebelum memodifikasi berkas, jalankan inisialisasi dan kueri `codegraph` di terminal:
```bash
codegraph status || codegraph init
codegraph files
```

---

### Langkah 1: Instalasi Dependensi via Bun & Pembaruan `package.json`
1. Jalankan perintah instalasi paket menggunakan **Bun**:
   ```bash
   bun add next-mdx-remote gray-matter remark-gfm minisearch cmdk next-themes lucide-react clsx tailwind-merge class-variance-authority radix-ui
   bun add -d vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
   ```
2. Perbarui bagian `"scripts"` pada `package.json`:
   ```json
   "scripts": {
     "dev": "next dev",
     "build": "next build",
     "start": "next start",
     "lint": "eslint",
     "typecheck": "tsc --noEmit",
     "test": "vitest run",
     "test:watch": "vitest"
   }
   ```

---

### Langkah 2: Konfigurasi Environment Variables (`.env.example` & `src/lib/env.ts`)
1. Buat berkas `.env.example` di *root* proyek:
   ```env
   NEXT_PUBLIC_APP_URL=https://app.schedovyn.com
   NEXT_PUBLIC_LANDING_URL=https://schedovyn.com
   ```
2. Buat berkas `src/lib/env.ts` sesuai kontrak pada Bagian 2.1.

---

### Langkah 3: Sistem Desain `radix-lyra`, Font Variable, & `@media print`
1. Buat berkas `components.json` di *root* proyek untuk kompatibilitas `shadcn/ui` (`radix-lyra`, Tailwind CSS v4, alias `@/components` dan `@/lib/utils`).
2. Buat berkas `src/lib/utils.ts` yang mengekspor fungsi `cn(...inputs: ClassValue[]): string`.
3. Perbarui `src/app/globals.css` dengan mengacu penuh pada [DESIGN.md](../../DESIGN.md):
   - Definisikan variabel `:root` (Mode Terang) dan `.dark` (Mode Gelap):
     - `--background`: `#FFFFFF` (Light) / `#0B0F17` (Dark)
     - `--surface-subtle`: `#F8FAFC` (Light) / `#111827` (Dark)
     - `--foreground`: `#0F172A` (Light) / `#F8FAFC` (Dark)
     - `--muted-foreground`: `#475569` (Light) / `#94A3B8` (Dark)
     - `--border`: `#E2E8F0` (Light) / `#1E293B` (Dark)
     - `--primary`: `#1547E6` (Light) / `#3B68F7` (Dark)
     - `--primary-foreground`: `#FFFFFF`
     - Token status validasi (`--status-error-fg`, `--status-error-bg`, `--status-error-border`, `--status-warning-*`, `--status-info-*`, `--status-valid-*`).
     - `--radius: 0rem` (sudut tajam `rounded-none`).
   - Tambahkan blok `@media print` untuk menyembunyikan `[data-docs-chrome]`, `.no-print`, `<header>`, `<aside>`, dan `<nav>`, serta menjaga `break-inside: avoid` pada tabel, `<StepList>`, dan `<Callout>`.
4. Buat `src/components/docs/ThemeProvider.tsx` (`"use client"`) yang membungkus `ThemeProvider` dari `next-themes` dan menambahkan *event listener* `keydown` untuk tombol `d` / `D` (mengabaikan penekanan jika ada modifier `Ctrl`/`Alt`/`Meta` atau jika target fokus adalah input/textarea/select).
5. Perbarui `src/app/layout.tsx`:
   - Muat `Figtree`, `Inter`, dan `JetBrains_Mono` dari `next/font/google`.
   - Atur `<html lang="id" suppressHydrationWarning>`.
   - Pasang metadata Bahasa Indonesia resmi:
     - `title`: `"Panduan Pemakaian Schedovyn | Dokumentasi Resmi Penyusunan Jadwal Sekolah"`
     - `description`: `"Portal panduan langkah demi langkah, kamus penyelesaian konflik jadwal, dan referensi fitur untuk aplikasi Smart Timetable Planner Schedovyn."`

---

### Langkah 4: Pembuatan Primitif Komponen UI `radix-lyra` (`src/components/ui/`)
Buat komponen primitif berikut di `src/components/ui/` dengan mematuhi aturan `DESIGN.md` (`rounded-none`, garis batas `1px`, tinggi kontrol `h-8` pada desktop, target sentuh responsif, tanpa *glow* dekoratif, dan fokus keyboard `focus-visible:ring-2 focus-visible:ring-[var(--primary)]`):
1. `src/components/ui/button.tsx` (varian: `default`, `outline`, `secondary`, `ghost`, `destructive`; ukuran: `default` `h-8 px-3 text-xs`, `sm` `h-7 px-2.5 text-xs`, `lg` `h-9 px-4 text-sm`, `icon` `h-8 w-8`).
2. `src/components/ui/badge.tsx` (varian: `default`, `secondary`, `outline`, `error`, `warning`, `info`, `valid` dengan `rounded-none` dan `tabular-nums`).
3. `src/components/ui/input.tsx` (`rounded-none`, `h-8`, `border border-[var(--border)]`, `text-sm`).
4. `src/components/ui/dialog.tsx` (pembungkus Radix Dialog dengan `rounded-none`, `border border-[var(--border)]`, `shadow-lg`, dapat ditutup dengan `Escape`).
5. `src/components/ui/tabs.tsx` (pembungkus Radix Tabs dengan indikator garis tegas `radix-lyra`).
6. `src/components/ui/popover.tsx` (pembungkus Radix Popover dengan `rounded-none` dan `border border-[var(--border)]`).

---

### Langkah 5: Penyediaan Struktur Folder 6 Modul & Kontrak `src/lib/`
1. Buat struktur direktori konten 6 modul di `src/content/docs/`:
   - `src/content/docs/01-pengenalan/`
   - `src/content/docs/02-ruang-kerja-dan-data-master/`
   - `src/content/docs/03-menyusun-jadwal-editor/`
   - `src/content/docs/04-kamus-konflik-dan-validasi/`
   - `src/content/docs/05-ekspor-dokumen/`
   - `src/content/docs/06-penyimpanan-pwa-dan-pintasan/`
2. Buat direktori `src/components/docs/` dan `src/components/replicas/`.
3. Implementasikan `src/lib/docs-registry.ts` berisi data lengkap 6 Modul dan 20 artikel sesuai daftar berkas MDX di PRD Bab 3.2 & Bab 4 (pastikan seluruh judul dan deskripsi bebas karakter *em dash*).
4. Implementasikan kerangka `src/lib/search-engine.ts` menggunakan `MiniSearch` untuk mengindeks dan mencari `SearchableDocSection[]` serta mengelompokkan hasil berdasarkan modul (`SearchResultModuleGroup[]`).

---

### Langkah 6: Setup Infrastruktur Pengujian (`Vitest` + `@testing-library/react`)
1. Buat `vitest.config.ts` di *root* proyek dengan konfigurasi environment `jsdom`, plugin `@vitejs/plugin-react`, `setupFiles: ["./src/__tests__/setup.ts"]`, dan alias `@` menuju `./src`.
2. Buat `src/__tests__/setup.ts` yang mengimpor `@testing-library/jest-dom/vitest` serta mendefinisikan *mock* `window.matchMedia` dan `IntersectionObserver`.
3. Buat `src/__tests__/foundation-setup.test.tsx` untuk menguji:
   - Keutuhan `DOCS_MODULES` (6 modul, 20 artikel, urutan `prev`/`next` pada `getAdjacentArticles`, tidak ada karakter *em dash* pada judul/deskripsi).
   - Fungsi pencarian dasar `search-engine.ts` pada data indeks uji.
   - Komponen `ThemeProvider` merespons penekanan tombol `D` pada keyboard.
   - Nilai `PUBLIC_ENV.APP_URL` dan `PUBLIC_ENV.LANDING_URL`.

---

### Langkah 7: Verifikasi Akhir & Sinkronisasi `codegraph`
Setelah seluruh berkas dibuat, **Frontend Engineer** wajib menjalankan urutan perintah berikut dan memastikan semuanya lulus tanpa galat:
```bash
bun run typecheck
bun run test
bun run lint
bun run build
codegraph sync
```
