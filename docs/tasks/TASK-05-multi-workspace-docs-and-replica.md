# TASK-05: Dokumentasi Multi-Ruang Kerja (`FR-13`), Indeks Pencarian, & Komponen `WorkspaceSwitcherReplica`

| Informasi Task | Detail |
|---|---|
| **ID Task** | `TASK-05` |
| **Judul Task** | Implementasi Komponen `WorkspaceSwitcherReplica`, Penambahan Artikel Panduan `2.4 Mengelola Multi-Ruang Kerja & Duplikasi Semester`, Pembaruan Indeks Pencarian `MiniSearch`, & Pembaruan Studi Kasus Terpadu |
| **Pelaksana Fase RED** | **QA Engineer** (`.agents/agents/qa-engineer/agent.md`) |
| **Pelaksana Fase GREEN** | **Frontend Engineer** (`.agents/agents/frontend-engineer/agent.md`) |
| **Dokumen Acuan** | [Schedovyn-User-Guide-PRD.md](../Schedovyn-User-Guide-PRD.md) (v1.2.0), [Schedovyn-User-Guide-TDD.md](../Schedovyn-User-Guide-TDD.md) (v1.1.0), [Schedovyn-PRD.md](../Schedovyn-PRD.md) (v1.1.0), [Schedovyn-TDD.md](../Schedovyn-TDD.md) (v1.1.0), [AGENTS.md](../../AGENTS.md) |
| **Cakupan Persyaratan** | `FR-13`, `AC-14`, `FR-UG-02`, `FR-UG-03`, `FR-UG-05`, `NFR-UG-01`, `NFR-UG-02`, `NFR-UG-03`, `AC-UG-01`, `AC-UG-02`, `AC-UG-03`, `AC-UG-05`, `AC-UG-07` |

---

## 1. Konteks & Tujuan Fitur

### 1.1 Hasil Telusur Codebase (`codegraph explore` pada Baseline `TASK-04`)
Berdasarkan hasil eksplorasi `codegraph explore` pada repositori saat ini:
- **Registry Dokumentasi (`src/lib/docs-registry.ts`):** Saat ini `DOCS_MODULES` mendaftarkan 21 artikel MDX pada 6 modul (`Modul 02` memiliki 3 artikel: `2.1`, `2.2`, dan `2.3`). Artikel `2.4` (`kelola-multi-ruang-kerja.mdx`) belum terdaftar.
- **Mesin Pencarian Client-Side (`src/lib/search-engine.ts` & `src/components/docs/SearchCommandDialog.tsx`):** `ARTICLE_KEYWORDS` dan `DEFAULT_SEARCHABLE_SECTIONS` baru mengindeks 21 artikel dan belum memuat kata kunci fitur pengelolaan multi-ruang kerja (`BLANK`, `SEED_DEFAULT`, `MASTER_DATA_ONLY`, `FULL_COPY`, `"duplikasi ruang kerja"`).
- **Komponen Replika Interaktif (`src/components/replicas/` & `src/lib/mdx-loader.ts`):** Saat ini terdapat 5 komponen replika (`ValidationStatusBadgesReplica`, `ConflictDictionaryExplorer`, `SaveStatusBadgeReplica`, `SessionBlockOverlapReplica`, `KeyboardShortcutSwitch`). Komponen ke-6 (`WorkspaceSwitcherReplica.tsx`) belum diimplementasikan maupun didaftarkan pada `mdxComponents`.
- **Konten Artikel MDX (`src/content/docs/`):** Berkas `02-ruang-kerja-dan-data-master/kelola-multi-ruang-kerja.mdx` belum tersedia di disk, dan studi kasus `06-penyimpanan-pwa-dan-pintasan/studi-kasus-smp-nusantara.mdx` belum menyertakan langkah duplikasi ruang kerja untuk persiapan semester berikutnya.

