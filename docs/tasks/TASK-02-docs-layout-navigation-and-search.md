# TASK-02: Tata Letak Dokumentasi 3 Kolom, Navigasi 6 Modul, Pencarian Instan `Ctrl+K`, & Halaman Beranda

| Informasi Task | Detail |
|---|---|
| **ID Task** | `TASK-02` |
| **Judul Task** | Implementasi Kerangka Tata Letak 3 Kolom, Pemuat MDX, Navigasi 6 Modul, Dialog Pencarian `Ctrl+K`, & Beranda Portal |
| **Pelaksana Fase RED** | **QA Engineer** (`.agents/agents/qa-engineer/agent.md`) |
| **Pelaksana Fase GREEN** | **Frontend Engineer** (`.agents/agents/frontend-engineer/agent.md`) |
| **Dokumen Acuan** | [Schedovyn-User-Guide-PRD.md](../Schedovyn-User-Guide-PRD.md), [Schedovyn-User-Guide-TDD.md](../Schedovyn-User-Guide-TDD.md), [DESIGN.md](../../DESIGN.md), [AGENTS.md](../../AGENTS.md) |
| **Cakupan Persyaratan** | `FR-UG-01`, `FR-UG-02`, `NFR-UG-01`, `NFR-UG-02`, `NFR-UG-03`, `AC-UG-01`, `AC-UG-02`, `AC-UG-03`, `AC-UG-06` |

---

## 1. Konteks & Tujuan Fitur

### 1.1 Hasil Telusur Codebase (`TASK-01` Baseline)
Berdasarkan struktur yang telah terbangun pada `TASK-01`:
- **`src/lib/docs-registry.ts`:** Telah memuat `DOCS_MODULES` (6 modul dan 20 artikel), `getAllDocArticles()`, `getDocArticleBySlug()`, dan `getAdjacentArticles()`.
- **`src/lib/search-engine.ts`:** Telah memuat indeks `MiniSearch`, `DEFAULT_SEARCHABLE_SECTIONS`, `searchDocsSections()`, dan `searchDocsGroupedByModule()`.
- **`src/lib/env.ts`:** Telah menyediakan `PUBLIC_ENV.APP_URL` dan `PUBLIC_ENV.LANDING_URL`.
- **`src/components/docs/ThemeProvider.tsx` & `src/components/ui/*`:** Telah menyediakan pengelolaan tema Terang/Gelap (termasuk pintasan tombol `D`) serta primitif `Button`, `Badge`, `Input`, `Dialog`, `Tabs`, dan `Popover` dengan gaya `radix-lyra` (`rounded-none`, `h-8`, `border`).
- **Yang Belum Tersedia:**
  1. Pemuat dan pengompilasi MDX (`src/lib/mdx-loader.ts`) beserta ekstraktor sub-judul `H2`/`H3`.
  2. Komponen kerangka dokumentasi di `src/components/docs/`: `DocsNavbar.tsx`, `DocsSidebar.tsx`, `TableOfContents.tsx`, `SearchCommandDialog.tsx`, `DocsPager.tsx`, `Callout.tsx`, dan `StepList.tsx`.
  3. Halaman Beranda Portal Panduan (`src/app/page.tsx` masih berisi *boilerplate* bawaan Next.js).
  4. Rute dokumentasi 3 kolom (`src/app/docs/layout.tsx`) dan rute dinamis SSG (`src/app/docs/[[...slug]]/page.tsx`).

