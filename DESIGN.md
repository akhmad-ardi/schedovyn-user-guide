# DESIGN.md: Sistem Desain & Panduan Visual Schedovyn User Guide

| Atribut Desain | Ketetapan |
|---|---|
| **Nama Proyek** | Schedovyn User Guide & Documentation Portal |
| **Produk Induk** | Schedovyn (*Smart Timetable Planner*) |
| **Gaya Desain Acuan** | `radix-lyra` (*Architectural Technical Grid*) |
| **Framework & Styling** | Next.js (App Router) + Tailwind CSS v4 (OKLCH Tokens) + shadcn/ui (`radix-lyra`) |
| **Bahasa Antarmuka** | Bahasa Indonesia (Bebas karakter *em dash* sesuai `R-02` & `NFR-UG-01`) |
| **Dial Liveliness (`antislop`)** | `Dial: ENERGY 2 / RHYTHM 2 / MOTION 1` |

---

## 1. Design Read & Identitas Visual (`R-20`, `R-31`, `R-37`)

> **Design Read:**
> Reading this as: *Technical Documentation Portal & Interactive Reference Manual* for *Staf Kurikulum, Operator Sekolah, Wakil Kepala Sekolah Bidang Kurikulum, dan Guru Penyusun Jadwal*, in a *`radix-lyra` Architectural Technical Grid* style, dial `ENERGY 2 / RHYTHM 2 / MOTION 1`.

### 1.1 Karakter & Kepribadian Produk
**Schedovyn User Guide** bukan halaman pemasaran generik dan bukan dokumentasi developer bergaya terminal gelap. Portal ini adalah **Buku Pedoman Operasional & Kamus Referensi Akademik** yang dibuka berdampingan dengan editor jadwal Schedovyn.

Karakter utamanya:
1. **Presisi Arsitektural (`Architectural Technical Grid`):** Menggunakan garis batas struktural `1px`, sudut tajam `0px` (`rounded-none`), dan tata letak berlajur tegas yang mencerminkan grid jadwal pelajaran sekolah.
2. **Keakuratan Visual 1:1 dengan Aplikasi Utama:** Setiap replika lencana status, blok sesi, dan tombol di dalam panduan memiliki proporsi, warna, serta label Bahasa Indonesia yang identik dengan aplikasi produksi Schedovyn.
3. **Tenang, Terstruktur, dan Mudah Dipindai:** Mengutamakan kejelasan hierarki bacaan, keterbacaan tabel kamus konflik, dan kecepatan menemukan solusi saat staf sekolah menghadapi bentrokan jadwal.

### 1.2 Penetapan Tiga Dial Liveliness (`antislop` Part 3)
`Dial: ENERGY 2 / RHYTHM 2 / MOTION 1`

- **ENERGY 2 (Balanced & Authoritative):**
  - *Alasan tertulis (`R-31`):* Staf sekolah membaca panduan sambil bekerja di editor jadwal; antarmuka membutuhkan kontras tipografi yang tegas dan replika UI yang hidup tanpa warna neon atau ornamen berlebihan yang mengalihkan fokus.
- **RHYTHM 2 (Consistent Structure with Functional Variation):**
  - *Alasan tertulis (`R-31`):* Halaman dokumentasi menjaga posisi navigasi yang konsisten agar mudah dipelajari, namun komposisi di dalam artikel bervariasi secara fungsional mengikuti jenis materi (urutan langkah `<StepList>`, kotak peringatan `<Callout>`, matriks referensi, dan replika interaktif).
- **MOTION 1 (Instant & Functional State Transitions Only):**
  - *Alasan tertulis (`R-31`):* Navigasi antar-bab (`< 50 ms`), pembukaan pencarian `Ctrl+K`, dan pemfilteran kamus konflik wajib merespons secara instan; animasi *looping*, *floating*, *bounce*, atau *scroll-reveal* kosmetik dilarang sepenuhnya (`R-19`).