### 1.2 Referensi Persyaratan PRD & TDD
- **`FR-13` & `AC-14` (Schedovyn PRD & TDD v1.1.0):** Mendukung pembuatan, pengelolaan, duplikasi (`MASTER_DATA_ONLY` & `FULL_COPY`), perpindahan (*Workspace Switcher*), isolasi evaluasi konflik & transaksi IndexedDB per `workspaceId`, reset tumpukan riwayat *Undo/Redo* saat berpindah ruang kerja, pemulihan ruang kerja aktif terakhir (`schedovyn_active_workspace_id`), serta proteksi penghapusan ruang kerja terakhir.
- **`PRD Bab 4 Modul 2.4` & `TDD Bab 2.2`:** Penambahan rute artikel ke-22 `/docs/02-ruang-kerja-dan-data-master/kelola-multi-ruang-kerja` (`Order 2.4`).
- **`FR-UG-03` & `TDD Bab 6.6` (`WorkspaceSwitcherReplica.tsx`):** Komponen replika visual interaktif untuk menyimulasikan *Workspace Switcher*, mode inisialisasi ruang kerja baru (`BLANK` vs `SEED_DEFAULT`), mode duplikasi ruang kerja (`MASTER_DATA_ONLY` vs `FULL_COPY`), dan aturan proteksi hapus ruang kerja tunggal.
- **`FR-UG-02` & `AC-UG-03`:** Pencarian instan `Ctrl+K` wajib menemukan artikel multi-ruang kerja saat pengguna mengetik kata kunci seperti `"duplikasi ruang kerja"`, `"semester baru"`, atau `"MASTER_DATA_ONLY"`.
- **`FR-UG-05`, `AC-UG-05`, `AC-UG-07`, & `NFR-UG-01`:** Seluruh teks artikel dan komponen replika wajib 100% menggunakan istilah Bahasa Indonesia resmi Schedovyn dan **bebas dari karakter *em dash* (`\u2014`)**.

### 1.3 Kebutuhan Pengguna Sekolah yang Diselesaikan
Wakil Kepala Sekolah Bidang Kurikulum dan Staf Kurikulum membutuhkan panduan praktis untuk menyiapkan jadwal semester baru (misalnya dari Semester Ganjil ke Semester Genap) tanpa harus menginput ulang puluhan data kelas, guru, mata pelajaran, ruangan, dan kebutuhan pembelajaran mingguan dari awal, sekaligus memahami cara membuat ruang kerja simulasi yang terisolasi tanpa merusak jadwal resmi yang sedang berjalan.

---

## 2. Kontrak Data & Arsitektur Teknis (Next.js App Router)

### 2.1 Pembaruan Registry Dokumentasi (`src/lib/docs-registry.ts`)
Tambahkan entri artikel ke-4 (`Order "2.4"`) di dalam grup `Modul 02` (`02-ruang-kerja-dan-data-master`) pada `DOCS_MODULES`, sehingga `getAllDocArticles()` mengembalikan **22 artikel**:

```ts
createArticle(
  "02",
  "02-ruang-kerja-dan-data-master",
  "Persiapan Ruang Kerja & Data Master",
  "2.4",
  "kelola-multi-ruang-kerja",
  "Mengelola Multi-Ruang Kerja & Duplikasi Semester",
  "Cara membuat ruang kerja baru, menduplikasi data master untuk semester baru atau simulasi jadwal, berpindah ruang kerja aktif, dan memahami aturan isolasi data lokal."
),
```

### 2.2 Pembaruan Indeks Pencarian (`src/lib/search-engine.ts` & `src/components/docs/SearchCommandDialog.tsx`)
1. Pada `src/lib/search-engine.ts`, tambahkan pemetaan kata kunci di dalam `ARTICLE_KEYWORDS`:
   ```ts
   "02-ruang-kerja-dan-data-master/kelola-multi-ruang-kerja": [
     "multi-workspace",
     "workspace switcher",
     "ruang kerja baru",
     "duplikasi ruang kerja",
     "clone workspace",
     "semester baru",
     "semester genap",
     "BLANK",
     "SEED_DEFAULT",
     "MASTER_DATA_ONLY",
     "FULL_COPY",
     "Ruang Kerja Kosong",
     "Muat Data Contoh",
     "Konfigurasi & Data Master Saja",
     "Salin Penuh Beserta Jadwal",
     "schedovyn_active_workspace_id",
     "hapus ruang kerja",
     "isolasi ruang kerja",
   ],
   ```
