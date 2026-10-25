<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# Schedovyn User Guide — AI Agents Protocol & Engineering Guidelines

Dokumen ini merupakan **Sumber Kebenaran Tunggal (*Single Source of Truth*) Operasional** bagi seluruh *AI Agents* yang merancang, menguji, dan mengimplementasikan **Schedovyn User Guide & Documentation Portal** (Portal Panduan Pemakaian & Dokumentasi Resmi untuk aplikasi *Smart Timetable Planner* Schedovyn).

Setiap agen wajib mematuhi protokol kerja, arsitektur teknis Next.js (App Router), standar desain `radix-lyra`, serta kriteria penerimaan yang ditetapkan dalam [docs/Schedovyn-User-Guide-PRD.md](docs/Schedovyn-User-Guide-PRD.md).

---

## 1. Sumber Kebenaran & Protokol Wajib `codegraph`

### 1.1 Dokumen Referensi Utama
- **PRD Portal Panduan:** [docs/Schedovyn-User-Guide-PRD.md](docs/Schedovyn-User-Guide-PRD.md)
- **TDD Portal Panduan (bila tersedia):** `docs/Schedovyn-User-Guide-TDD.md`
- **Panduan Next.js Lokal:** `node_modules/next/dist/docs/`

### 1.2 Alur Kerja Wajib `codegraph` (Sebelum & Sesudah Eksekusi)
Seluruh agen **WAJIB** menggunakan **`codegraph`** untuk menjaga keselarasan *knowledge graph* repositori:

1. **SEBELUM Memulai Tugas (Fase Eksplorasi):**
   - Jika direktori `.codegraph/` belum ada di *root* repositori, inisialisasi terlebih dahulu dengan `codegraph init`.
   - Gunakan MCP tool `codegraph_explore` atau jalankan perintah CLI `codegraph explore "<simbol atau pertanyaan>"`, `codegraph query "<kata kunci>"`, atau `codegraph context "<deskripsi tugas>"` sebelum menggunakan `grep`/`find` atau memodifikasi berkas.
   - Analisis struktur modul (`src/app/`, `src/components/`, `src/lib/`, `src/content/docs/`) agar tidak terjadi duplikasi komponen, tipe, atau fungsi.
2. **SESUDAH Menyelesaikan Tugas (Fase Sinkronisasi):**
   - Setiap kali selesai membuat, mengubah, atau menghapus berkas kode/konten/pengujian, wajib menjalankan `codegraph sync` melalui terminal agar indeks `codegraph` selalu mutakhir untuk agen berikutnya.

---

## 2. Siklus Pengembangan Berbasis TDD & Orkestrasi Agen

Pengembangan proyek ini mengikuti alur **Test-Driven Development (Red-Green-Refactor)** yang dibagi ke dalam 3 peran agen spesialis:

1. **Product Manager & Software Architect (`.agents/agents/product-architect/agent.md`):**
   - Menyusun dan memperbarui PRD/TDD (`docs/*.md`), kontrak tipe TypeScript (`src/lib/`), struktur *registry* dokumentasi 6 modul (`src/lib/docs-registry.ts`), kontrak indeks pencarian (`src/lib/search-engine.ts`), serta *task breakdown* untuk QA dan Frontend Engineer.
2. **Quality Assurance / QA Engineer (`.agents/agents/qa-engineer/agent.md`):**
   - **Fase RED:** Menulis *automated test* menggunakan **Vitest** dan **`@testing-library/react`** di `src/__tests__/` berdasarkan `FR-UG-01` s.d. `FR-UG-05`, `NFR-UG-01` s.d. `NFR-UG-03`, dan `AC-UG-01` s.d. `AC-UG-06` sebelum implementasi ditulis.
   - **Fase Verifikasi GREEN:** Memverifikasi seluruh *test suite*, keutuhan tautan navigasi 6 modul, akurasi indeks pencarian `Ctrl+K`, kelengkapan kamus konflik/validasi, serta kesesuaian istilah antarmuka Bahasa Indonesia.
3. **Frontend Engineer (`.agents/agents/frontend-engineer/agent.md`):**
   - **Fase GREEN & Refactor:** Mengimplementasikan rute App Router Next.js (`src/app/`), *registry* & mesin pencarian *client-side* (`src/lib/`), komponen tata letak dokumentasi (`src/components/docs/`), replika interaktif komponen UI Schedovyn (`src/components/replicas/`), serta seluruh artikel panduan MDX pada 6 modul (`src/content/docs/`) hingga seluruh test lulus (**GREEN**) dan `bun run build` berhasil tanpa *error*.

