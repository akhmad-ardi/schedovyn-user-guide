# TASK-04: Penulisan 21 Artikel Panduan MDX pada 6 Modul & Studi Kasus Terpadu

| Informasi Task | Detail |
|---|---|
| **ID Task** | `TASK-04` |
| **Judul Task** | Penulisan Lengkap 21 Berkas Panduan MDX, Studi Kasus Terpadu SMP Negeri 1 Nusantara, Sinkronisasi Indeks Pencarian, & Pengujian Integritas Konten |
| **Pelaksana Fase RED** | **QA Engineer** (`.agents/agents/qa-engineer/agent.md`) |
| **Pelaksana Fase GREEN** | **Frontend Engineer** (`.agents/agents/frontend-engineer/agent.md`) |
| **Dokumen Acuan** | [Schedovyn-User-Guide-PRD.md](../Schedovyn-User-Guide-PRD.md) (Bab 4 & Bab 5), [Schedovyn-User-Guide-TDD.md](../Schedovyn-User-Guide-TDD.md) (Bab 7 & Bab 8), [DESIGN.md](../../DESIGN.md), [AGENTS.md](../../AGENTS.md) |
| **Cakupan Persyaratan** | `FR-UG-05`, `NFR-UG-01`, `NFR-UG-02`, `NFR-UG-03`, `AC-UG-01`, `AC-UG-02`, `AC-UG-04`, `AC-UG-05` |

---

## 1. Konteks & Tujuan Fitur

### 1.1 Hasil Telusur Codebase (`TASK-03` Baseline)
Berdasarkan implementasi sebelumnya:
- **Kerangka Navigasi & Pemuat MDX (`TASK-02`):** `DocsNavbar.tsx`, `DocsSidebar.tsx`, `TableOfContents.tsx`, `DocsPager.tsx`, `SearchCommandDialog.tsx`, `Callout.tsx`, `StepList.tsx`, serta `src/lib/mdx-loader.ts` telah berfungsi penuh dengan mekanisme *fallback* sementara.
- **Replika UI Interaktif (`TASK-03`):** Kelima komponen replika (`ValidationStatusBadgesReplica.tsx`, `ConflictDictionaryExplorer.tsx`, `SaveStatusBadgeReplica.tsx`, `SessionBlockOverlapReplica.tsx`, `KeyboardShortcutSwitch.tsx`) telah dibuat dan didaftarkan pada `mdxComponents` di `src/lib/mdx-loader.ts`.
- **Kondisi Direktori Konten Saat Ini:** Direktori `src/content/docs/01-pengenalan/` s.d. `06-penyimpanan-pwa-dan-pintasan/` saat ini baru berisi berkas `.gitkeep` tanpa berkas `.mdx` fisik. Seluruh 21 rute artikel saat ini masih mengandalkan teks *fallback* dari `buildFallbackMdx(meta)`.

### 1.2 Referensi Persyaratan PRD & TDD
- **`PRD Bab 4` & `TDD Bab 2.2`:** Peta konten utuh 6 modul yang mencakup **21 artikel panduan resmi**.
- **`FR-UG-05` (Studi Kasus Terpadu SMP Negeri 1 Nusantara):** Panduan komprehensif langkah demi langkah menyusun jadwal 2 kelas paralel (`Kelas VII-A` dan `Kelas VII-B`), menangani guru bersama (`Budi Santoso, S.Pd.`), ruang `Lab IPA`, penggunaan fitur Salin Jadwal, hingga jadwal mencapai status hijau **`Jadwal lengkap dan valid`**.
- **`NFR-UG-01` & `DESIGN.md`:** Seluruh artikel ditulis dalam Bahasa Indonesia baku yang mudah dipahami oleh staf kurikulum/operator sekolah, menggunakan angka `tabular-nums` pada jam belajar dan nomor langkah, serta **dilarang keras memuat karakter *em dash* (`—`)**.
- **`AC-UG-05`:** Kesesuaian 100% istilah antarmuka aplikasi Schedovyn (`"Menyimpan..."`, `"Tersimpan di browser"`, `"Gagal menyimpan lokal"`, `"Tempatkan ke Jadwal"`, `"Lepas dari Grid"`, `"Batal Perubahan"`, `"Ulangi Perubahan"`, `"Salin Jadwal"`, `"Pasang Aplikasi"`).
- **`AC-UG-01` & `NFR-UG-02`:** Seluruh 21 berkas `.mdx` berhasil dikompilasi secara statis pada waktu build (`bun run build`) dengan 0 error TypeScript.

### 1.3 Kebutuhan Pengguna Sekolah yang Diselesaikan
Menyediakan materi panduan operasional nyata yang mendalam, kontekstual, dan mudah diterapkan di sekolah, bukan sekadar ringkasan ringkas. Staf kurikulum dapat membaca panduan sambil mempraktikkannya langsung di editor Schedovyn atau mencetaknya sebagai referensi meja kerja (`Ctrl+P`).