2. Pada `src/components/docs/SearchCommandDialog.tsx`, perbarui konstanta `POPULAR_KEYWORDS` agar menyertakan `"duplikasi ruang kerja"`:
   ```ts
   export const POPULAR_KEYWORDS: readonly string[] = [
     "istirahat",
     "konflik guru",
     "salin jadwal",
     "duplikasi ruang kerja",
     "excel",
     "undo",
   ];
   ```

### 2.3 Kontrak Komponen Replika Interaktif `src/components/replicas/WorkspaceSwitcherReplica.tsx` (`"use client"`)
Komponen `WorkspaceSwitcherReplica` wajib menggunakan direktif `"use client"`, mematuhi estetika `radix-lyra` (`rounded-none`, garis batas `1px`, tinggi kontrol `h-8`, angka `tabular-nums`, bebas karakter *em dash*), dan dibungkus dalam bingkai berlabel `"PERAGA INTERAKTIF ANTARMUKA SCHEDOVYN"`:

```ts
export type WorkspaceInitModeReplica = "BLANK" | "SEED_DEFAULT";
export type WorkspaceDuplicateModeReplica = "MASTER_DATA_ONLY" | "FULL_COPY";

export interface ReplicaWorkspaceItem {
  readonly id: string;
  readonly name: string;
  readonly academicPeriod: string;
  readonly snapIntervalMinutes: 5 | 10 | 15 | 30 | 60;
  readonly classesCount: number;
  readonly teachersCount: number;
  readonly scheduledSessionsCount: number;
  readonly unscheduledSessionsCount: number;
  readonly validationStatusLabel: string;
}

export interface WorkspaceSwitcherReplicaProps {
  readonly initialWorkspaceId?: string;
  readonly initialInitMode?: WorkspaceInitModeReplica;
  readonly initialDuplicateMode?: WorkspaceDuplicateModeReplica;
}
```

Komponen wajib menyediakan 4 bagian simulasi interaktif:
1. **Simulasi Pemilih Ruang Kerja Aktif (*Workspace Switcher*):**
   - Menyediakan minimal 2 ruang kerja contoh yang dapat dipilih melalui tombol:
     - `ws-ganjil`: `"SMP Negeri 1 Nusantara"` (`"Semester Ganjil 2026/2027"`, `2 Kelas`, `3 Guru`, `12 Sesi Terjadwal`, `0 Belum Terjadwal`, status `"Jadwal lengkap dan valid"`).
     - `ws-genap`: `"SMP Negeri 1 Nusantara"` (`"Semester Genap 2026/2027"`, `2 Kelas`, `3 Guru`, `0 Sesi Terjadwal`, `12 Belum Terjadwal`, status `"Belum lengkap"`).
   - Saat pengguna mengeklik ruang kerja lain, tampilkan indikator bahwa:
     - Preferensi ruang kerja aktif disimpan ke `localStorage` (`schedovyn_active_workspace_id`).
     - Perhitungan konflik dan validasi kelengkapan terisolasi khusus pada `workspaceId` aktif.
     - Tumpukan riwayat *Undo/Redo* otomatis direset (`Riwayat Undo/Redo: 0 langkah (Direset saat berpindah ruang kerja)`).
2. **Simulasi Mode Pembuatan Ruang Kerja Baru (`WorkspaceInitMode`):**
   - Sakelar tombol interaktif antara:
     - **`"Ruang Kerja Kosong"`** (kode sistem: `BLANK`): Menampilkan penjelasan bahwa ruang kerja baru diinisialisasi dengan konfigurasi hari Senin s.d. Jumat aktif, Sabtu s.d. Minggu libur, `0` data master, dan `0` sesi terjadwal.
     - **`"Muat Data Contoh"`** (kode sistem: `SEED_DEFAULT`): Menampilkan penjelasan bahwa ruang kerja baru diisi data contoh `SMP Negeri 1 Nusantara` menggunakan identitas entitas unik (UUID v4 baru) sehingga tidak menimpa ruang kerja lain di IndexedDB.