---

## 3. Spesifikasi Tech Stack & Arsitektur Direktori

### 3.1 Tech Stack Wajib
- **Runtime & Package Manager:** **Bun** (`^1.4.0`) — wajib gunakan `bun install`, `bun add`, `bun run dev`, `bun run build`, `bun run test`, `bun run lint`. Dilarang menggunakan `npm`, `yarn`, atau `pnpm`.
- **Core Framework:** **Next.js** (`^16.4.3`) dengan **App Router** (`src/app/`), *React Server Components (RSC)* untuk artikel MDX, dan *Static Pre-rendering* (`generateStaticParams`).
- **UI Library:** **React 19** (*Server Components* secara default; gunakan direktif `"use client"` hanya pada komponen interaktif seperti dialog pencarian `Ctrl+K`, penjelajah kamus konflik, sakelar pintasan keyboard, dan replika interaktif).
- **Bahasa:** **TypeScript** (`strict: true`, **Zero `any` Policy**).
- **Content / Docs Engine:** **MDX** (`@next/mdx` / `next-mdx-remote` / *Fumadocs*) untuk artikel panduan di `src/content/docs/` dengan dukungan komponen React tersemat.
- **Styling & Design System:** **Tailwind CSS v4** (`src/app/globals.css`) dengan gaya **`radix-lyra`**:
  - Sudut tajam (`rounded-none`), garis batas presisi `1px`, tinggi kontrol ringkas (`h-8`), aksen Indigo-Blue (`#1547E6`), tipografi `Figtree Variable` & `Inter Variable`, serta angka `tabular-nums`.
  - Mendukung mode Terang, Gelap, dan Sistem via `next-themes` (termasuk pintasan keyboard `D`) serta aturan cetak `@media print` (`NFR-UG-03`).
- **Komponen UI & Ikon:** **shadcn/ui** (`radix-lyra`) di `src/components/ui/` + **`lucide-react`**.
- **Client-Side Search:** Pencarian instan 100% di sisi klien (`FlexSearch` / `MiniSearch` / `cmdk`) melalui pintasan `Ctrl+K` atau `/`.
- **Testing:** **Vitest** + **`@testing-library/react`**.

### 3.2 Struktur Direktori Standar
```text
schedovyn-user-guide/
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
```

---

## 4. Aturan Konten, Bahasa, & Akurasi Terminologi

1. **Bahasa Indonesia & Bebas *Em Dash*:**
   - Seluruh antarmuka dan isi artikel panduan wajib ditulis dalam **Bahasa Indonesia** yang jelas dan mudah dipahami oleh staf kurikulum/operator sekolah.
   - **Dilarang keras menggunakan karakter *em dash* (`—`)** di seluruh teks artikel panduan dan komponen UI (`NFR-UG-01`).
2. **Kesesuaian Istilah 100% dengan Aplikasi Utama (`AC-UG-05`):**
   - Seluruh label tombol, nama tab, status penyimpanan, dan kode validasi wajib 100% akurat sesuai aplikasi produksi Schedovyn, antara lain:
     - Status Simpan: `"Menyimpan..."`, `"Tersimpan di browser"`, `"Gagal menyimpan lokal"`.
     - Tombol & Aksi: `"Tempatkan ke Jadwal"`, `"Lepas dari Grid"`, `"Batal Perubahan"`, `"Ulangi Perubahan"`, `"Salin Jadwal"`, `"Pasang Aplikasi"`, `"Buka Aplikasi Schedovyn"`.
     - 4 Status Validasi: `CONFLICT_DETECTED` (*Konflik ditemukan*), `INCOMPLETE` (*Belum lengkap*), `NO_CONFLICT_CURRENT_DATA` (*Tidak ada konflik pada data saat ini*), `COMPLETE_AND_VALID` (*Jadwal lengkap dan valid*).
     - 7 Konflik Waktu (Error): `CLASS_OVERLAP`, `TEACHER_OVERLAP`, `ROOM_OVERLAP`, `TEACHER_UNAVAILABLE`, `ROOM_UNAVAILABLE`, `OUTSIDE_OPERATING_HOURS`, `BREAK_TIME_OVERLAP`.
     - 5 Peringatan Kelengkapan (Warning): `UNFULFILLED_REQUIREMENT`, `OVER_SCHEDULED_SESSION`, `MISSING_TEACHER`, `MISSING_REQUIRED_ROOM`, `UNCONFIGURED_CLASS`.