---

## 2. Arsitektur Konten & Spesifikasi 21 Berkas MDX

Setiap berkas `.mdx` disimpan di dalam direktori `src/content/docs/[moduleSlug]/[articleSlug].mdx`, diawali dengan *frontmatter* YAML standar, memiliki sub-judul `## ` (H2) dan `### ` (H3) yang bersih agar terindeks di `TableOfContents`, serta menyematkan komponen replika dan callout yang relevan.

### 2.1 Konvensi Frontmatter Setiap Berkas MDX
```yaml
---
title: "Judul Lengkap Artikel"
description: "Ringkasan manfaat dan cakupan materi bab ini."
order: "X.Y"
---
```

---

### 2.2 Rincian Konten 21 Berkas MDX per Modul

#### Modul 01: Pengenalan & Mulai Cepat (`01-pengenalan/`)

1. **`01-pengenalan/mengenal-schedovyn.mdx` (`Order 1.1`)**
   - **Judul:** *Mengenal Schedovyn & Prinsip Kerja*
   - **Cakupan Materi:**
     - Penjelasan prinsip dasar: *Class-Oriented Editing, Workspace-Wide Validation* (pengguna menyunting satu kelas aktif, namun deteksi bentrokan selalu memeriksa seluruh kelas di sekolah secara real-time).
     - Keunggulan arsitektur *Local-First & Zero-Login*: data tersimpan di IndexedDB peramban lokal tanpa registrasi akun, tanpa pengiriman data siswa/guru ke server pihak ketiga, dan tanpa jeda jaringan.
     - Cara kerja validasi otomatis setiap kali terjadi mutasi jadwal.
   - **Komponen Tersemat:** `<Callout variant="info">`, `<ValidationStatusBadgesReplica />`.

2. **`01-pengenalan/mulai-cepat-10-menit.mdx` (`Order 1.2`)**
   - **Judul:** *Panduan Mulai Cepat 10 Menit*
   - **Cakupan Materi:**
     - Alur kerja terstruktur 5 langkah praktis dari ruang kerja baru hingga siap cetak:
       1. Langkah 1: Memeriksa Pengaturan Jam Belajar harian dan jam istirahat.
       2. Langkah 2: Mengonfigurasi Data Master (Kelas, Mata Pelajaran, Guru, dan Ruangan).
       3. Langkah 3: Menentukan Kebutuhan Pembelajaran Mingguan (`sessionsPerWeek` dan `durationMinutes`).
       4. Langkah 4: Menempatkan sesi pembelajaran ke grid waktu kanvas editor.
       5. Langkah 5: Memeriksa lencana validasi dan mengunduh dokumen PDF atau spreadsheet Excel.
   - **Komponen Tersemat:** `<StepList>` dengan 5 `<StepItem>`, `<Callout variant="tip">`.

3. **`01-pengenalan/tata-letak-aplikasi.mdx` (`Order 1.3`)**
   - **Judul:** *Mengenal Tata Letak Aplikasi*
   - **Cakupan Materi:**
     - Anatomi visual antarmuka Schedovyn:
       - **Header Bar Atas:** Indikator status simpan lokal (`SaveStatusBadge`), navigasi utama (`Editor Jadwal`, `Data Master`, `Pengaturan`), tombol `Pasang Aplikasi` (PWA), dan tombol ganti tema.
       - **Class Selector Bar:** Pemilih rombongan belajar aktif, indikator kuota sesi (`Terjadwal: X / Y sesi`), dan lencana status validasi jadwal.
       - **3 Panel Kanvas Editor:** Panel Sesi Belum Terjadwal (kiri), Grid Waktu Mingguan (tengah), dan Panel Detail Sesi (kanan).
   - **Komponen Tersemat:** `<SaveStatusBadgeReplica />`, `<Callout variant="info">`.

---

#### Modul 02: Persiapan Ruang Kerja & Data Master (`02-ruang-kerja-dan-data-master/`)

4. **`02-ruang-kerja-dan-data-master/pengaturan-jam-belajar.mdx` (`Order 2.1`)**
   - **Judul:** *Mengatur Identitas Sekolah & Jam Belajar*
   - **Cakupan Materi:**
     - Mengubah Nama Ruang Kerja (misal: `SMP Negeri 1 Nusantara`) dan Periode Akademik (misal: `Semester Ganjil 2026/2027`).
     - Mengatur Interval Snap Default (`15`, `30`, `45`, atau `60` menit) beserta fungsi opsi terapkan ke seluruh hari.
     - Mengaktifkan dan menonaktifkan hari sekolah (Senin sampai Minggu), serta mengatur Jam Mulai dan Jam Selesai per hari (contoh kasus: hari Jumat selesai lebih awal pukul `11:30`).
     - Menambah, menyunting, dan menghapus periode Waktu Istirahat (misal: Istirahat Pagi `09:30 - 10:00` dan Istirahat Siang `12:00 - 12:30`).
   - **Komponen Tersemat:** `<StepList>`, `<Callout variant="warning">`.