### 1.3Lima Pengungkit Identitas (*Liveliness Levers*)
1. **Satu Titik Fokus per Layar (*One Focal Point*):**
   - Pada Beranda Portal (`/`): Bilah pencarian cepat `Ctrl+K` dan jalur *Panduan Mulai Cepat 10 Menit* menjadi fokus utama, diikuti peta 6 modul.
   - Pada Halaman Artikel (`/docs/[[...slug]]`): Kolom artikel tengah (`max-w-3xl`) adalah titik fokus utama; `DocsSidebar` di kiri dan `TableOfContents` di kanan menggunakan teks berukuran lebih ringkas (`text-xs` / `text-sm`) dan warna sekunder.
2. **Kontras Hierarkis (*Hierarchical Contrast*):**
   - Pembedaan tegas antara judul bab (`Figtree Variable` tebal), isi penjelasan (`Inter Variable` reguler), nomor urutan langkah (`tabular-nums`), dan kode teknis validasi (`monospace`).
3. **Ruang Kosong sebagai Struktur (*Whitespace as Structure*):**
   - Pemisahan antar-seksi tidak mengandalkan kartu bertumpuk, melainkan kombinasi garis pembatas `1px solid` dan jarak vertikal terukur (`py-8` hingga `py-12`).
4. **Satu Aksen Sengaja (*One Deliberate Accent*):**
   - Warna **Indigo-Blue (`#1547E6`)** hanya digunakan pada momen kunci: tombol CTA utama `"Buka Aplikasi Schedovyn"`, penanda halaman aktif pada `DocsSidebar` dan `TableOfContents`, nomor aktif pada `<StepList>`, serta cincin fokus keyboard (`focus-visible:ring-2`).
5. **Motif Identitas (*Identity Motif*):**
   - Sudut tajam `0px` (`rounded-none`), sambungan garis presisi `1px` (*hairline technical grid*), tinggi kontrol `h-8` (`32px`), serta penomoran `tabular-nums` berbingkai kotak `1px` yang konsisten di seluruh halaman.

---

## 2. Sistem Warna & Token Tema (`R-01`, `R-21`, `R-25`, `R-29`, `R-34`)

### 2.1 Alasan Pemilihan Palet (`R-31`)
- **Mengapa Netral Slate/Zinc + Aksen Tunggal Indigo-Blue (`#1547E6`)?**
  Menjaga permukaan baca tetap bersih dengan rasio kontras melampaui standar WCAG AA (`>= 4.5:1` untuk teks normal, `>= 7:1` untuk isi artikel utama) serta mengisolasi warna aksen hanya untuk penanda aksi dan navigasi aktif (`R-25`, `R-29`).
- **Mengapa 4 Warna Status Semantik (Merah, Kuning/Amber, Biru, Hijau/Emerald)?**
  Bukan dekorasi halaman, melainkan representasi fungsional yang wajib 100% akurat dengan 4 status validasi jadwal, 7 konflik waktu (*Error*), dan 5 peringatan kelengkapan (*Warning*) di aplikasi Schedovyn (`AC-UG-04`).
- **Mengapa Mendukung Mode Terang & Gelap dengan Toggle Aktif (`R-21`, `R-34`)?**
  Staf sekolah menggunakan aplikasi di kondisi pencahayaan ruang guru yang beragam; portal menyediakan Mode Terang sebagai tampilan awal yang ramah cetak dan Mode Gelap presisi tinggi melalui `next-themes` (dapat diganti lewat tombol header atau pintasan keyboard `D`).

### 2.2 Token Warna Inti (`src/app/globals.css`)