3. **Simulasi Mode Duplikasi Ruang Kerja (`WorkspaceDuplicateMode`):**
   - Sakelar tombol interaktif antara:
     - **`"Konfigurasi & Data Master Saja"`** (kode sistem: `MASTER_DATA_ONLY`): Menyalin konfigurasi jam belajar, kelas, guru, mata pelajaran, ruangan, dan kebutuhan pembelajaran mingguan dengan pemetaan ulang ID (`Map<string, string>`), sementara jadwal sesi dikosongkan (`sessions = []`) agar siap dijadwalkan ulang untuk semester baru.
     - **`"Salin Penuh Beserta Jadwal"`** (kode sistem: `FULL_COPY`): Menyalin seluruh konfigurasi, data master, kebutuhan pembelajaran, beserta seluruh posisi sesi terjadwal di grid untuk simulasi perubahan jadwal atau pencadangan lokal.
4. **Simulasi Proteksi Penghapusan Ruang Kerja Terakhir:**
   - Menyediakan sakelar simulasi jumlah ruang kerja di browser (`"Simulasi: 2 Ruang Kerja Tersimpan"` vs `"Simulasi: 1 Ruang Kerja Tersisa"`).
   - Menampilkan tombol `"Hapus Ruang Kerja"`:
     - Aktif (`enabled`) ketika terdapat `2` ruang kerja.
     - Nonaktif (`disabled`) ketika hanya tersisa `1` ruang kerja, disertai keterangan proteksi: `"Sistem wajib mempertahankan minimal satu ruang kerja aktif"`.

### 2.4 Pendaftaran Komponen di `src/lib/mdx-loader.ts`
Impor `WorkspaceSwitcherReplica` dari `@/components/replicas/WorkspaceSwitcherReplica` dan daftarkan ke dalam objek `mdxComponents` pada `src/lib/mdx-loader.ts` agar dapat langsung digunakan di dalam berkas `.mdx`.

### 2.5 Spesifikasi Berkas MDX Baru & Pembaruan Berkas MDX Eksisting
1. **[BARU] `src/content/docs/02-ruang-kerja-dan-data-master/kelola-multi-ruang-kerja.mdx` (`Order "2.4"`):**
   - **Frontmatter:**
     ```yaml
     ---
     title: "Mengelola Multi-Ruang Kerja & Duplikasi Semester"
     description: "Cara membuat ruang kerja baru, menduplikasi data master untuk semester baru atau simulasi jadwal, berpindah ruang kerja aktif, dan memahami aturan isolasi data lokal."
     order: "2.4"
     ---
     ```
   - **Sub-judul Wajib (`H2`):**
     - `## Pemilih Ruang Kerja Aktif (Workspace Switcher)`
     - `## Membuat Ruang Kerja Baru (BLANK vs SEED_DEFAULT)`
     - `## Menduplikasi Ruang Kerja untuk Semester Baru (MASTER_DATA_ONLY vs FULL_COPY)`
     - `## Aturan Isolasi Data, Reset Riwayat Undo/Redo, dan Penghapusan Ruang Kerja`
   - **Komponen Tersemat Wajib:** `<WorkspaceSwitcherReplica />`, `<StepList>`, `<Callout>`.
   - **Istilah Wajib:** `"Ruang Kerja Kosong"`, `"Muat Data Contoh"`, `"Konfigurasi & Data Master Saja"`, `"Salin Penuh Beserta Jadwal"`, `"Hapus Ruang Kerja"`, `BLANK`, `SEED_DEFAULT`, `MASTER_DATA_ONLY`, `FULL_COPY`, `schedovyn_active_workspace_id`.

