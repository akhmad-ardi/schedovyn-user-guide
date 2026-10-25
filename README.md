# Schedovyn User Guide & Documentation Portal

Portal Panduan Pemakaian dan Dokumentasi Resmi berbasis **Next.js (App Router)** untuk **Schedovyn** (*Smart Timetable Planner*).

Proyek ini dirancang khusus bagi **Staf Kurikulum, Operator Sekolah, Wakil Kepala Sekolah Bidang Kurikulum, dan Guru Penyusun Jadwal** agar dapat mempelajari alur penyusunan jadwal pelajaran sekolah, memahami kamus validasi serta penyelesaian konflik jadwal, dan mencetak panduan kerja secara praktis.

---

## 1. Tujuan & Fitur Utama

1. **Panduan Mulai Cepat (*Quick Start* < 15 Menit):**
   Memandu pengguna baru menyusun jadwal sekolah pertama mereka dari ruang kerja awal (*seed default*: `SMP Negeri 1 Nusantara`) hingga berhasil mengunduh dokumen PDF jadwal siap cetak.
2. **Tata Letak Dokumentasi 3 Kolom (`FR-UG-01`):**
   - **Sidebar Kiri (`DocsSidebar`):** Navigasi hierarkis 6 Modul panduan dengan penanda halaman aktif dan *collapsible drawer* pada layar *mobile/tablet*.
   - **Area Artikel Tengah (`max-w-3xl`):** Konten panduan berbasis MDX dengan komponen `<StepList>` (`tabular-nums`), `<Callout>`, tabel referensi, dan navigasi bawah (`DocsPager`: *Artikel Sebelumnya / Selanjutnya*).
   - **Daftar Isi Halaman (`TableOfContents`):** Melacak sub-judul `H2` dan `H3` secara otomatis saat halaman digulir (*IntersectionObserver scroll-spy*).
3. **Pencarian Instan Client-Side `Ctrl+K` / `/` (`FR-UG-02`):**
   Pencarian cepat 100% di sisi klien atas judul artikel, sub-judul, kode konflik, dan isi langkah panduan yang dikelompokkan berdasarkan modul.
4. **Replika Visual Interaktif Komponen UI Schedovyn (`FR-UG-03` & `FR-UG-04`):**
   - `ValidationStatusBadgesReplica`: Simulasi 4 lencana status validasi jadwal (`CONFLICT_DETECTED`, `INCOMPLETE`, `NO_CONFLICT_CURRENT_DATA`, `COMPLETE_AND_VALID`).
   - `ConflictDictionaryExplorer`: Penjelajah interaktif dengan filter kategori (*Semua*, *Bentrokan Waktu / Error*, *Kelengkapan / Warning*) dan pencarian untuk 7 konflik waktu serta 5 peringatan kelengkapan.
   - `SaveStatusBadgeReplica`: Simulasi 3 status penyimpanan otomatis IndexedDB (`"Menyimpan..."`, `"Tersimpan di browser"`, `"Gagal menyimpan lokal"`).
   - `SessionBlockOverlapReplica`: Peraga visual blok sesi normal dan *overlap cluster* pada grid waktu.
   - `KeyboardShortcutSwitch`: Sakelar reaktif penampil pintasan keyboard antara **Windows / Linux (`Ctrl`, `Alt`)** dan **macOS (`Cmd`, `Option`)**.
5. **Studi Kasus Terpadu SMP Negeri 1 Nusantara (`FR-UG-05`):**
   Tutorial langkah demi langkah menyusun jadwal 2 kelas paralel (`Kelas VII-A` dan `Kelas VII-B`), menangani guru lintas kelas dan ruang `Lab IPA`, menyalin jadwal antar-kelas, hingga mencapai status **Jadwal lengkap dan valid**.
6. **Gaya Desain `radix-lyra` & Dukungan Cetak Kertas (`NFR-UG-01` s.d. `NFR-UG-03`):**
   Sudut tajam (`rounded-none`), garis batas presisi `1px`, tinggi kontrol ringkas (`h-8`), aksen Indigo-Blue (`#1547E6`), tipografi `Figtree Variable` & `Inter Variable`, angka `tabular-nums`, dukungan tema Terang/Gelap (pintasan tombol `D`), serta aturan `@media print` untuk mencetak artikel panduan dengan rapi (`Ctrl+P`).