| Token Semantik | Mode Terang (Light) | Mode Gelap (Dark) | Fungsi & Alasan Penggunaan (`R-31`) |
|---|---|---|---|
| `--background` | `#FFFFFF` (`oklch(1 0 0)`) | `#0B0F17` (`oklch(0.16 0.015 255)`) | Kanvas baca utama artikel panduan |
| `--surface-subtle` | `#F8FAFC` (`oklch(0.984 0.003 247)`) | `#111827` (`oklch(0.20 0.02 255)`) | Latar `DocsSidebar`, header tabel, dan kanvas pembungkus komponen replika UI |
| `--foreground` | `#0F172A` (`oklch(0.18 0.02 255)`) | `#F8FAFC` (`oklch(0.98 0.005 255)`) | Teks judul dan paragraf utama (Kontras > 14:1) |
| `--muted-foreground` | `#475569` (`oklch(0.44 0.02 255)`) | `#94A3B8` (`oklch(0.70 0.015 255)`) | Teks sekunder, keterangan gambar/replika, dan daftar isi non-aktif (Kontras >= 4.6:1) |
| `--border` | `#E2E8F0` (`oklch(0.91 0.01 255)`) | `#1E293B` (`oklch(0.26 0.02 255)`) | Garis batas struktural `1px` antar-kolom, tabel, dan kartu |
| `--primary` (Accent) | `#1547E6` (`oklch(0.48 0.22 264)`) | `#3B68F7` (`oklch(0.58 0.21 264)`) | Aksen tunggal untuk CTA `"Buka Aplikasi Schedovyn"`, indikator rute aktif, dan fokus |
| `--primary-foreground` | `#FFFFFF` | `#FFFFFF` | Teks di atas tombol `--primary` |

### 2.3 Token Warna Semantik Validasi & Replika Schedovyn (`AC-UG-04`)

Warna di bawah ini **hanya boleh digunakan pada komponen `<Callout>` dan replika status/konflik** (tidak boleh dipakai sebagai warna dekoratif halaman):

| Status / Kategori | Kode Sistem Schedovyn | Warna Teks & Ikon (Light / Dark) | Warna Latar & Garis Batas (`1px`) |
|---|---|---|---|
| **Error / Konflik Waktu** | `CONFLICT_DETECTED` & 7 Kode Konflik Waktu | `#B91C1C` / `#FCA5A5` | Latar `#FEF2F2` (Dark: `#2A1215`), Batas `#FECACA` (Dark: `#7F1D1D`) |
| **Warning / Belum Lengkap** | `INCOMPLETE` & 5 Peringatan Kelengkapan | `#B45309` / `#FCD34D` | Latar `#FFFBEB` (Dark: `#291E0B`), Batas `#FDE68A` (Dark: `#78350F`) |
| **Info / Bebas Konflik Parsial** | `NO_CONFLICT_CURRENT_DATA` | `#1547E6` / `#93C5FD` | Latar `#EFF6FF` (Dark: `#111E38`), Batas `#BFDBFE` (Dark: `#1E3A8A`) |
| **Valid / Lengkap Sempurna** | `COMPLETE_AND_VALID` | `#047857` / `#6EE7B7` | Latar `#ECFDF5` (Dark: `#0B261E`), Batas `#A7F3D0` (Dark: `#065F46`) |

> **Catatan Palet 10 Warna Mata Pelajaran (`Modul 2.2`):**
> Palet 10 warna mata pelajaran (`blue`, `emerald`, `violet`, `cyan`, `indigo`, `teal`, `fuchsia`, `pink`, `slate`, `orange`) **hanya boleh dirender di dalam komponen replika blok sesi/dokumentasi Tabel Mata Pelajaran** untuk mencontohkan pembeda visual mapel, bukan sebagai warna tema portal (`R-29`).

---

## 3. Tipografi & Hierarki Bacaan (`R-06`, `R-31`, `NFR-UG-01`)

### 3.1 Pemilihan Font & Alasan Tertulis (`R-06`, `R-31`)
1. **Heading & Navigasi UI (`--font-heading`: `Figtree Variable`):**
   - *Alasan:* Konstruksi geometris yang terbuka dan tegas menjaga keterbacaan judul bab, label sidebar, dan tombol kontrol berdimensi ringkas (`h-8`), serta menyatu dengan identitas aplikasi utama Schedovyn.