5. **`02-ruang-kerja-dan-data-master/kelola-kelas-mapel-guru-ruangan.mdx` (`Order 2.2`)**
   - **Judul:** *Mengelola Kelas, Guru, Mata Pelajaran, dan Ruangan*
   - **Cakupan Materi:**
     - **Tab Kelas:** Menambah rombongan belajar (Tingkat dan Nama Kelas). Penjelasan konsekuensi penghapusan kaskade (*cascade delete*) pada sesi jadwal.
     - **Tab Mata Pelajaran:** Mendaftarkan mata pelajaran dan memilih 1 dari 10 kode warna visual resmi (`blue`, `emerald`, `violet`, `cyan`, `indigo`, `teal`, `fuchsia`, `pink`, `slate`, `orange`).
     - **Tab Guru & Waktu Tidak Bersedia:** Menambahkan interval waktu ketika guru berhalangan hadir (*unavailable interval*, misal guru paruh waktu tidak hadir setiap Selasa pukul `07:00 - 12:00`).
     - **Tab Ruangan & Ketersediaan:** Menentukan tipe ruangan (`Ruang Kelas`, `Laboratorium`, `Lapangan / Olahraga`, `Ruang Serbaguna`) dan pembatasan jam pakai ruangan.
   - **Komponen Tersemat:** Tabel referensi 10 warna mapel, `<Callout variant="danger">`.

6. **`02-ruang-kerja-dan-data-master/kebutuhan-pembelajaran-mingguan.mdx` (`Order 2.3`)**
   - **Judul:** *Menyusun Kebutuhan Pembelajaran Mingguan*
   - **Cakupan Materi:**
     - Konsep Kebutuhan Pembelajaran (*Teaching Requirements*): jembatan antara kurikulum akademik dengan kartu sesi yang akan dijadwalkan di editor.
     - Konfigurasi setiap butir kebutuhan: memilih Kelas, Mata Pelajaran, Guru Pengajar Default, Ruangan Default, Target Sesi per Minggu (`sessionsPerWeek`), dan Durasi per Sesi (`durationMinutes`).
     - Fungsi sakelar **Wajib Ruangan Khusus** (`roomRequired: true`) untuk mata pelajaran yang harus memakai laboratorium atau lapangan olahraga.
   - **Komponen Tersemat:** `<StepList>`, `<Callout variant="tip">`.

---

#### Modul 03: Menyusun Jadwal di Kanvas Editor (`03-menyusun-jadwal-editor/`)

7. **`03-menyusun-jadwal-editor/memilih-kelas-aktif.mdx` (`Order 3.1`)**
   - **Judul:** *Memilih & Berpindah Kelas Aktif*
   - **Cakupan Materi:**
     - Menggunakan pemilih Kelas Aktif pada bilah toolbar editor.
     - Membaca arti indikator kuota sesi: `Terjadwal: X / Y sesi` dan `Belum Terjadwal: Z sesi`.
     - Penjelasan mengapa saat berpindah kelas aktif, jadwal kelas lain tidak berubah tetapi tetap dipantau untuk mendeteksi bentrokan guru atau ruangan.
   - **Komponen Tersemat:** `<Callout variant="info">`.

8. **`03-menyusun-jadwal-editor/menempatkan-sesi-belum-terjadwal.mdx` (`Order 3.2`)**
   - **Judul:** *Menempatkan Sesi dari Panel Belum Terjadwal*
   - **Cakupan Materi:**
     - Menggunakan pencarian nama mapel atau guru, filter mata pelajaran, dan pengurutan (*Sisa Sesi Terbanyak*, *Durasi Terlama*, *Nama Mapel A-Z*).
     - Dua metode penempatan sesi ke jadwal:
       1. Metode Tarik-Lepas (*Drag-and-Drop*): menarik kartu sesi ke kolom hari pada kanvas waktu.
       2. Metode Aksesibel / Tombol: menekan tombol **"Tempatkan ke Jadwal"** untuk penempatan langsung lewat keyboard atau dialog pemilih waktu.
   - **Komponen Tersemat:** `<StepList>`, `<Callout variant="tip">`.

9. **`03-menyusun-jadwal-editor/menyunting-dan-memindahkan-sesi.mdx` (`Order 3.3`)**
   - **Judul:** *Menyunting, Memindahkan, dan Melepas Sesi di Grid*
   - **Cakupan Materi:**
     - Memindahkan jam atau hari blok sesi dengan tarik-lepas pada kanvas grid.
     - Menggunakan formulir **Panel Detail Sesi** di sebelah kanan: mengganti Jam Mulai secara presisi, mengganti Guru Pengajar khusus sesi tertentu, mengganti Ruangan, atau menambahkan catatan khusus.
     - Cara melepas sesi dari grid kembali ke panel belum terjadwal menggunakan tombol **"Lepas dari Grid"** atau tombol pintas `Delete` / `Backspace`.
     - Memahami tampilan **Overlap Cluster** (dua atau lebih sesi berdampingan dengan lebar terbagi rata pada jam yang sama disertai bingkai merah peringatan).
   - **Komponen Tersemat:** `<SessionBlockOverlapReplica />`, `<Callout variant="warning">`.