### 1.2 Referensi Persyaratan PRD & TDD
- **`FR-UG-01` & `AC-UG-02`:** Tata letak dokumentasi 3 kolom (`DocsSidebar` kiri + Artikel tengah `max-w-3xl` + `TableOfContents` kanan dengan *scroll-spy* pada layar `xl`) serta navigasi bawah `DocsPager` (*Artikel Sebelumnya / Selanjutnya*) tanpa tautan rusak (*broken links*).
- **`FR-UG-02` & `AC-UG-03`:** Dialog pencarian instan *client-side* (`SearchCommandDialog.tsx`) yang dibuka dengan `Ctrl+K`, `Cmd+K`, atau `/`, mencari kata kunci seperti `"istirahat"`, `"konflik guru"`, `"excel"`, atau `"undo"`, mengelompokkan hasil per modul, dan mengarahkan pengguna ke artikel terkait.
- **`AC-UG-06`:** Tombol CTA **"Buka Aplikasi Schedovyn"** di bilah header (`DocsNavbar.tsx`) yang mengarah langsung ke `PUBLIC_ENV.APP_URL`.
- **`NFR-UG-01`, `NFR-UG-02`, `NFR-UG-03`, & `AC-UG-01`:** Konsistensi desain `radix-lyra` tanpa karakter *em dash*, *static pre-rendering* (`generateStaticParams`) untuk seluruh rute `/docs/[[...slug]]`, dan kepatuhan aturan cetak `@media print`.

### 1.3 Kebutuhan Pengguna Sekolah yang Diselesaikan
Staf kurikulum dan operator sekolah membutuhkan navigasi yang terstruktur per modul, kemampuan melompat langsung ke sub-bab spesifik di dalam artikel, serta pencarian cepat `Ctrl+K` ketika menghadapi kendala penjadwalan tanpa harus membaca seluruh manual dari awal.

---

## 2. Kontrak Data & Arsitektur Teknis (Next.js App Router)

### 2.1 Kontrak Pemuat MDX & Ekstraktor Heading (`src/lib/mdx-loader.ts`)

```ts
import type { ReactNode } from "react";
import type { DocArticleMeta } from "./docs-registry";

export interface TocHeadingItem {
  readonly id: string;
  readonly text: string;
  readonly level: 2 | 3;
}

export interface CompiledDocPage {
  readonly meta: DocArticleMeta;
  readonly content: ReactNode;
  readonly headings: readonly TocHeadingItem[];
  readonly rawBody: string;
}

/**
 * Mengubah teks sub-judul H2/H3 menjadi ID jangkar URL yang deterministik.
 * Contoh: "2.1 Mengatur Jam Belajar & Istirahat" -> "21-mengatur-jam-belajar-istirahat"
 */
export function slugifyHeading(text: string): string;

/**
 * Mengekstrak daftar sub-judul ## (level 2) dan ### (level 3) dari sumber MDX
 * dengan mengabaikan baris di dalam blok kode berpagar (```).
 */
export function extractHeadingsFromMdx(rawMdx: string): readonly TocHeadingItem[];

/**
 * Memuat berkas MDX dari src/content/docs/${meta.filePath} (atau menggunakan
 * fallback MDX terstruktur dari DocArticleMeta bila berkas fisik belum ditulis),
 * lalu mengompilasinya menggunakan compileMDX (next-mdx-remote/rsc) + remark-gfm.
 */
export async function compileDocArticle(
  meta: DocArticleMeta
): Promise<CompiledDocPage>;
```

> **Aturan Fallback `compileDocArticle` (Resilience Pra-`TASK-04`):**
> Apabila berkas fisik `src/content/docs/${meta.filePath}` belum tersedia di disk, `compileDocArticle(meta)` wajib menghasilkan konten MDX terstruktur yang valid berdasarkan `meta.order`, `meta.title`, `meta.description`, dan `meta.moduleTitle` (lengkap dengan minimal dua sub-judul `## Ringkasan Panduan` dan `## Langkah Operasional Utama` agar `TableOfContents` dan `generateStaticParams` tetap berfungsi penuh saat `bun run build` dijalankan pada `TASK-02`).

---

### 2.2 Kontrak Komponen Kerangka Dokumentasi (`src/components/docs/`)