2. **Teks Artikel & Tabel (`--font-sans`: `Inter Variable`):**
   - *Alasan:* Dirancang dengan *x-height* tinggi untuk keterbacaan optimal pada paragraf instruksi langkah-demi-langkah dan tabel kamus konflik berukuran `14px` hingga `16px`.
3. **Kode Status & Pintasan Keyboard (`--font-mono`: `JetBrains Mono` / System Mono):**
   - *Alasan:* Digunakan **secara eksklusif** untuk kode enum validasi (`TEACHER_OVERLAP`, `COMPLETE_AND_VALID`), nama lembar kerja (`Rekap Guru`), format waktu (`HH:mm:ss`), dan elemen `<kbd>` (`Ctrl+K`, `Alt + ArrowUp`). **Dilarang keras** menggunakan font monospace pada judul bagian atau *eyebrow label* (`R-06`).
4. **Angka Tabular (`font-variant-numeric: tabular-nums`):**
   - *Alasan:* Wajib diterapkan pada seluruh nomor langkah `<StepList>`, nomor bab (`1.1`, `2.3`), rentang jam belajar (`07:00 - 11:30`), durasi menit (`45 menit`), dan matriks kuota sesi (`Terjadwal: 24 / 24 sesi`) agar sejajar secara vertikal di dalam tabel maupun daftar.

### 3.2 Skala Tipografi Artikel MDX

| Elemen | Kelas / Ukuran | Berat & Spasi Baris | Aturan Khusus |
|---|---|---|---|
| **Judul Artikel (`H1`)** | `text-2xl sm:text-3xl` (`24px - 30px`) | `font-bold tracking-tight leading-tight` | Tanpa *eyebrow pill badge* di atasnya (`R-09`). Diikuti ringkasan tujuan artikel (`text-base text-muted-foreground`). |
| **Sub-Bab Utama (`H2`)** | `text-xl` (`20px`) | `font-semibold tracking-tight leading-snug` | Memiliki garis batas atas `border-t border-border pt-6 mt-10` dan terdaftar otomatis di `TableOfContents`. |
| **Sub-Bagian (`H3`)** | `text-base sm:text-lg` (`16px - 18px`) | `font-semibold leading-snug` | Margin atas `mt-6 mb-2`, terdaftar sebagai sub-item di `TableOfContents`. |
| **Paragraf Artikel (`p`)** | `text-base` (`16px`) | `font-normal leading-7` | Lebar baris dibatasi `max-w-3xl` (~65-72 karakter per baris) untuk kenyamanan baca. |
| **Tabel & Callout** | `text-sm` (`14px`) | ` leading-6` | Sel tabel wajib rata kiri untuk teks dan `tabular-nums` untuk jam/angka. |
| **Label Sidebar & TOC** | `text-sm` (`14px`) / `text-xs` (`12px`) | `font-medium` | Judul grup modul menggunakan `text-xs font-semibold text-muted-foreground` tanpa *wide letter-spacing* berlebihan (`R-06`). |

---

## 4. Geometri, Tata Letak, & Aturan Anti-Slop (`R-03`, `R-05`, `R-10`..`R-14`)

### 4.1 Geometri `radix-lyra` (`R-11`, `R-12`)
- **Sudut Tajam (`rounded-none` / `0px`):**
  - *Alasan (`R-31`):* Seluruh tombol, input pencarian, kartu modul, `<Callout>`, `<StepList>`, lencana status, dan dialog pencarian wajib menggunakan `rounded-none` (`border-radius: 0px`) agar selaras dengan kisi waktu arsitektural Schedovyn. Dilarang membuat elemen berbentuk kapsul/pil (`rounded-full`).