10. **`03-menyusun-jadwal-editor/riwayat-undo-dan-redo.mdx` (`Order 3.4`)**
    - **Judul:** *Menggunakan Riwayat Perubahan (Undo & Redo)*
    - **Cakupan Materi:**
      - Mekanisme tumpukan riwayat (*history stack*) yang mencatat hingga 50 langkah mutasi terakhir secara lokal.
      - Membatalkan langkah menggunakan tombol toolbar **Batal Perubahan** atau pintasan `Ctrl+Z` / `Cmd+Z`.
      - Mengulangi langkah perubahan menggunakan tombol toolbar **Ulangi Perubahan** atau pintasan `Ctrl+Y` / `Ctrl+Shift+Z` / `Cmd+Shift+Z`.
      - Batasan riwayat: tindakan yang dicatat dalam riwayat (penempatan sesi, pergeseran jam, penggantian guru/ruangan, pelepasan sesi) vs mutasi data master.
    - **Komponen Tersemat:** `<Callout variant="tip">`.

11. **`03-menyusun-jadwal-editor/menyalin-jadwal-antar-kelas.mdx` (`Order 3.5`)**
    - **Judul:** *Menyalin Jadwal ke Kelas Lain*
    - **Cakupan Materi:**
      - Panduan menggunakan tombol **Salin Jadwal** pada toolbar editor untuk mempercepat penyusunan jadwal kelas paralel (misal dari Kelas VII-A ke Kelas VII-B).
      - Penjelasan **Mode Penanganan**:
        - *Timpa Seluruh Jadwal Lama*: menghapus seluruh sesi lama di kelas tujuan sebelum menempelkan jadwal baru.
        - *Gabungkan*: mempertahankan sesi lama yang tidak bentrok dan menambahkan sesi salinan.
      - Penjelasan **Strategi Guru & Ruangan**:
        - *Gunakan Default Kelas Tujuan*: otomatis mengisi guru dan ruangan sesuai data kebutuhan pembelajaran kelas tujuan.
        - *Salin dari Kelas Sumber*: menduplikasi guru dan ruangan persis seperti kelas sumber.
        - *Kosongkan*: mengosongkan guru atau ruangan agar ditentukan manual kemudian.
    - **Komponen Tersemat:** `<StepList>`, Tabel perbandingan strategi salin, `<Callout variant="warning">`.

---

#### Modul 04: Kamus Konflik & Ringkasan Validasi (`04-kamus-konflik-dan-validasi/`)

12. **`04-kamus-konflik-dan-validasi/empat-status-validasi.mdx` (`Order 4.1`)**
    - **Judul:** *Memahami 4 Status Validasi Jadwal*
    - **Cakupan Materi:**
      - Penjelasan filosofi validasi dua tingkat: evaluasi kelas aktif vs evaluasi ruang kerja sekolah.
      - Pembahasan mendalam ke-4 status validasi resmi:
        1. `CONFLICT_DETECTED` (*Konflik ditemukan*): terdapat minimal 1 bentrokan waktu nyata.
        2. `INCOMPLETE` (*Belum lengkap*): tidak ada bentrokan waktu, tetapi alokasi sesi belum lengkap.
        3. `NO_CONFLICT_CURRENT_DATA` (*Tidak ada konflik pada data saat ini*): kelas aktif sudah tuntas, namun kelas lain di sekolah masih belum selesai.
        4. `COMPLETE_AND_VALID` (*Jadwal lengkap dan valid*): seluruh kelas di sekolah 100% lengkap dan 0 konflik.
    - **Komponen Tersemat:** `<ValidationStatusBadgesReplica />`, `<Callout variant="info">`.

13. **`04-kamus-konflik-dan-validasi/kamus-tujuh-konflik-waktu.mdx` (`Order 4.2`)**
    - **Judul:** *Kamus 7 Jenis Bentrokan Waktu (Error)*
    - **Cakupan Materi:**
      - Penjelasan tingkat keparahan Error (lencana merah): bentrokan fisik yang tidak boleh ada saat jadwal diterapkan di sekolah.
      - Pembahasan rinci penyebab dan langkah perbaikan untuk:
        - `CLASS_OVERLAP` (Jadwal Kelas Tumpang Tindih)
        - `TEACHER_OVERLAP` (Bentrokan Jadwal Guru lintas kelas)
        - `ROOM_OVERLAP` (Bentrokan Pemakaian Ruangan lintas kelas)
        - `TEACHER_UNAVAILABLE` (Guru Tidak Bersedia pada jam terkait)
        - `ROOM_UNAVAILABLE` (Ruangan Tidak Tersedia pada jam terkait)
        - `OUTSIDE_OPERATING_HOURS` (Sesi di Luar Jam Belajar harian)
        - `BREAK_TIME_OVERLAP` (Sesi Beririsan dengan Waktu Istirahat)
    - **Komponen Tersemat:** `<ConflictDictionaryExplorer initialFilter="ERROR" />`, `<Callout variant="danger">`.