3. **Konfigurasi URL Lintas Proyek:**
   - Gunakan `NEXT_PUBLIC_APP_URL` untuk tautan tombol **"Buka Aplikasi Schedovyn"** (`AC-UG-06`) dan `NEXT_PUBLIC_LANDING_URL` untuk tautan ke Landing Page.

---

## 5. Git Protocol & Version Control Guidelines

Setiap *AI Agent* wajib mematuhi protokol Git berikut untuk menjaga kebersihan riwayat *commit*, integritas *working tree*, dan keterlacakan terhadap spesifikasi PRD/TDD:

1. **Format Pesan Commit (*Conventional Commits*):**
   - Gunakan format `<type>(<scope>): <deskripsi singkat>` dalam bahasa Inggris atau Bahasa Indonesia yang konsisten dan jelas:
     - `feat(docs)`: Penambahan modul/artikel panduan MDX baru atau fitur portal dokumentasi.
     - `feat(replicas)`: Penambahan komponen replika interaktif UI Schedovyn (`src/components/replicas/`).
     - `feat(search)`: Penambahan atau peningkatan fitur pencarian instan *client-side* (`Ctrl+K`).
     - `test(qa)`: Penambahan atau pembaruan pengujian otomatis Vitest (`src/__tests__/`).
     - `fix(<scope>)`: Perbaikan *bug* komponen, tautan rusak (*broken links*), atau ketidaksesuaian istilah UI.
     - `docs(arch)`: Pembaruan dokumen PRD, TDD, atau protokol agen (`docs/`, `AGENTS.md`).
     - `chore(<scope>)`: Pembaruan konfigurasi, dependensi (`bun.lock`), atau aturan *build/lint*.
   - Sertakan referensi ID persyaratan pada isi/deskripsi *commit* bila relevan (contoh: `Refs: FR-UG-02, AC-UG-03`).

2. **Atomic Commits Selaras Siklus TDD:**
   - Buat *commit* secara atomik per unit pekerjaan yang utuh (misalnya: pisahkan *commit* kontrak/dokumen arsitektur, *commit* pengujian `RED` oleh QA Engineer, dan *commit* implementasi `GREEN` oleh Frontend Engineer).
   - Jangan menggabungkan perubahan yang tidak saling berkaitan di dalam satu *commit*.

3. **Quality Gate Wajib Sebelum Commit (Fase GREEN):**
   - Sebelum melakukan *commit* pada kode implementasi atau konten MDX, pastikan seluruh pemeriksaan berikut berjalan sukses:
     1. `codegraph sync` (memastikan indeks *knowledge graph* sinkron dengan perubahan terakhir).
     2. `bun run lint` (0 *error* ESLint).
     3. `bun run test` (seluruh *test suite* Vitest berstatus `GREEN`).
     4. `bun run build` (memastikan seluruh rute `/docs/[[...slug]]` berhasil di-*pre-render* secara statis dengan 0 *error* TypeScript sesuai `AC-UG-01`).

4. **Kebersihan *Working Tree* & Berkas Terlarang:**
   - **Wajib mempertahankan blok `<!-- BEGIN:nextjs-agent-rules --> ... <!-- END:nextjs-agent-rules -->`** di bagian atas `AGENTS.md` agar `next dev` tidak menimbulkan *uncommitted diff* berulang.
   - Jangan pernah melakukan *commit* pada berkas rahasia (`.env`, `.env.local`), artefak hasil *build* (`.next/`, `out/`, `coverage/`), atau direktori sementara yang sudah diatur di `.gitignore`.

5. **Keamanan Operasi Git:**
   - **Dilarang keras** menjalankan perintah Git destruktif seperti `git push --force`, `git reset --hard`, `git clean -fd`, atau mengubah riwayat *commit* yang sudah dipublikasikan tanpa instruksi eksplisit dari pengguna.
   - Selalu periksa `git status` dan `git diff` sebelum membuat *commit* untuk memastikan tidak ada perubahan tak disengaja atau karakter *em dash* (`—`) yang lolos ke dalam repositori.