2. **[PEMBARUAN KONTEKSTUAL] 5 Berkas MDX Eksisting:**
   - `01-pengenalan/mengenal-schedovyn.mdx`: Tambahkan penjelasan singkat bahwa pengguna dapat memiliki lebih dari satu ruang kerja lokal (*multi-workspace*) di browser dengan evaluasi konflik yang terisolasi penuh di dalam ruang kerja aktif.
   - `01-pengenalan/tata-letak-aplikasi.mdx`: Tambahkan penjelasan fungsi **Pemilih Ruang Kerja Aktif (*Workspace Switcher*)** pada bagian *Header Bar*.
   - `03-menyusun-jadwal-editor/riwayat-undo-dan-redo.mdx`: Tambahkan penjelasan bahwa tumpukan riwayat *Undo/Redo* berlaku spesifik untuk ruang kerja yang sedang aktif dan otomatis direset menjadi kosong saat pengguna berpindah ruang kerja melalui *Workspace Switcher*.
   - `06-penyimpanan-pwa-dan-pintasan/penyimpanan-otomatis-indexeddb.mdx`: Tambahkan penjelasan bagaimana database `schedovyn_local_db` mengisolasi data multi-ruang kerja menggunakan kunci `workspaceId` dan menyimpan ruang kerja aktif terakhir pada `localStorage` (`schedovyn_active_workspace_id`).
   - `06-penyimpanan-pwa-dan-pintasan/studi-kasus-smp-nusantara.mdx`: Tambahkan langkah ke-7 pada `<StepList>` mengenai cara menduplikasi ruang kerja `SMP Negeri 1 Nusantara` dari Semester Ganjil ke Semester Genap menggunakan mode **Konfigurasi & Data Master Saja (`MASTER_DATA_ONLY`)**, serta sematkan `<WorkspaceSwitcherReplica initialDuplicateMode="MASTER_DATA_ONLY" />`.

---

## 3. Acceptance Criteria (Given-When-Then)

1. **Skenario 1: Pendaftaran 22 Artikel & Urutan Navigasi Modul 02 (`AC-UG-01`, `AC-UG-02`)**
   - **Given** `getAllDocArticles()` dipanggil dari `src/lib/docs-registry.ts`,
   - **When** daftar artikel diperiksa,
   - **Then** total artikel berjumlah `22`, artikel `2.4` memiliki `href: "/docs/02-ruang-kerja-dan-data-master/kelola-multi-ruang-kerja"`, dan `getAdjacentArticles` menghubungkan `2.3` $\leftrightarrow$ `2.4` $\leftrightarrow$ `3.1` tanpa tautan rusak.

2. **Skenario 2: Interaktivitas Komponen `WorkspaceSwitcherReplica` (`FR-UG-03`, `AC-UG-05`, `AC-UG-07`)**
   - **Given** komponen `<WorkspaceSwitcherReplica />` dirender,
   - **When** pengguna berpindah ruang kerja aktif, mengganti mode inisialisasi (`"Ruang Kerja Kosong"` vs `"Muat Data Contoh"`), mengganti mode duplikasi (`"Konfigurasi & Data Master Saja"` vs `"Salin Penuh Beserta Jadwal"`), serta menguji simulasi sisa 1 ruang kerja,
   - **Then** komponen menampilkan kode sistem (`BLANK`, `SEED_DEFAULT`, `MASTER_DATA_ONLY`, `FULL_COPY`), informasi reset riwayat *Undo/Redo* (`0 langkah`), serta menonaktifkan tombol `"Hapus Ruang Kerja"` saat hanya tersisa 1 ruang kerja aktif.

3. **Skenario 3: Pencarian Instan `Ctrl+K` untuk Topik Multi-Ruang Kerja (`FR-UG-02`, `AC-UG-03`)**
   - **Given** pengguna membuka dialog pencarian `SearchCommandDialog` (`Ctrl+K`),
   - **When** pengguna mengetik `"duplikasi ruang kerja"` atau `"MASTER_DATA_ONLY"`,
   - **Then** hasil pencarian menampilkan artikel `"Mengelola Multi-Ruang Kerja & Duplikasi Semester"` di bawah grup Modul 02 dan menavigasi ke `/docs/02-ruang-kerja-dan-data-master/kelola-multi-ruang-kerja` saat diklik.