14. **`04-kamus-konflik-dan-validasi/kamus-lima-peringatan-kelengkapan.mdx` (`Order 4.3`)**
    - **Judul:** *Kamus 5 Peringatan Kelengkapan (Warning)*
    - **Cakupan Materi:**
      - Penjelasan tingkat keparahan Warning (lencana kuning): tidak menyebabkan bentrokan fisik waktu, tetapi jadwal belum memenuhi target kurikulum.
      - Pembahasan rinci penyebab dan langkah perbaikan untuk:
        - `UNFULFILLED_REQUIREMENT` (Alokasi Sesi Belum Lengkap)
        - `OVER_SCHEDULED_SESSION` (Alokasi Sesi Melebihi Kebutuhan)
        - `MISSING_TEACHER` (Guru Belum Ditentukan)
        - `MISSING_REQUIRED_ROOM` (Ruangan Khusus Belum Dipilih)
        - `UNCONFIGURED_CLASS` (Kelas Belum Dikonfigurasi)
    - **Komponen Tersemat:** `<ConflictDictionaryExplorer initialFilter="WARNING" />`, `<Callout variant="warning">`.

15. **`04-kamus-konflik-dan-validasi/matriks-kelengkapan-kelas.mdx` (`Order 4.4`)**
    - **Judul:** *Menggunakan Dialog Ringkasan Validasi & Matriks Kelas*
    - **Cakupan Materi:**
      - Cara membuka Dialog Ringkasan Validasi dengan mengeklik lencana status di toolbar editor.
      - Membaca tab ringkasan: perbandingan status Kelas Aktif vs Seluruh Ruang Kerja.
      - Menggunakan tabel **Matriks Kelengkapan Kelas**: melihat rekap status setiap kelas di sekolah (jumlah sesi terjadwal, sisa kebutuhan, daftar konflik aktif) dan tombol navigasi langsung untuk melompat ke kelas atau sesi yang bermasalah.
    - **Komponen Tersemat:** `<StepList>`, `<Callout variant="tip">`.

---

#### Modul 05: Ekspor Dokumen Cetak PDF & Spreadsheet Excel (`05-ekspor-dokumen/`)

16. **`05-ekspor-dokumen/ekspor-pdf-landscape.mdx` (`Order 5.1`)**
    - **Judul:** *Panduan Ekspor PDF Cetak Landscape*
    - **Cakupan Materi:**
      - Memilih cakupan ekspor: *Jadwal Kelas Aktif* (1 halaman) vs *Seluruh Kelas dalam Ruang Kerja* (gabungan halaman per kelas).
      - Dialog peringatan pra-ekspor apabila masih terdeteksi konflik atau jadwal belum lengkap.
      - Tips teknis pencetakan dokumen fisik: memilih ukuran kertas A4 atau F4 (Folio), orientasi *Landscape*, serta rekomendasi tempel pada papan pengumuman kelas dan ruang guru.
    - **Komponen Tersemat:** `<StepList>`, `<Callout variant="warning">`.

17. **`05-ekspor-dokumen/ekspor-excel-dan-rekap-guru.mdx` (`Order 5.2`)**
    - **Judul:** *Panduan Ekspor Excel (.xlsx) & Analisis Beban Guru*
    - **Cakupan Materi:**
      - Struktur dan pemanfaatan 4 lembar kerja (*worksheets*):
        1. Lembar Kerja `Jadwal`: matriks jadwal komprehensif seluruh kelas.
        2. Lembar Kerja `Rekap Guru`: rekap total menit dan jam mengajar mingguan per guru untuk verifikasi pemenuhan beban kerja guru (SKMT/Sertifikasi).
        3. Lembar Kerja `Rekap Ruangan`: matriks pemakaian laboratorium dan fasilitas olahraga per hari dan jam.
        4. Lembar Kerja `Konflik`: rekapitulasi daftar bentrokan waktu atau peringatan yang belum terselesaikan.
      - Fitur keamanan sanitasi formula otomatis: pencegahan *formula injection* pada teks sel yang diawali karakter `=`, `+`, `-`, atau `@`.
    - **Komponen Tersemat:** Tabel struktur 4 lembar kerja Excel, `<Callout variant="info">`.

---