#### 1. `Callout.tsx` (Server Component)
```ts
import type { ReactNode } from "react";

export type CalloutVariant = "info" | "tip" | "warning" | "danger";

export interface CalloutProps {
  readonly variant?: CalloutVariant;
  readonly title?: string;
  readonly children: ReactNode;
  readonly className?: string;
}
```
- Merender kotak informasi dengan atribut `data-callout={variant}`, sudut tajam `rounded-none`, bingkai `1px solid`, dan warna semantik `--status-info-*` (`info`), `--status-valid-*` (`tip`), `--status-warning-*` (`warning`), atau `--status-error-*` (`danger`).
- Label judul default bila `title` tidak diberikan:
  - `info`: `"Catatan"`
  - `tip`: `"Tips Kurikulum"`
  - `warning`: `"Penting"`
  - `danger`: `"Peringatan Konflik & Data"`

#### 2. `StepList.tsx` (Server Component)
```ts
import type { ReactNode } from "react";

export interface StepListProps {
  readonly children: ReactNode;
  readonly className?: string;
}

export interface StepItemProps {
  readonly step: number | string;
  readonly title: string;
  readonly children: ReactNode;
}
```
- `<StepList>` membungkus daftar langkah dengan `data-step-list`.
- `<StepItem>` menampilkan nomor langkah di dalam kotak persegi `28x28px` (`rounded-none`, `border border-primary bg-surface-subtle text-primary font-mono text-xs font-bold tabular-nums`) dan judul langkah (`font-heading font-semibold`).

#### 3. `DocsNavbar.tsx` (`"use client"`)
```ts
export interface DocsNavbarProps {
  readonly onOpenSearch?: () => void;
  readonly onOpenMobileSidebar?: () => void;
  readonly showMobileMenuButton?: boolean;
}
```
- **Elemen Wajib:**
  - Tombol menu *mobile* (`lg:hidden`, `min-h-11 min-w-11` / `44x44px` sesuai `R-03`, `aria-label="Buka navigasi modul"`) ketika `showMobileMenuButton` bernilai `true`.
  - Tautan identitas ke `/`: **"Schedovyn"** + lencana **"PANDUAN"**.
  - Tautan navigasi ke `/docs/01-pengenalan/mengenal-schedovyn` (*"Dokumentasi"*) dan ke `PUBLIC_ENV.LANDING_URL` (*"Halaman Produk"*).
  - Tombol Pemicu Pencarian (`onClick={onOpenSearch}`, `aria-label="Cari panduan atau kode konflik"`) dengan teks `"Cari panduan atau kode konflik..."` dan `<kbd>Ctrl K</kbd>`.
  - Tombol Pengubah Tema Terang/Gelap (`aria-label="Ganti tema tampilan"`).
  - Tombol CTA **"Buka Aplikasi Schedovyn"** (`<a href={PUBLIC_ENV.APP_URL}>`, `AC-UG-06`) dengan ikon `ArrowUpRight`.

#### 4. `DocsSidebar.tsx` (`"use client"`)
```ts
import type { DocModuleGroup } from "@/lib/docs-registry";

export interface DocsSidebarProps {
  readonly modules?: readonly DocModuleGroup[];
  readonly mobileOpen?: boolean;
  readonly onMobileClose?: () => void;
}
```
- Membaca `pathname` dari `usePathname()`. Jika `pathname === "/docs"` atau `pathname === `/docs/${moduleSlug}``, menandai artikel pertama yang sesuai sebagai aktif.
- Setiap modul menampilkan nomor `moduleNumber` (`01` s.d. `06` dalam `font-mono tabular-nums`) dan judul modul.
- Setiap item artikel menampilkan `article.order` (`tabular-nums`) dan `article.title` di dalam `<Link href={article.href}>`.
- Item aktif memiliki atribut `aria-current="page"` dan garis kiri tegas `border-l-2 border-primary bg-surface-subtle text-primary font-semibold`.
- Menyediakan tampilan *drawer* `Dialog` untuk layar `< 1024px` ketika `mobileOpen === true`.