---

## 2. Arsitektur 6 Modul Dokumentasi

Seluruh materi panduan diorganisasikan ke dalam 6 modul berurutan di dalam `src/content/docs/`:

| Modul | Direktori | Cakupan Materi Utama |
|---|---|---|
| **Modul 01** | `01-pengenalan/` | Mengenal prinsip kerja Schedovyn (*Class-Oriented Editing, Workspace-Wide Validation*), panduan mulai cepat 10 menit, dan pengenalan tata letak 3 panel aplikasi. |
| **Modul 02** | `02-ruang-kerja-dan-data-master/` | Pengaturan identitas sekolah, jam belajar per hari, waktu istirahat, pengelolaan Kelas, Mata Pelajaran (10 warna), Guru (waktu tidak bersedia), Ruangan, dan Kebutuhan Pembelajaran Mingguan. |
| **Modul 03** | `03-menyusun-jadwal-editor/` | Memilih kelas aktif, menempatkan sesi belum terjadwal (*drag-and-drop* & tombol `"Tempatkan ke Jadwal"`), menyunting/melepas sesi di grid, riwayat *Undo/Redo* (50 langkah), dan menyalin jadwal antar-kelas paralel. |
| **Modul 04** | `04-kamus-konflik-dan-validasi/` | Penjelasan 4 status validasi jadwal, kamus 7 jenis bentrokan waktu (*Error*), kamus 5 peringatan kelengkapan (*Warning*), serta penggunaan matriks kelengkapan kelas. |
| **Modul 05** | `05-ekspor-dokumen/` | Panduan cetak PDF *Landscape* (A4/F4) dan ekspor spreadsheet Excel (`.xlsx`) 4 lembar kerja (`Jadwal`, `Rekap Guru`, `Rekap Ruangan`, `Konflik`). |
| **Modul 06** | `06-penyimpanan-pwa-dan-pintasan/` | Cara kerja penyimpanan otomatis lokal IndexedDB, pemasangan aplikasi desktop *Offline* (PWA), daftar lengkap pintasan keyboard, dan studi kasus terpadu SMP Negeri 1 Nusantara. |

---

## 3. Spesifikasi Tech Stack

| Layer / Kebutuhan | Teknologi / Pustaka |
|---|---|
| **Package Manager & Runtime** | **Bun** (`^1.4.0`) |
| **Core Web Framework** | **Next.js** (`^16.4.3`, App Router, React Server Components, Static Pre-rendering / SSG) |
| **UI Library** | **React 19** |
| **Bahasa Pemrograman** | **TypeScript** (`strict: true`, Zero `any` policy) |
| **Content / Docs Engine** | **MDX** (`next-mdx-remote`, `gray-matter`, `remark-gfm`) |
| **Styling & Design System** | **Tailwind CSS v4** (`radix-lyra` OKLCH tokens, `@media print`) |
| **UI Components & Icons** | **shadcn/ui** (`radix-lyra`) + **`lucide-react`** |
| **Client-Side Search** | **MiniSearch** / **FlexSearch** + **`cmdk`** (`Ctrl+K` / `/`) |
| **Theme Management** | **`next-themes`** (Mode Terang, Gelap, Sistem + pintasan keyboard `D`) |
| **Testing** | **Vitest** + **`@testing-library/react`** |

---

## 4. Struktur Direktori Proyek