#### Modul 06: Penyimpanan Lokal, PWA Offline, & Pintasan Keyboard (`06-penyimpanan-pwa-dan-pintasan/`)

18. **`06-penyimpanan-pwa-dan-pintasan/penyimpanan-otomatis-indexeddb.mdx` (`Order 6.1`)**
    - **Judul:** *Cara Kerja Penyimpanan Otomatis Lokal (Auto-Save)*
    - **Cakupan Materi:**
      - Mekanisme penyimpanan otomatis: setiap mutasi jadwal langsung ditulis ke database IndexedDB peramban (`schedovyn_local_db`) tanpa perlu menekan tombol simpan manual.
      - Pembahasan arti 3 status penyimpanan pada lencana header: `"Menyimpan..."`, `"Tersimpan di browser"`, dan `"Gagal menyimpan lokal"`.
      - Cara memeriksa waktu simpan terakhir (`HH:mm:ss`) dan estimasi kuota penyimpanan peramban.
      - Praktik keamanan penting: jangan menghapus *Site Data / Cookie & IndexedDB* peramban tanpa mengekspor jadwal terlebih dahulu, serta cara mengatasi kendala `Ruang Penyimpanan Browser Penuh` atau `Akses Penyimpanan Dibatasi` pada mode penyamaran (*incognito*).
    - **Komponen Tersemat:** `<SaveStatusBadgeReplica />`, `<Callout variant="danger">`.

19. **`06-penyimpanan-pwa-dan-pintasan/pasang-aplikasi-pwa-offline.mdx` (`Order 6.2`)**
    - **Judul:** *Memasang Aplikasi ke Komputer & Bekerja Offline (PWA)*
    - **Cakupan Materi:**
      - Keuntungan memasang Schedovyn sebagai aplikasi desktop Progressive Web App (PWA): jendela mandiri tanpa bilah URL peramban, akses cepat dari desktop/start menu, dan dapat dibuka tanpa koneksi internet sama sekali.
      - Cara memasang aplikasi menggunakan tombol **"Pasang Aplikasi"** di header pada Google Chrome, Microsoft Edge, atau peramban Chromium lainnya.
      - Cara memperbarui aplikasi ketika muncul notifikasi **"Pembaruan Aplikasi Tersedia"** di sudut bawah layar.
    - **Komponen Tersemat:** `<StepList>`, `<Callout variant="tip">`.

20. **`06-penyimpanan-pwa-dan-pintasan/daftar-pintasan-keyboard.mdx` (`Order 6.3`)**
    - **Judul:** *Daftar Lengkap Pintasan Keyboard*
    - **Cakupan Materi:**
      - Lembar contekan (*cheat sheet*) lengkap untuk mempercepat kerja penyusunan jadwal menggunakan keyboard.
      - Rincian tombol untuk platform Windows/Linux dan macOS:
        - `Ctrl+Z` / `Cmd+Z`: Batal Perubahan (*Undo*)
        - `Ctrl+Y` / `Ctrl+Shift+Z` / `Cmd+Shift+Z`: Ulangi Perubahan (*Redo*)
        - `Alt + ArrowUp` / `Alt + ArrowDown`: Geser jam sesi maju/mundur sebesar interval snap
        - `Alt + ArrowLeft` / `Alt + ArrowRight`: Pindahkan sesi ke hari sekolah sebelumnya/berikutnya
        - `Delete` / `Backspace`: Lepas sesi dari grid kembali ke panel belum terjadwal
        - `Enter`: Buka fokus langsung ke formulir Panel Detail Sesi
        - `D`: Ganti tema tampilan (Terang / Gelap)
    - **Komponen Tersemat:** `<KeyboardShortcutSwitch />`, `<Callout variant="info">`.

21. **`06-penyimpanan-pwa-dan-pintasan/studi-kasus-smp-nusantara.mdx` (`Order 6.4`)**
    - **Judul:** *Studi Kasus: Menyusun Jadwal SMP Negeri 1 Nusantara dari Nol*
    - **Cakupan Materi (`FR-UG-05`):**
      - Tutorial terpadu skenario sekolah nyata dari awal sampai akhir:
        1. Pengenalan data sekolah: 2 kelas paralel (**Kelas VII-A** dan **Kelas VII-B**), 3 guru (`Budi Santoso, S.Pd.` untuk Matematika, `Siti Aminah, M.Pd.` untuk IPA, `Ahmad Fauzi, S.Pd.` untuk Bahasa Indonesia), dan 1 fasilitas khusus (`Lab IPA`).
        2. Pengaturan batas waktu: `Siti Aminah, M.Pd.` tidak dapat hadir setiap hari Jumat pagi, dan hari Jumat jam belajar selesai pukul `11:30`.
        3. Penyusunan jadwal Kelas VII-A hingga lengkap 100%.
        4. Menggunakan fitur **Salin Jadwal** dari Kelas VII-A ke Kelas VII-B.
        5. Mengidentifikasi dan menyelesaikan bentrokan yang muncul setelah penyalinan: bentrokan guru `Budi Santoso, S.Pd.` (`TEACHER_OVERLAP`) dan bentrokan pemakaian `Lab IPA` (`ROOM_OVERLAP`) pada jam yang sama di kedua kelas.
        6. Menggeser jam sesi hingga jadwal kedua kelas mencapai status hijau **Jadwal lengkap dan valid**.
    - **Komponen Tersemat:** `<StepList>` (6 langkah terpadu), `<ValidationStatusBadgesReplica initialStatus="COMPLETE_AND_VALID" />`, `<Callout variant="tip">`.