- **Garis Batas Struktural `1px` (`border`):**
  - Setiap batas antar-panel (`DocsNavbar`, `DocsSidebar`, area artikel, `TableOfContents`) dan setiap komponen kartu/replika dipisahkan oleh garis tegas `1px solid var(--border)`.
- **Tinggi Kontrol Ringkas (`h-8` / `32px` pada Desktop, `min-h-11` / `44px` Area Sentuh pada Mobile `R-03`):**
  - Tombol toolbar, pemicu `Ctrl+K`, sakelar OS, dan filter kategori kamus konflik menggunakan tinggi visual `h-8` pada desktop, dan memperluas area klik/sentuh hingga minimal `44px` pada perangkat *mobile* untuk memenuhi standar aksesibilitas (`R-03`).
- **Batas Dosis Efek Visual (`R-10`, `R-12`, `R-13`):**
  - **Shadow (`R-12`):** Seluruh kartu di dalam halaman duduk rata (`shadow-none`). `shadow-lg` hanya digunakan pada elemen melayang di atas halaman: modal `SearchCommandDialog` dan *drawer* `DocsSidebar` saat dibuka di layar *mobile*.
  - **Glassmorphism (`R-10`):** `backdrop-blur-md` dibatasi maksimal pada **2 elemen**: `DocsNavbar` (header lengket di atas) dan *backdrop overlay* `SearchCommandDialog`.
  - **Glow (`R-13`):** `0` elemen glow dekoratif. Cincin fokus hanya muncul saat navigasi keyboard (`focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary`).

### 4.2 Struktur Halaman Beranda Portal (`src/app/page.tsx`) (`R-05`, `C-3`)
Beranda Portal Panduan **bukan** halaman *marketing SaaS* (dilarang menampilkan *Trusted By logo bar*, *3 pricing tiers*, testimoni fiktif, atau statistik karangan `R-17`, `R-18`). Strukturnya dibangun murni untuk membantu pengguna menemukan jawaban secepat mungkin:
1. **Header Pencarian & Akses Cepat (Focal Point):**
   - Judul lugas: *"Panduan Pemakaian & Referensi Resmi Schedovyn"*.
   - Pemicu pencarian langsung (`Ctrl+K` / `/`) dengan contoh kueri nyata (*"jam istirahat Jumat"*, *"TEACHER_OVERLAP"*, *"salin jadwal"*).
   - Dua aksi terarah: CTA Primer **"Mulai Cepat dalam 10 Menit"** (`/docs/01-pengenalan/mulai-cepat-10-menit`) dan tautan langsung ke **"Kamus Konflik & Validasi"** (`/docs/04-kamus-konflik-dan-validasi/empat-status-validasi`).
2. **Jalur Baca Berdasarkan Peran & Skenario (*Task-Oriented Entry*):**
   - Variasi komposisi (`R-14`, `RHYTHM 2`): Menampilkan 3 skenario nyata pengguna dari PRD Bab 2 (*Onboarding Pertama Kali*, *Troubleshooting Konflik Jadwal*, *Cetak Laporan PDF & Rekap Guru Excel*) dalam tata letak baris bernomor yang langsung mengarah ke bab terkait.