#### 5. `TableOfContents.tsx` (`"use client"`)
```ts
import type { TocHeadingItem } from "@/lib/mdx-loader";

export interface TableOfContentsProps {
  readonly headings: readonly TocHeadingItem[];
}
```
- Menampilkan judul bagian `"Di Halaman Ini"`.
- Memantau elemen `h2[id]` dan `h3[id]` menggunakan `IntersectionObserver` dan memberi penanda aktif pada tautan `#id` yang sedang terlihat.
- Sub-judul level `3` (`H3`) diberi indentasi kiri (`pl-4`).

#### 6. `DocsPager.tsx` (Server Component)
```ts
export interface DocsPagerProps {
  readonly currentHref: string;
}
```
- Menggunakan `getAdjacentArticles(currentHref)` dari `src/lib/docs-registry.ts`.
- Merender tautan **"Artikel Sebelumnya"** (jika `prev !== null`) dan **"Artikel Selanjutnya"** (jika `next !== null`) lengkap dengan nomor bab (`order` dalam `tabular-nums`), judul artikel, dan nama modul.

#### 7. `SearchCommandDialog.tsx` (`"use client"`)
```ts
import type { SearchableDocSection } from "@/lib/search-engine";

export interface SearchCommandDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly sections?: readonly SearchableDocSection[];
}
```
- Mendengarkan pintasan keyboard global `Ctrl+K`, `Cmd+K`, dan `/` (ketika fokus tidak berada pada elemen `<input>`, `<textarea>`, `<select>`, atau `isContentEditable`).
- Memanggil `searchDocsGroupedByModule(query, sections)` setiap kali input berubah.
- Menampilkan hasil pencarian yang dikelompokkan berdasarkan `moduleNumber` & `moduleTitle`, lengkap dengan `sectionHeading` dan `excerpt`.
- Ketika pengguna mengeklik hasil atau menekan `Enter` pada item aktif, memanggil `router.push(item.href)` dan `onOpenChange(false)`.
- Ketika kueri tidak menghasilkan kecocokan (`results.length === 0`), menampilkan *Empty State* informatif:
  `"Tidak ditemukan panduan untuk kata kunci '[query]'."` beserta saran kata kunci (`"istirahat"`, `"konflik guru"`, `"salin jadwal"`, `"excel"`, `"undo"`) dan tautan langsung ke `/docs/04-kamus-konflik-dan-validasi/empat-status-validasi`.

---

### 2.3 Arsitektur Halaman Beranda (`src/app/page.tsx`) & Rute Dokumentasi (`src/app/docs/`)

#### 1. Halaman Beranda Portal (`src/app/page.tsx`)
Mengikuti struktur `DESIGN.md` Bagian 4.2 (bebas *marketing fluff*, fokus pada dokumentasi operasional):
- Menyertakan `DocsNavbar` dan `SearchCommandDialog`.
- **Bagian 1 (Focal Point Header & Pencarian Cepat):**
  - Judul `H1`: `"Panduan Pemakaian & Referensi Resmi Schedovyn"`.
  - Deskripsi lugas untuk Staf Kurikulum, Operator Sekolah, dan Penyusun Jadwal.
  - Tombol pemicu pencarian langsung (`Ctrl+K`) + tombol kata kunci populer (`"jam istirahat Jumat"`, `"TEACHER_OVERLAP"`, `"salin jadwal"`, `"excel"`).
  - Dua CTA terarah: **"Mulai Cepat dalam 10 Menit"** (`/docs/01-pengenalan/mulai-cepat-10-menit`) dan **"Kamus Konflik & Validasi"** (`/docs/04-kamus-konflik-dan-validasi/empat-status-validasi`).
- **Bagian 2 (Jalur Baca Berdasarkan Skenario Penggunaan - PRD Bab 2):**
  - 3 jalur bernomor (`01` *Pengguna Baru / Onboarding Pertama Kali*, `02` *Troubleshooting Konflik Jadwal*, `03` *Cetak Laporan PDF & Rekap Guru Excel*) dengan tautan langsung ke bab yang relevan.