---

## 3. Acceptance Criteria (Given-When-Then)

1. **Skenario 1: Ketersediaan Seluruh 21 Berkas MDX Fisik (`AC-UG-01`, `AC-UG-02`)**
   - **Given** repositori proyek diperiksa pada direktori `src/content/docs/`,
   - **When** dilakukan pemindaian berkas berdasarkan `getAllDocArticles()` dari `docs-registry.ts`,
   - **Then** seluruh 21 berkas `.mdx` ditemukan di disk, dapat dibaca, memiliki *frontmatter* yang valid, dan tidak lagi mengandalkan teks *fallback*.

2. **Skenario 2: Larangan Mutlak Karakter Em Dash (`NFR-UG-01`, `R-02`)**
   - **Given** seluruh 21 berkas `.mdx` telah ditulis,
   - **When** dilakukan pengujian pemindaian karakter `\u2014` (*em dash*) pada seluruh baris berkas di `src/content/docs/`,
   - **Then** ditemukan `0` karakter *em dash* pada seluruh berkas MDX.

3. **Skenario 3: Akurasi Terminologi Bahasa Indonesia Schedovyn (`AC-UG-05`)**
   - **Given** teks panduan pada seluruh 21 artikel diperiksa,
   - **When** dievaluasi terhadap istilah antarmuka aplikasi utama,
   - **Then** seluruh label tombol (`"Menyimpan..."`, `"Tersimpan di browser"`, `"Gagal menyimpan lokal"`, `"Tempatkan ke Jadwal"`, `"Lepas dari Grid"`, `"Batal Perubahan"`, `"Ulangi Perubahan"`, `"Salin Jadwal"`, `"Pasang Aplikasi"`), 4 status validasi, 7 konflik waktu, dan 5 peringatan kelengkapan tertulis dengan 100% presisi.

4. **Skenario 4: Kelengkapan Studi Kasus Terpadu SMP Negeri 1 Nusantara (`FR-UG-05`)**
   - **Given** artikel `studi-kasus-smp-nusantara.mdx` dibuka,
   - **When** dibaca dari awal sampai akhir,
   - **Then** artikel memuat alur lengkap untuk 2 kelas paralel (`Kelas VII-A` & `Kelas VII-B`), guru bersama, ruang `Lab IPA`, penyalinan jadwal, perbaikan bentrokan `TEACHER_OVERLAP` & `ROOM_OVERLAP`, dan mencapai status hijau `Jadwal lengkap dan valid`.

5. **Skenario 5: Kompilasi Statis Penuh Tanpa Error (`AC-UG-01`, `NFR-UG-02`)**
   - **Given** seluruh 21 berkas MDX telah tersimpan,
   - **When** perintah `bun run build` dijalankan di terminal,
   - **Then** proses kompilasi Next.js SSG berhasil menghasilkan halaman statis untuk ke-21 rute artikel tanpa error kompilasi dan 0 error TypeScript.

---

## 4. Breakdown Task Eksekusi (TDD Roadmap)

### Langkah 0: Eksplorasi Konteks dengan `codegraph` (Wajib untuk QA & Frontend Engineer)
Sebelum menulis berkas pengujian atau berkas MDX, jalankan:
```bash
codegraph explore "DOCS_MODULES getAllDocArticles compileDocArticle"
```

---

### Fase 1: Task QA Engineer (Fase RED)

**QA Engineer** wajib membuat berkas pengujian otomatis **`src/__tests__/mdx-content-integrity.test.ts`** terlebih dahulu dan memastikan pengujian berstatus **RED** (gagal karena berkas fisik `.mdx` belum ada di disk):

1. **Pengujian Keberadaan 21 Berkas MDX Fisik:**
   - Membaca `getAllDocArticles()` dari `@/lib/docs-registry`.
   - Memverifikasi menggunakan `fs.stat` bahwa ke-21 berkas `src/content/docs/${article.filePath}` benar-benar ada di disk dan bukan berkas kosong.

2. **Pengujian Bebas Karakter Em Dash (`\u2014`):**
   - Membaca isi seluruh 21 berkas MDX dan memverifikasi bahwa tidak ada satu pun karakter *em dash* (`—` / `\u2014`) di seluruh baris artikel (`NFR-UG-01`).