4. **Skenario 4: Kelengkapan Berkas MDX `2.4` & Studi Kasus `6.4` (`FR-UG-05`, `AC-UG-07`)**
   - **Given** berkas `02-ruang-kerja-dan-data-master/kelola-multi-ruang-kerja.mdx` dan `06-penyimpanan-pwa-dan-pintasan/studi-kasus-smp-nusantara.mdx` diperiksa,
   - **When** dikompilasi melalui `compileDocArticle()`,
   - **Then** kedua berkas menyematkan `<WorkspaceSwitcherReplica`, memuat istilah resmi multi-workspace, dan berhasil dikompilasi menjadi elemen React beserta daftar isi `headings`.

5. **Skenario 5: Kepatuhan Bebas Karakter Em Dash (`NFR-UG-01`)**
   - **Given** seluruh 22 berkas MDX dan komponen `WorkspaceSwitcherReplica.tsx` diperiksa,
   - **When** dipindai terhadap karakter `\u2014` (*em dash*),
   - **Then** ditemukan `0` karakter *em dash*.

6. **Skenario 6: Kompilasi Statis Next.js Tanpa Error (`AC-UG-01`, `NFR-UG-02`)**
   - **Given** seluruh perubahan kode dan konten telah selesai,
   - **When** perintah `bun run build` dijalankan,
   - **Then** seluruh rute dokumentasi (termasuk `/docs/02-ruang-kerja-dan-data-master/kelola-multi-ruang-kerja`) berhasil di-*pre-render* secara statis dengan `0` error TypeScript dan `0` error ESLint.

---

## 4. Breakdown Task Eksekusi (TDD Roadmap)

### Langkah 0: Eksplorasi Konteks dengan `codegraph` (Wajib Sebelum Eksekusi)
Sebelum menulis pengujian atau kode implementasi, jalankan:
```bash
codegraph explore "DOCS_MODULES DEFAULT_SEARCHABLE_SECTIONS mdxComponents"
```

---

### Fase 1: Task QA Engineer (Fase RED)

**QA Engineer** wajib memperbarui 3 berkas pengujian di `src/__tests__/` terlebih dahulu dan memastikan pengujian gagal (**RED**) sebelum Frontend Engineer menulis implementasi:

1. **Perbarui `src/__tests__/interactive-replicas.test.tsx`:**
   - Impor `WorkspaceSwitcherReplica` dari `@/components/replicas/WorkspaceSwitcherReplica`.
   - Tambahkan blok `describe("6. WorkspaceSwitcherReplica (FR-UG-03, AC-UG-05, AC-UG-07)")`:
     - Menguji perpindahan ruang kerja aktif (misal dari `"Semester Ganjil 2026/2027"` ke `"Semester Genap 2026/2027"`), memverifikasi tampilan kunci `schedovyn_active_workspace_id` dan indikator reset riwayat *Undo/Redo* (`0 langkah`).
     - Menguji sakelar mode inisialisasi ruang kerja baru antara `"Ruang Kerja Kosong"` (`BLANK`) dan `"Muat Data Contoh"` (`SEED_DEFAULT`).
     - Menguji sakelar mode duplikasi ruang kerja antara `"Konfigurasi & Data Master Saja"` (`MASTER_DATA_ONLY`) dan `"Salin Penuh Beserta Jadwal"` (`FULL_COPY`).
     - Menguji simulasi proteksi penghapusan ruang kerja terakhir: tombol `"Hapus Ruang Kerja"` berstatus `not.toBeDisabled()` saat simulasi 2 ruang kerja, dan menjadi `toBeDisabled()` saat beralih ke simulasi `"Simulasi: 1 Ruang Kerja Tersisa"`.
   - Tambahkan asersi bahwa `WorkspaceSwitcherReplica` tidak memuat karakter *em dash* (`\u2014`).