- **Bagian 3 (Peta 6 Modul Dokumentasi):**
  - Grid teknis berbatas `1px` (`DOCS_MODULES`) yang menampilkan ke-6 modul beserta tautan langsung ke seluruh 20 artikel panduan (`AC-UG-02`).
- **Bagian 4 (Banner Studi Kasus Terpadu - `FR-UG-05`):**
  - Blok pengarah ke **"Studi Kasus: Menyusun Jadwal SMP Negeri 1 Nusantara dari Nol"** (`/docs/06-penyimpanan-pwa-dan-pintasan/studi-kasus-smp-nusantara`).

#### 2. Tata Letak 3 Kolom (`src/app/docs/layout.tsx`)
- Mengelola state buka/tutup `SearchCommandDialog` dan *mobile drawer* `DocsSidebar` melalui komponen pembungkus klien tipis (`DocsShell.tsx` di `src/components/docs/DocsShell.tsx`) sehingga `src/app/docs/layout.tsx` tetap bersih.
- Susunan 3 kolom:
  - Kiri: `DocsSidebar` (`hidden lg:block w-64 shrink-0 border-r border-border`).
  - Tengah + Kanan: `<div className="flex-1 min-w-0">` yang memuat konten halaman `/docs/[[...slug]]/page.tsx`.

#### 3. Rute Artikel Dinamis SSG (`src/app/docs/[[...slug]]/page.tsx`)
- Mengekspor `generateStaticParams()` yang mencakup rute `/docs`, 6 rute modul `/docs/[moduleSlug]`, dan 20 rute artikel `/docs/[moduleSlug]/[articleSlug]`.
- Mengekspor `generateMetadata({ params })` untuk mengatur `title` dan `description` halaman sesuai `DocArticleMeta`.
- Memanggil `getDocArticleBySlug(slug)` (memanggil `notFound()` jika `null`), mengompilasi artikel via `compileDocArticle(meta)`, lalu merender:
  -Kolom Artikel Tengah (`<article data-docs-article className="flex-1 min-w-0 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">`):
    - Header Artikel: Informasi Modul (`meta.moduleNumber` + `meta.moduleTitle`) dan Nomor Urut (`meta.order` dalam `tabular-nums`), diikuti `<h1>{meta.title}</h1>` dan ringkasan `meta.description`.
    - Isi MDX (`compiled.content`).
    - Navigasi bawah `<DocsPager currentHref={meta.href} />`.
  - Kolom Kanan: `<TableOfContents headings={compiled.headings} />` (`hidden xl:block w-56 shrink-0`).

---

## 3. Acceptance Criteria (Given-When-Then)

1. **Skenario 1: Navigasi 6 Modul & Pager Tanpa Broken Links (`FR-UG-01`, `AC-UG-02`)**
   - **Given** pengguna berada di halaman dokumentasi `/docs/01-pengenalan/mengenal-schedovyn`,
   - **When** `DocsSidebar` dan `DocsPager` dirender,
   - **Then** `DocsSidebar` menampilkan seluruh 6 modul dan 20 tautan artikel dengan item `1.1 Mengenal Schedovyn & Prinsip Kerja` bertanda `aria-current="page"`, serta `DocsPager` hanya menampilkan tombol `"Artikel Selanjutnya"` (`1.2 Panduan Mulai Cepat 10 Menit`) tanpa tombol `"Artikel Sebelumnya"`.
   - **And When** pengguna berada di artikel terakhir `/docs/06-penyimpanan-pwa-dan-pintasan/studi-kasus-smp-nusantara`,
   - **Then** `DocsPager` hanya menampilkan tombol `"Artikel Sebelumnya"` (`6.3 Daftar Lengkap Pintasan Keyboard`) tanpa tombol `"Artikel Selanjutnya"`.