3. **Pengujian Penyematan Komponen Replika UI Sesuai Tabel TDD Bab 2.2:**
   - Memverifikasi bahwa `01-pengenalan/mengenal-schedovyn.mdx` menyematkan `<ValidationStatusBadgesReplica`.
   - Memverifikasi bahwa `01-pengenalan/tata-letak-aplikasi.mdx` menyematkan `<SaveStatusBadgeReplica`.
   - Memverifikasi bahwa `03-menyusun-jadwal-editor/menyunting-dan-memindahkan-sesi.mdx` menyematkan `<SessionBlockOverlapReplica`.
   - Memverifikasi bahwa `04-kamus-konflik-dan-validasi/empat-status-validasi.mdx` menyematkan `<ValidationStatusBadgesReplica`.
   - Memverifikasi bahwa `04-kamus-konflik-dan-validasi/kamus-tujuh-konflik-waktu.mdx` menyematkan `<ConflictDictionaryExplorer`.
   - Memverifikasi bahwa `04-kamus-konflik-dan-validasi/kamus-lima-peringatan-kelengkapan.mdx` menyematkan `<ConflictDictionaryExplorer`.
   - Memverifikasi bahwa `06-penyimpanan-pwa-dan-pintasan/penyimpanan-otomatis-indexeddb.mdx` menyematkan `<SaveStatusBadgeReplica`.
   - Memverifikasi bahwa `06-penyimpanan-pwa-dan-pintasan/daftar-pintasan-keyboard.mdx` menyematkan `<KeyboardShortcutSwitch`.
   - Memverifikasi bahwa `06-penyimpanan-pwa-dan-pintasan/studi-kasus-smp-nusantara.mdx` menyematkan studi kasus terpadu SMP Negeri 1 Nusantara lengkap dengan `<StepList>` dan `<ValidationStatusBadgesReplica`.

4. **Pengujian Istilah Resmi Schedovyn:**
   - Memverifikasi kemunculan istilah tombol resmi (`"Tempatkan ke Jadwal"`, `"Lepas dari Grid"`, `"Batal Perubahan"`, `"Ulangi Perubahan"`, `"Salin Jadwal"`, `"Pasang Aplikasi"`) di artikel terkait.

---

### Fase 2: Task Frontend Engineer (Fase GREEN & Refactor)

Setelah berkas pengujian Fase RED tersedia, **Frontend Engineer** menulis seluruh berkas MDX hingga pengujian berstatus **GREEN**:

1. **Penulisan 21 Berkas MDX Fisik di `src/content/docs/`:**
   - Tulis 3 berkas di `src/content/docs/01-pengenalan/`:
     - `mengenal-schedovyn.mdx`
     - `mulai-cepat-10-menit.mdx`
     - `tata-letak-aplikasi.mdx`
   - Tulis 3 berkas di `src/content/docs/02-ruang-kerja-dan-data-master/`:
     - `pengaturan-jam-belajar.mdx`
     - `kelola-kelas-mapel-guru-ruangan.mdx`
     - `kebutuhan-pembelajaran-mingguan.mdx`
   - Tulis 5 berkas di `src/content/docs/03-menyusun-jadwal-editor/`:
     - `memilih-kelas-aktif.mdx`
     - `menempatkan-sesi-belum-terjadwal.mdx`
     - `menyunting-dan-memindahkan-sesi.mdx`
     - `riwayat-undo-dan-redo.mdx`
     - `menyalin-jadwal-antar-kelas.mdx`
   - Tulis 4 berkas di `src/content/docs/04-kamus-konflik-dan-validasi/`:
     - `empat-status-validasi.mdx`
     - `kamus-tujuh-konflik-waktu.mdx`
     - `kamus-lima-peringatan-kelengkapan.mdx`
     - `matriks-kelengkapan-kelas.mdx`
   - Tulis 2 berkas di `src/content/docs/05-ekspor-dokumen/`:
     - `ekspor-pdf-landscape.mdx`
     - `ekspor-excel-dan-rekap-guru.mdx`
   - Tulis 4 berkas di `src/content/docs/06-penyimpanan-pwa-dan-pintasan/`:
     - `penyimpanan-otomatis-indexeddb.mdx`
     - `pasang-aplikasi-pwa-offline.mdx`
     - `daftar-pintasan-keyboard.mdx`
     - `studi-kasus-smp-nusantara.mdx`

2. **Pembersihan Berkas `.gitkeep`:**
   Hapus berkas `.gitkeep` dari ke-6 sub-direktori `src/content/docs/` setelah seluruh berkas MDX ditulis.

3. **Verifikasi Kualitas Akhir & Sinkronisasi `codegraph`:**
   Jalankan seluruh pemeriksaan berikut dan pastikan semuanya lulus (`0` error, `100% GREEN`):
   ```bash
   bun run typecheck
   bun run test
   bun run lint
   bun run build
   codegraph sync
   ```