3. **Peta 6 Modul Dokumentasi (*6-Module Architectural Index*):**
   - Grid teknis berbatas `1px` (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`) yang menampilkan ke-6 Modul utama lengkap dengan nomor modul (`01` s.d. `06` dalam `tabular-nums`), ringkasan cakupan, dan daftar tautan langsung ke setiap sub-artikel MDX di dalamnya (`R-24`).
4. **Banner Studi Kasus Terpadu (`FR-UG-05`):**
   - Blok lebar penuh (*full-width architectural callout*) yang mengarahkan pengguna ke tutorial utuh **"Studi Kasus: Menyusun Jadwal SMP Negeri 1 Nusantara dari Nol"** (`/docs/06-penyimpanan-pwa-dan-pintasan/studi-kasus-smp-nusantara`).

### 4.3 Tata Letak Dokumentasi 3 Kolom (`src/app/docs/layout.tsx`) (`FR-UG-01`, `R-03`)
- **Desktop (`>= 1280px` / `xl`):**
  - **Kolom Kiri (`DocsSidebar.tsx` - `w-64` / `256px` tetap, `sticky top-14`):** Menampilkan pohon navigasi 6 modul. Halaman aktif ditandai latar `--surface-subtle`, teks `--primary` tebal, dan garis indikator kiri `2px solid var(--primary)` (fungsional sebagai penanda lokasi aktif sesuai `R-01` & `R-31`).
  - **Kolom Tengah (Area Artikel MDX - `flex-1`, kontainer dalam `max-w-3xl mx-auto px-6 py-8`):** Memuat konten panduan, komponen replika UI, dan `DocsPager` (*Artikel Sebelumnya* / *Artikel Selanjutnya*) di bagian bawah.
  - **Kolom Kanan (`TableOfContents.tsx` - `w-56` / `224px` tetap, `sticky top-14`):** Menampilkan daftar sub-judul `H2` dan `H3` (*"Di Halaman Ini"*) dengan *scroll-spy* aktif.
- **Tablet & Mobile (`< 1024px`):**
  - `TableOfContents` kanan disembunyikan atau diringkas menjadi menu lipat di bagian atas artikel.
  - `DocsSidebar` berubah menjadi *collapsible drawer* yang dibuka melalui tombol menu pada `DocsNavbar` (dengan ukuran target sentuh `44x44px` dan dapat ditutup dengan `Escape` sesuai `R-03` & `R-32`).

---

## 5. Spesifikasi Komponen Dokumentasi & Replika UI (`FR-UG-01` s.d. `FR-UG-04`)

Seluruh komponen interaktif wajib mematuhi **Functional Completeness (`C-2`, `R-26`)** dan memiliki tampilan kosong/pencarian tidak ditemukan yang informatif (`R-27`).

### 5.1 Komponen Kerangka Dokumentasi (`src/components/docs/`)
1. **`DocsNavbar.tsx`:**
   - Tinggi `h-14` (`56px`), garis bawah `1px solid var(--border)`.
   - Kiri: Identitas **"Schedovyn Panduan"** (tautan ke `/`) dan tautan ke Landing Page (`NEXT_PUBLIC_LANDING_URL`).
   - Tengah/Kanan: Tombol bilah pencarian `"Cari panduan atau kode konflik..."` dilengkapi lencana `<kbd>Ctrl K</kbd>`, tombol pengubah tema Terang/Gelap (`D`), serta tombol CTA utama **"Buka Aplikasi Schedovyn"** (`NEXT_PUBLIC_APP_URL`) dengan ikon `ArrowUpRight` (`R-08`: panah digunakan khusus untuk menandakan perpindahan ke aplikasi kerja utama).
2. **`SearchCommandDialog.tsx` (`"use client"` - `FR-UG-02`):**
   - Dibuka dengan `Ctrl+K`, `Cmd+K`, `/`, atau klik pada pemicu pencarian; ditutup dengan `Escape`.
   - Menampilkan hasil yang dikelompokkan berdasarkan nama Modul beserta cuplikan konteks kalimat.
   - **Empty State Jujur (`R-27`):** Jika kata kunci tidak ditemukan, tampilkan pesan jelas: *"Tidak ditemukan panduan untuk kata kunci '[kueri]'. Coba gunakan kata kunci seperti 'istirahat', 'konflik guru', 'salin jadwal', atau 'excel', atau buka Kamus Konflik."* beserta tautan langsung ke halaman Kamus Konflik.
3. **`StepList.tsx` (`tabular-nums`):**
   - Menampilkan langkah kerja berurutan (sesuai jumlah langkah nyata prosedur, bukan dipaksa selalu 3 langkah sesuai `R-05`).
   - Nomor langkah ditampilkan di dalam kotak persegi `28x28px` (`rounded-none`, `border border-primary`, `tabular-nums`, `font-semibold`) yang dihubungkan oleh garis vertikal `1px solid var(--border)`.
4. **`Callout.tsx`:**
   - Mendukung 4 varian fungsional: `info` (*Catatan*), `tip` (*Tips Kurikulum*), `warning` (*Penting / Perhatian*), dan `danger` (*Peringatan Data / Konflik*).
   - Menggunakan bingkai `1px solid` penuh (`rounded-none`), ikon semantik di kiri atas, dan judul tegas tanpa emoji (`R-04`).
5. **`DocsPager.tsx`:**
   - Dua kotak tautan berbatas `1px` di kaki artikel untuk **Artikel Sebelumnya** dan **Artikel Selanjutnya** beserta nama modulnya. Jika berada di artikel pertama (`1.1`), kotak sebelumnya tidak dirender; jika di artikel terakhir (`6.4`), kotak selanjutnya tidak dirender (`R-24`, `R-26`).

### 5.2 Komponen Replika UI Kontekstual (`src/components/replicas/`)
Setiap komponen replika dibungkus dalam bingkai peraga teknis (`border border-border bg-[var(--surface-subtle)] p-4`) dengan label header kecil `"PERAGA INTERAKTIF ANTARMUKA SCHEDOVYN"` agar pembaca memahami bahwa elemen tersebut adalah simulasi interaktif komponen asli:

1. **`ValidationStatusBadgesReplica.tsx` (`Modul 4.1`):**
   - Merender ke-4 lencana status resmi Schedovyn (`Konflik ditemukan`, `Belum lengkap`, `Tidak ada konflik pada data saat ini`, `Jadwal lengkap dan valid`).
   - Pengguna dapat mengeklik setiap lencana untuk melihat detail kode sistem (`CONFLICT_DETECTED`, `INCOMPLETE`, `NO_CONFLICT_CURRENT_DATA`, `COMPLETE_AND_VALID`), arti kondisi di kelas aktif vs seluruh ruang kerja, dan tindakan yang disarankan.
2. **`ConflictDictionaryExplorer.tsx` (`Modul 4.2 & 4.3` - `FR-UG-04`):**
   - Dilengkapi 3 tombol filter kategori (`Semua (12)`, `Bentrokan Waktu / Error (7)`, `Kelengkapan / Warning (5)`) dan input pencarian instan.
   - Setiap baris kamus menampilkan: Lencana Tingkat Keparahan (`Error` merah / `Warning` kuning), Nama Bahasa Indonesia resmi, Kode Sistem (`font-mono`), Penyebab di Lapangan, dan Langkah Penyelesaian di Editor.
   - Memiliki *empty state* jika pencarian filter tidak menemukan hasil (`R-27`).
3. **`SaveStatusBadgeReplica.tsx` (`Modul 1.3 & 6.1`):**
   - Memungkinkan pengguna menyimulasikan 3 status penyimpanan lokal IndexedDB: `"Menyimpan..."`, `"Tersimpan di browser"` (ketika diklik menampilkan *popover* jam simpan terakhir `HH:mm:ss` dan estimasi kuota penyimpanan), serta `"Gagal menyimpan lokal"` beserta panduan penanganannya.
4. **`SessionBlockOverlapReplica.tsx` (`Modul 3.3`):**
   - Memperagakan perbedaan visual antara blok sesi normal pada grid waktu (`07:00 - 08:30`, `tabular-nums`) dan tampilan *overlap cluster* (dua blok sesi berdampingan dengan bingkai merah peringatan `CLASS_OVERLAP` / `TEACHER_OVERLAP`) beserta tombol simulasi **"Lepas dari Grid"** atau geser jam untuk menyelesaikannya.
5. **`KeyboardShortcutSwitch.tsx` (`Modul 6.3` - `FR-UG-04`):**
   - Menyediakan sakelar dua pilihan (`Windows / Linux` vs `macOS`) yang secara reaktif mengubah seluruh tampilan tombol `<kbd>` pada tabel pintasan (misal `Ctrl + Z` $\leftrightarrow$ `Cmd + Z`, `Alt + ArrowUp` $\leftrightarrow$ `Option + ArrowUp`).

---

## 6. Aturan Copywriting, Bahasa, & Keaslian Data (`R-02`, `R-15`..`R-18`, `R-38`, `AC-UG-05`)

1. **Larangan Mutlak Karakter *Em Dash* (`R-02` & `NFR-UG-01`):**
   - Karakter *em dash* (tanda pisah panjang) **dilarang keras** muncul di seluruh berkas `.mdx`, `.tsx`, maupun `.ts`. Gunakan tanda titik dua (`:`), koma (`,`), tanda kurung `( )`, atau kalimat baru.
2. **Bebas Buzzword AI & Emoji Dekoratif (`R-04`, `R-16`):**
   - Dilarang menggunakan kata klise seperti *"revolusioner"*, *"seamless"*, *"canggih"*, *"bertenaga AI"*, atau *"generasi berikutnya"*.
   - Dilarang menggunakan emoji di dalam judul, tombol, callout, atau daftar langkah.
3. **Kesesuaian Terminologi 100% dengan Aplikasi Produksi (`AC-UG-05`):**
   - Gunakan istilah persis sebagaimana tertulis di aplikasi utama Schedovyn:
     - Status Simpan: `"Menyimpan..."`, `"Tersimpan di browser"`, `"Gagal menyimpan lokal"`.
     - Aksi & Tombol: `"Tempatkan ke Jadwal"`, `"Lepas dari Grid"`, `"Batal Perubahan"`, `"Ulangi Perubahan"`, `"Salin Jadwal"`, `"Pasang Aplikasi"`, `"Buka Aplikasi Schedovyn"`.
     - 4 Status Validasi: `"Konflik ditemukan"`, `"Belum lengkap"`, `"Tidak ada konflik pada data saat ini"`, `"Jadwal lengkap dan valid"`.
4. **Data Contoh Kontekstual Sekolah Indonesia (`R-17`, `R-18`, `R-38`):**
   - Dilarang menggunakan nama generik barat (`John Doe`, `Sarah Chen`) atau angka metrik fiktif.
   - Seluruh contoh tabel, tangkapan replika, dan studi kasus wajib menggunakan data domain sekolah yang konsisten dengan *seed default* Schedovyn dan `FR-UG-05`:
     - Sekolah: **SMP Negeri 1 Nusantara**
     - Kelas: **Kelas VII-A**, **Kelas VII-B**
     - Mata Pelajaran & Ruangan: **Matematika**, ** Ilmu Pengetahuan Alam (IPA)**, **Bahasa Indonesia**, **Pendidikan Jasmani**, **Lab IPA**, **Lapangan Olahraga**.

---

## 7. Aturan Cetak Kertas (`@media print` - `NFR-UG-03`)

Staf kurikulum dan operator sekolah sering mencetak panduan langkah-demi-langkah atau daftar pintasan keyboard sebagai lembar kerja meja (*desk reference*). `src/app/globals.css` wajib menyertakan aturan `@media print`:
1. Menyembunyikan elemen navigasi: `DocsNavbar`, `DocsSidebar`, `TableOfContents`, `DocsPager`, dan tombol pemicu pencarian.
2. Mengatur lebar kontainer artikel menjadi `100%` (`max-w-none`), latar putih bersih (`#FFFFFF`), dan teks hitam (`#000000`).
3. Menjaga bingkai `1px solid #CBD5E1` pada `<StepList>`, `<Callout>`, dan tabel kamus konflik dengan `break-inside: avoid` agar langkah atau baris tabel tidak terpotong di tengah halaman kertas A4/F4.