2. **Skenario 2: Pencarian Instan Client-Side `Ctrl+K` / `/` (`FR-UG-02`, `AC-UG-03`)**
   - **Given** pengguna berada di halaman mana pun pada portal panduan,
   - **When** pengguna menekan `Ctrl+K` (atau `/` saat tidak fokus di input) atau mengeklik tombol pencarian di `DocsNavbar`,
   - **Then** `SearchCommandDialog` terbuka dan fokus berada pada input pencarian.
   - **And When** pengguna mengetik `"istirahat"`, `"konflik guru"`, `"excel"`, atau `"undo"`,
   - **Then** dialog menampilkan daftar artikel yang relevan dikelompokkan berdasarkan modul beserta cuplikan kalimatnya, dan mengeklik salah satu hasil akan memanggil navigasi ke `href` artikel tersebut serta menutup dialog.

3. **Skenario 3: Penanganan Kata Kunci Pencarian Tidak Ditemukan (`R-27`)**
   - **Given** `SearchCommandDialog` sedang terbuka,
   - **When** pengguna mengetik kata kunci yang tidak ada di dalam indeks seperti `"xyzabctidakada"`,
   - **Then** dialog menampilkan pesan *empty state* Bahasa Indonesia yang jelas beserta saran kata kunci dan tautan menuju halaman Kamus Konflik.

4. **Skenario 4: Akses Langsung ke Aplikasi Utama Schedovyn (`AC-UG-06`)**
   - **Given** `DocsNavbar` dirender di bagian atas portal,
   - **When** pengguna memeriksa tombol CTA utama di sebelah kanan header,
   - **Then** terdapat tombol/tautan **"Buka Aplikasi Schedovyn"** dengan atribut `href` yang mengarah ke `PUBLIC_ENV.APP_URL`.

5. **Skenario 5: Static Pre-Rendering Seluruh Rute Dokumentasi (`NFR-UG-02`, `AC-UG-01`)**
   - **Given** seluruh komponen dan rute `/docs/[[...slug]]/page.tsx` telah diimplementasikan,
   - **When** perintah `bun run build` dijalankan,
   - **Then** Next.js berhasil melakukan *static pre-rendering* untuk halaman `/` dan seluruh rute `/docs/[[...slug]]` dengan `0` error TypeScript dan `0` karakter *em dash*.

---

## 4. Breakdown Task Eksekusi (TDD Roadmap)

### Langkah 0: Eksplorasi Konteks dengan `codegraph` (Wajib untuk QA & Frontend Engineer)
Sebelum menulis pengujian atau kode implementasi, jalankan:
```bash
codegraph explore "DOCS_MODULES getDocArticleBySlug getAdjacentArticles searchDocsGroupedByModule"
```

---

### Fase 1: Task QA Engineer (Fase RED)

**QA Engineer** wajib menulis berkas pengujian otomatis berikut di `src/__tests__/` terlebih dahulu dan memastikan pengujian tersebut berstatus **RED** (gagal karena komponen/modul belum diimplementasikan):