2. **Perbarui `src/__tests__/search-command-dialog.test.tsx`:**
   - Tambahkan pengujian kata kunci `"duplikasi ruang kerja"` pada `SearchCommandDialog` yang memverifikasi munculnya hasil `"Mengelola Multi-Ruang Kerja & Duplikasi Semester"`.

3. **Perbarui `src/__tests__/mdx-content-integrity.test.ts`:**
   - Ubah ekspektasi jumlah total artikel pada `getAllDocArticles()` dari `21` menjadi `22`.
   - Tambahkan `"02-ruang-kerja-dan-data-master/kelola-multi-ruang-kerja.mdx": "<WorkspaceSwitcherReplica"` ke dalam `REQUIRED_REPLICA_BINDINGS`.
   - Tambahkan pemeriksaan istilah resmi `"Ruang Kerja Kosong"`, `"Muat Data Contoh"`, `"Konfigurasi & Data Master Saja"`, dan `"Salin Penuh Beserta Jadwal"` pada berkas `02-ruang-kerja-dan-data-master/kelola-multi-ruang-kerja.mdx`.
   - Tambahkan pemeriksaan bahwa `06-penyimpanan-pwa-dan-pintasan/studi-kasus-smp-nusantara.mdx` memuat `"MASTER_DATA_ONLY"` dan `<WorkspaceSwitcherReplica`.

---

### Fase 2: Task Frontend Engineer (Fase GREEN & Refactor)

Setelah pengujian Fase RED dibuat oleh QA Engineer, **Frontend Engineer** mengeksekusi implementasi berikut secara berurutan hingga seluruh pengujian berstatus **GREEN**:

1. **Perbarui `src/lib/docs-registry.ts`:**
   - Tambahkan artikel `2.4` (`kelola-multi-ruang-kerja`, `"Mengelola Multi-Ruang Kerja & Duplikasi Semester"`) ke dalam daftar `articles` pada `Modul 02`.
2. **Perbarui `src/lib/search-engine.ts` & `src/components/docs/SearchCommandDialog.tsx`:**
   - Tambahkan kata kunci `"02-ruang-kerja-dan-data-master/kelola-multi-ruang-kerja"` pada `ARTICLE_KEYWORDS` di `src/lib/search-engine.ts`.
   - Tambahkan `"duplikasi ruang kerja"` ke `POPULAR_KEYWORDS` di `src/components/docs/SearchCommandDialog.tsx`.
3. **Buat Komponen `src/components/replicas/WorkspaceSwitcherReplica.tsx` & Daftarkan di `src/lib/mdx-loader.ts`:**
   - Implementasikan `WorkspaceSwitcherReplica.tsx` sesuai kontrak pada Bagian 2.3.
   - Daftarkan `WorkspaceSwitcherReplica` ke dalam `mdxComponents` di `src/lib/mdx-loader.ts`.
4. **Tulis Artikel Baru & Perbarui 5 Artikel MDX Eksisting di `src/content/docs/`:**
   - Buat berkas `src/content/docs/02-ruang-kerja-dan-data-master/kelola-multi-ruang-kerja.mdx` (`Order "2.4"`).
   - Perbarui `01-pengenalan/mengenal-schedovyn.mdx`, `01-pengenalan/tata-letak-aplikasi.mdx`, `03-menyusun-jadwal-editor/riwayat-undo-dan-redo.mdx`, `06-penyimpanan-pwa-dan-pintasan/penyimpanan-otomatis-indexeddb.mdx`, dan `06-penyimpanan-pwa-dan-pintasan/studi-kasus-smp-nusantara.mdx` sesuai spesifikasi Bagian 2.5.
5. **Verifikasi Kualitas Akhir & Sinkronisasi `codegraph`:**
   Jalankan seluruh perintah quality gate berikut dan pastikan semuanya lulus (`0` error, `100% GREEN`):
   ```bash
   bun run typecheck
   bun run test
   bun run lint
   bun run build
   codegraph sync
   ```