```text
schedovyn-user-guide/
├── docs/
│   ├── Schedovyn-User-Guide-PRD.md      # Dokumen Spesifikasi Produk (PRD)
│   └── tasks/                           # Dokumen spesifikasi task eksekusi agen
├── public/
│   ├── favico.svg                       # Ikon resmi Schedovyn
│   └── og-guide.png                     # Gambar OpenGraph Portal Panduan
├── src/
│   ├── app/
│   │   ├── layout.tsx                   # Root Layout, Font Variable (Figtree & Inter), ThemeProvider
│   │   ├── page.tsx                     # Halaman Beranda Portal Panduan (Overview 6 Modul & Quick Links)
│   │   ├── globals.css                  # Konfigurasi Tailwind CSS v4, token OKLCH radix-lyra, & @media print
│   │   └── docs/
│   │       ├── layout.tsx               # Tata letak 3 kolom (Sidebar Kiri + Artikel Tengah + TOC Kanan)
│   │       └── [[...slug]]/
│   │           └── page.tsx             # Dynamic route SSG (generateStaticParams) pemuat artikel MDX
│   ├── content/
│   │   └── docs/                        # Berkas dokumentasi MDX terstruktur dalam 6 Modul
│   │       ├── 01-pengenalan/
│   │       ├── 02-ruang-kerja-dan-data-master/
│   │       ├── 03-menyusun-jadwal-editor/
│   │       ├── 04-kamus-konflik-dan-validasi/
│   │       ├── 05-ekspor-dokumen/
│   │       └── 06-penyimpanan-pwa-dan-pintasan/
│   ├── components/
│   │   ├── docs/                        # DocsNavbar, DocsSidebar, TableOfContents, SearchCommandDialog, DocsPager, Callout, StepList
│   │   ├── replicas/                    # ValidationStatusBadgesReplica, ConflictDictionaryExplorer, SaveStatusBadgeReplica, SessionBlockOverlapReplica, KeyboardShortcutSwitch
│   │   └── ui/                          # Komponen primitif shadcn/ui radix-lyra
│   ├── lib/
│   │   ├── docs-registry.ts             # Peta navigasi 6 modul, metadata artikel, & urutan halaman
│   │   └── search-engine.ts             # Pencarian client-side terindeks atas seluruh artikel
│   └── __tests__/                       # Unit & component tests (Vitest + React Testing Library)
├── AGENTS.md                            # Protokol operasional & pedoman rekayasa AI Agents
├── DESIGN.md                            # Acuan sistem desain visual radix-lyra & aturan anti-slop
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## 5. Konfigurasi Environment Variables

Salin berkas `.env.example` menjadi `.env.local` bila ingin menyesuaikan URL lintas proyek:

```env
NEXT_PUBLIC_APP_URL=https://app.schedovyn.com
NEXT_PUBLIC_LANDING_URL=https://schedovyn.com
```

- `NEXT_PUBLIC_APP_URL`: URL menuju aplikasi utama Schedovyn untuk tombol **"Buka Aplikasi Schedovyn"** di bilah header (`AC-UG-06`).
- `NEXT_PUBLIC_LANDING_URL`: URL menuju halaman Landing Page Schedovyn.

---

## 6. Panduan Menjalankan Proyek (Wajib Menggunakan Bun)

Pastikan Anda menggunakan **Bun** (`^1.4.0`) untuk seluruh instalasi paket dan eksekusi skrip:

```bash
# 1. Instal seluruh dependensi
bun install

# 2. Jalankan server pengembangan lokal (http://localhost:3000)
bun run dev

# 3. Jalankan pemeriksaan tipe TypeScript & ESLint
bun run lint

# 4. Jalankan pengujian otomatis (Vitest)
bun run test

# 5. Bangun aplikasi untuk produksi (Static Pre-rendering)
bun run build
```

---

## 7. Referensi Dokumen Proyek

- **[Product Requirements Document (PRD)](./docs/Schedovyn-User-Guide-PRD.md):** Spesifikasi fungsional (`FR-UG-01` s.d. `FR-UG-05`), non-fungsional (`NFR-UG-01` s.d. `NFR-UG-03`), peta konten 6 modul, dan kriteria penerimaan (`AC-UG-01` s.d. `AC-UG-06`).
- **[Design System & Visual Direction (`DESIGN.md`)](./DESIGN.md):** Panduan token warna OKLCH `radix-lyra`, tipografi, geometri komponen, dan batasan kualitas visual.
- **[AI Agents Engineering Protocol (`AGENTS.md`)](./AGENTS.md):** Alur kerja berbasis TDD (*Red-Green-Refactor*), protokol wajib `codegraph`, serta aturan kualitas bahasa dan kode.