1. **`src/__tests__/docs-layout-navigation.test.tsx`:**
   - Menguji fungsi `slugifyHeading` dan `extractHeadingsFromMdx` dari `@/lib/mdx-loader` (termasuk mengabaikan tanda `#` di dalam blok kode ` ``` `).
   - Menguji `DocsNavbar`: merender identitas `"Schedovyn"`, tombol pemicu pencarian `"Cari panduan atau kode konflik..."`, tombol ganti tema, serta tautan CTA `"Buka Aplikasi Schedovyn"` dengan `href={PUBLIC_ENV.APP_URL}` (`AC-UG-06`).
   - Menguji `DocsSidebar`: merender seluruh 6 grup modul (`01` s.d. `06`) dan 20 tautan artikel tanpa *broken links* (`AC-UG-02`), serta menandai rute aktif dengan `aria-current="page"`.
   - Menguji `DocsPager`:
     - Pada artikel pertama (`/docs/01-pengenalan/mengenal-schedovyn`), hanya merender `"Artikel Selanjutnya"` (`1.2`).
     - Pada artikel tengah (`/docs/03-menyusun-jadwal-editor/memilih-kelas-aktif`), merender `"Artikel Sebelumnya"` (`2.3`) dan `"Artikel Selanjutnya"` (`3.2`).
     - Pada artikel terakhir (`/docs/06-penyimpanan-pwa-dan-pintasan/studi-kasus-smp-nusantara`), hanya merender `"Artikel Sebelumnya"` (`6.3`).
   - Menguji `TableOfContents`: merender daftar `H2` dan `H3` dengan tautan `#id` yang sesuai.
   - Menguji `Callout` dan `StepList`: merender judul, nomor langkah `tabular-nums`, dan isi instruksi.

2. **`src/__tests__/search-command-dialog.test.tsx`:**
   - Menguji pembukaan `SearchCommandDialog` saat pengguna menekan `Ctrl+K` atau `/` pada `window`.
   - Menguji pencarian kata kunci `"istirahat"`, `"konflik guru"`, `"excel"`, dan `"undo"` menampilkan artikel yang tepat dikelompokkan berdasarkan modul (`AC-UG-03`).
   - Menguji klik pada hasil pencarian memanggil `router.push(href)` dan menutup dialog.
   - Menguji tampilan *empty state* ketika kata kunci tidak ditemukan (`R-27`).

---

### Fase 2: Task Frontend Engineer (Fase GREEN & Refactor)

Setelah berkas pengujian Fase RED tersedia, **Frontend Engineer** mengimplementasikan berkas-berkas berikut secara berurutan hingga seluruh pengujian berstatus **GREEN**:

1. **Implementasi Pemuat MDX (`src/lib/mdx-loader.ts`):**
   - Implementasikan `slugifyHeading`, `extractHeadingsFromMdx`, dan `compileDocArticle`.
   - Gunakan `fs/promises` + `path.join(process.cwd(), "src/content/docs", meta.filePath)` untuk membaca berkas `.mdx` bila ada, atau gunakan *fallback template* MDX bila berkas belum ditulis.
   - Gunakan `gray-matter` untuk memisahkan *frontmatter* (jika ada) dan `compileMDX` dari `next-mdx-remote/rsc` dengan `remarkGfm` serta komponen MDX kustom (`h2`, `h3`, `table`, `code`, `kbd`, `Callout`, `StepList`, `StepItem`).

2. **Implementasi Komponen Dokumentasi (`src/components/docs/`):**
   - `src/components/docs/Callout.tsx`
   - `src/components/docs/StepList.tsx`
   - `src/components/docs/DocsNavbar.tsx`
   - `src/components/docs/DocsSidebar.tsx`
   - `src/components/docs/TableOfContents.tsx`
   - `src/components/docs/DocsPager.tsx`
   - `src/components/docs/SearchCommandDialog.tsx`
   - `src/components/docs/DocsShell.tsx` (pembungkus klien untuk mengelola state `searchOpen` dan `mobileSidebarOpen` antara `DocsNavbar`, `DocsSidebar`, dan `SearchCommandDialog`).

3. **Implementasi Halaman Beranda & Rute Dokumentasi (`src/app/`):**
   - Perbarui `src/app/page.tsx` menjadi Halaman Beranda Portal Panduan Schedovyn sesuai spesifikasi Bagian 2.3.
   - Buat `src/app/docs/layout.tsx` menggunakan `DocsShell`.
   - Buat `src/app/docs/[[...slug]]/page.tsx` dengan `generateStaticParams`, `generateMetadata`, `compileDocArticle`, `DocsPager`, dan `TableOfContents`.

4. **Verifikasi Akhir & Sinkronisasi `codegraph`:**
   Jalankan seluruh pemeriksaan kualitas berikut dan pastikan semuanya lulus tanpa galat:
   ```bash
   bun run typecheck
   bun run test
   bun run lint
   bun run build
   codegraph sync
   ```
