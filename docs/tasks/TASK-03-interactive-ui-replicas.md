# TASK-03: Implementasi 5 Komponen Replika UI Interaktif Schedovyn & Integrasi MDX

| Informasi Task | Detail |
|---|---|
| **ID Task** | `TASK-03` |
| **Judul Task** | Implementasi 5 Komponen Replika Visual Interaktif (`src/components/replicas/`) & Registrasi `mdxComponents` |
| **Pelaksana Fase RED** | **QA Engineer** (`.agents/agents/qa-engineer/agent.md`) |
| **Pelaksana Fase GREEN** | **Frontend Engineer** (`.agents/agents/frontend-engineer/agent.md`) |
| **Dokumen Acuan** | [Schedovyn-User-Guide-PRD.md](../Schedovyn-User-Guide-PRD.md), [Schedovyn-User-Guide-TDD.md](../Schedovyn-User-Guide-TDD.md) (Bab 6 & Bab 8), [DESIGN.md](../../DESIGN.md), [AGENTS.md](../../AGENTS.md) |
| **Cakupan Persyaratan** | `FR-UG-03`, `FR-UG-04`, `NFR-UG-01`, `AC-UG-04`, `AC-UG-05` |

---

## 1. Konteks & Tujuan Fitur

### 1.1 Hasil Telusur `codegraph` (`TASK-02` Baseline)
Berdasarkan eksplorasi `codegraph explore "compileDocArticle mdxComponents Callout Badge"`:
- **`src/lib/mdx-loader.ts`:** Telah memuat `compileDocArticle(meta)`, `extractHeadingsFromMdx(rawMdx)`, `buildFallbackMdx(meta)`, serta objek `mdxComponents` yang saat ini baru mendaftarkan `Callout`, `StepList`, dan `StepItem`.
- **`src/components/ui/*`:** Telah menyediakan primitif `Badge` (`variant: "default" | "secondary" | "outline" | "error" | "warning" | "info" | "valid"`), `Button`, `Input`, `Tabs`, `Popover`, dan `Dialog` bergaya `radix-lyra` (`rounded-none`, `h-8`, `border`).
- **`src/components/replicas/`:** Saat ini masih kosong (hanya berisi `.gitkeep`).

### 1.2 Referensi Persyaratan PRD, TDD, & DESIGN.md
- **`FR-UG-03` (Komponen Ilustrasi & Replika UI Kontekstual):** Setiap artikel panduan kunci wajib menyertakan replika visual interaktif komponen UI Schedovyn (`ValidationStatusBadgesReplica`, `ConflictDictionaryExplorer`, `SaveStatusBadgeReplica`, `SessionBlockOverlapReplica`, dan `KeyboardShortcutSwitch`) agar pengguna mengenali bentuk tombol, lencana status, dan blok sesi persis seperti di aplikasi asli.
- **`FR-UG-04` (Filter Cepat pada Kamus Konflik & Sakelar Pintasan Keyboard):**
  - `ConflictDictionaryExplorer.tsx` menyediakan filter kategori (`Semua`, `Bentrokan Waktu / Error`, `Kelengkapan / Warning`) serta pencarian kata kunci/kode konflik.
  - `KeyboardShortcutSwitch.tsx` menyediakan sakelar pengganti tampilan tombol antara **Windows / Linux (`Ctrl`, `Alt`)** dan **macOS (`Cmd`, `Option`)**.
- **`AC-UG-04`:** Mendokumentasikan secara akurat **4 status validasi**, **7 jenis konflik waktu (Error)**, dan **5 peringatan kelengkapan (Warning)** lengkap dengan replika lencana visual dan langkah perbaikannya.
- **`AC-UG-05` & `NFR-UG-01`:** Seluruh istilah tombol, nama tab, dan label status 100% sesuai dengan aplikasi produksi Schedovyn (`"Menyimpan..."`, `"Tersimpan di browser"`, `"Gagal menyimpan lokal"`, `"Tempatkan ke Jadwal"`, `"Lepas dari Grid"`, `"Batal Perubahan"`, `"Ulangi Perubahan"`, `"Salin Jadwal"`, `"Pasang Aplikasi"`) dan **bebas dari karakter *em dash*** di seluruh teks maupun kode.

### 1.3 Kebutuhan Pengguna Sekolah yang Diselesaikan
Staf kurikulum dan operator sekolah sering kali ragu membedakan arti lencana status validasi (misalnya perbedaan antara `"Belum lengkap"` dan `"Tidak ada konflik pada data saat ini"`) atau bingung cara mengatasi blok sesi yang bertumpuk (*overlap cluster*). Dengan replika interaktif langsung di dalam halaman panduan, pengguna dapat mengeklik setiap lencana status, memfilter kamus konflik, menyimulasikan pelepasan sesi dari grid, dan melihat pintasan keyboard sesuai sistem operasi komputer sekolah mereka.

---

## 2. Kontrak Data & Arsitektur Teknis (Next.js App Router)

Seluruh komponen di dalam `src/components/replicas/` wajib merupakan **Client Components (`"use client"`)**, mematuhi **Zero `any` Policy**, menggunakan sudut tajam `rounded-none`, garis batas `1px solid var(--border)`, angka `tabular-nums`, dan dibungkus dalam bingkai peraga teknis standar berlabel `"PERAGA INTERAKTIF ANTARMUKA SCHEDOVYN"` (`DESIGN.md` Bagian 5.2).

---

### 2.1 Kontrak `ValidationStatusBadgesReplica.tsx` (`src/components/replicas/ValidationStatusBadgesReplica.tsx`)

```ts
export type ValidationStatusCode =
  | "CONFLICT_DETECTED"
  | "INCOMPLETE"
  | "NO_CONFLICT_CURRENT_DATA"
  | "COMPLETE_AND_VALID";

export type ValidationBadgeTone = "error" | "warning" | "info" | "valid";

export interface ValidationStatusItem {
  readonly code: ValidationStatusCode;
  readonly label: string;
  readonly tone: ValidationBadgeTone;
  readonly activeClassCondition: string;
  readonly workspaceCondition: string;
  readonly summary: string;
  readonly schoolExample: string;
  readonly recommendedAction: string;
}

export interface ValidationStatusBadgesReplicaProps {
  readonly initialStatus?: ValidationStatusCode;
}
```

#### Data Wajib `VALIDATION_STATUS_ITEMS` (4 Status Validasi Resmi - `AC-UG-04` & `AC-UG-05`):
1. **`CONFLICT_DETECTED`**
   - `label`: `"Konflik ditemukan"`
   - `tone`: `"error"`
   - `activeClassCondition`: `"Terdapat minimal 1 bentrokan waktu nyata pada kelas aktif atau lintas kelas."`
   - `workspaceCondition`: `"Terdapat minimal 1 bentrokan waktu di dalam ruang kerja sekolah."`
   - `summary`: `"Menandakan adanya tabrakan jadwal yang wajib diselesaikan sebelum jadwal dicetak, seperti guru mengajar di dua kelas pada jam yang sama atau sesi memotong jam istirahat."`
   - `schoolExample`: `"Budi Santoso, S.Pd. terjadwal mengajar Matematika di Kelas VII-A dan Kelas VII-B secara bersamaan pada hari Senin pukul 07:30 - 09:00."`
   - `recommendedAction`: `"Klik lencana status untuk membuka Dialog Ringkasan Validasi, periksa daftar kode Error merah, lalu geser jam sesi atau gunakan tombol Lepas dari Grid pada salah satu sesi yang bertabrakan."`
2. **`INCOMPLETE`**
   - `label`: `"Belum lengkap"`
   - `tone`: `"warning"`
   - `activeClassCondition`: `"0 bentrokan waktu, namun masih ada kebutuhan sesi mingguan yang belum ditempatkan ke grid atau terdapat peringatan kelengkapan."`
   - `workspaceCondition`: `"Belum seluruh target sesi mingguan di sekolah terpenuhi."`
   - `summary`: `"Jadwal yang sudah terpasang di grid aman dari bentrokan waktu, tetapi alokasi jam pelajaran kelas ini masih kurang atau belum lengkap."`
   - `schoolExample`: `"Pada Kelas VII-A, mata pelajaran Ilmu Pengetahuan Alam (IPA) baru terjadwal 1 sesi dari target 2 sesi per minggu, atau sesi belum memilih Lab IPA."`
   - `recommendedAction`: `"Periksa Panel Belum Terjadwal di sisi kiri editor, lalu gunakan tarik-lepas atau tombol Tempatkan ke Jadwal hingga indikator Belum Terjadwal mencapai 0 sesi."`
3. **`NO_CONFLICT_CURRENT_DATA`**
   - `label`: `"Tidak ada konflik pada data saat ini"`
   - `tone`: `"info"`
   - `activeClassCondition`: `"Kelas aktif sudah 100% lengkap (0 sesi belum terjadwal) dan 0 konflik."`
   - `workspaceCondition`: `"Masih ada kelas lain di dalam ruang kerja sekolah yang belum selesai disusun atau belum dikonfigurasi."`
   - `summary`: `"Kelas yang sedang Anda buka sudah selesai dan aman, tetapi secara keseluruhan sekolah masih terdapat kelas lain yang belum tuntas."`
   - `schoolExample`: `"Jadwal Kelas VII-A sudah terisi penuh 24 / 24 sesi tanpa konflik, namun jadwal Kelas VII-B baru terisi sebagian."`
   - `recommendedAction`: `"Gunakan pemilih Kelas Aktif di bagian atas editor atau gunakan fitur Salin Jadwal untuk menyelesaikan penyusunan jadwal pada kelas paralel lainnya."`
4. **`COMPLETE_AND_VALID`**
   - `label`: `"Jadwal lengkap dan valid"`
   - `tone`: `"valid"`
   - `activeClassCondition`: `"Kelas aktif 100% lengkap dan 0 konflik."`
   - `workspaceCondition`: `"Seluruh kelas di ruang kerja sekolah 100% lengkap dan 0 konflik."`
   - `summary`: `"Kondisi ideal siap cetak. Seluruh kebutuhan pembelajaran mingguan di semua kelas telah terjadwal tanpa satu pun bentrokan guru, ruangan, maupun jam operasional."`
   - `schoolExample`: `"Seluruh rombongan belajar di SMP Negeri 1 Nusantara (Kelas VII-A dan Kelas VII-B) telah terisi lengkap dan bebas dari peringatan."`
   - `recommendedAction`: `"Jadwal siap diunduh dan dibagikan melalui menu Ekspor PDF Landscape atau Ekspor Excel (.xlsx)." `

---

### 2.2 Kontrak `ConflictDictionaryExplorer.tsx` (`src/components/replicas/ConflictDictionaryExplorer.tsx`)

```ts
export type ConflictSeverity = "ERROR" | "WARNING";
export type ConflictCategoryFilter = "ALL" | "ERROR" | "WARNING";

export type ConflictCode =
  | "CLASS_OVERLAP"
  | "TEACHER_OVERLAP"
  | "ROOM_OVERLAP"
  | "TEACHER_UNAVAILABLE"
  | "ROOM_UNAVAILABLE"
  | "OUTSIDE_OPERATING_HOURS"
  | "BREAK_TIME_OVERLAP"
  | "UNFULFILLED_REQUIREMENT"
  | "OVER_SCHEDULED_SESSION"
  | "MISSING_TEACHER"
  | "MISSING_REQUIRED_ROOM"
  | "UNCONFIGURED_CLASS";

export interface ConflictDictionaryItem {
  readonly code: ConflictCode;
  readonly severity: ConflictSeverity;
  readonly title: string;
  readonly cause: string;
  readonly resolution: string;
  readonly exampleCase: string;
}

export interface ConflictDictionaryExplorerProps {
  readonly initialFilter?: ConflictCategoryFilter;
}
```

#### Data Wajib `CONFLICT_DICTIONARY_ITEMS` (12 Kode Resmi: 7 Error + 5 Warning - `AC-UG-04`):

**A. 7 Konflik Waktu (`severity: "ERROR"`, lencana merah `Error / Bentrokan Waktu`):**
1. `CLASS_OVERLAP`:
   - `title`: `"Jadwal Kelas Tumpang Tindih"`
   - `cause`: `"Dua atau lebih sesi pembelajaran ditempatkan pada hari dan rentang jam yang saling beririsan di dalam rombongan belajar (kelas) yang sama."`
   - `resolution`: `"Klik salah satu blok sesi pada overlap cluster di grid, lalu geser ke jam kosong pada Panel Detail Sesi atau tekan tombol Lepas dari Grid."`
   - `exampleCase`: `"Di Kelas VII-A pada hari Senin pukul 07:30 - 09:00 terdapat sesi Matematika sekaligus Bahasa Indonesia."`
2. `TEACHER_OVERLAP`:
   - `title`: `"Bentrokan Jadwal Guru"`
   - `cause`: `"Satu guru yang sama dijadwalkan mengajar di dua atau lebih kelas berbeda pada hari dan rentang waktu yang beririsan (deteksi lintas kelas otomatis)."`
   - `resolution`: `"Pindahkan jam mengajar guru tersebut di salah satu kelas ke slot waktu lain, atau ganti guru pengajar sesi melalui Panel Detail Sesi."`
   - `exampleCase`: `"Setelah menyalin jadwal dari Kelas VII-A ke Kelas VII-B, Budi Santoso, S.Pd. tercatat mengajar di kedua kelas pada hari Senin pukul 07:30 - 09:00."`
3. `ROOM_OVERLAP`:
   - `title`: `"Bentrokan Pemakaian Ruangan"`
   - `cause`: `"Satu fasilitas atau ruangan yang sama dipakai oleh dua atau lebih kelas berbeda pada hari dan jam yang beririsan."`
   - `resolution`: `"Ubah jam pelaksanaan sesi praktik di salah satu kelas agar pemakaian ruangan bergantian, atau pilih ruangan lain yang tersedia di Panel Detail Sesi."`
   - `exampleCase`: `"Kelas VII-A dan Kelas VII-B sama-sama dijadwalkan menggunakan Lab IPA pada hari Selasa pukul 09:00 - 10:30."`
4. `TEACHER_UNAVAILABLE`:
   - `title`: `"Guru Tidak Bersedia"`
   - `cause`: `"Sesi dijadwalkan pada hari dan rentang jam ketika guru pengajar tercatat tidak dapat hadir (unavailable interval) pada pengaturan Data Master Guru."`
   - `resolution`: `"Geser sesi ke hari atau jam ketika guru tersebut hadir di sekolah, atau sesuaikan jadwal ketersediaan guru pada menu Data Master -> Tab Guru."`
   - `exampleCase`: `"Siti Aminah, M.Pd. dijadwalkan mengajar pada hari Jumat pukul 07:00 - 08:30, padahal tercatat tidak bersedia setiap Jumat pagi."`
5. `ROOM_UNAVAILABLE`:
   - `title`: `"Ruangan Tidak Tersedia"`
   - `cause`: `"Sesi ditempatkan pada rentang waktu ketika ruangan sedang ditutup atau dipakai kegiatan sekolah lain pada pengaturan Data Master Ruangan."`
   - `resolution`: `"Pindahkan sesi ke jam lain di luar waktu penutupan ruangan, atau pilih ruangan alternatif pada Panel Detail Sesi."`
   - `exampleCase`: `"Lab IPA digunakan pada hari Kamis pukul 13:00 - 14:30 saat jadwal pemeliharaan rutin laboratorium."`
6. `OUTSIDE_OPERATING_HOURS`:
   - `title`: `"Sesi di Luar Jam Belajar"`
   - `cause`: `"Jam mulai atau jam selesai sesi melewati batas jam operasional sekolah pada hari tersebut, atau ditempatkan pada hari sekolah yang dinonaktifkan."`
   - `resolution`: `"Geser sesi ke dalam rentang jam belajar aktif hari tersebut, atau sesuaikan Jam Mulai dan Jam Selesai harian pada menu Pengaturan Jam Belajar."`
   - `exampleCase`: `"Pada hari Jumat yang berakhir pukul 11:30, terdapat sesi yang berlangsung pukul 10:30 - 12:00."`
7. `BREAK_TIME_OVERLAP`:
   - `title`: `"Sesi Beririsan dengan Waktu Istirahat"`
   - `cause`: `"Rentang waktu mulai hingga selesai sesi memotong periode Waktu Istirahat yang ditetapkan pada hari tersebut."`
   - `resolution`: `"Geser jam mulai sesi agar berakhir tepat sebelum istirahat dimulai, atau mulai tepat sesudah waktu istirahat selesai."`
   - `exampleCase`: `"Sesi dijadwalkan pukul 09:30 - 10:30, sedangkan Waktu Istirahat Pertama berlangsung pukul 10:00 - 10:30."`

**B. 5 Peringatan Kelengkapan (`severity: "WARNING"`, lencana kuning `Warning / Kelengkapan`):**
1. `UNFULFILLED_REQUIREMENT`:
   - `title`: `"Alokasi Sesi Belum Lengkap"`
   - `cause`: `"Jumlah sesi yang telah ditempatkan ke grid waktu masih kurang dari target sesi mingguan (sessionsPerWeek) pada daftar Kebutuhan Pembelajaran Mingguan."`
   - `resolution`: `"Tempatkan sisa kartu sesi dari Panel Belum Terjadwal ke kolom hari pada grid menggunakan tarik-lepas atau tombol Tempatkan ke Jadwal."`
   - `exampleCase`: `"Matematika Kelas VII-A membutuhkan 3 sesi per minggu, tetapi baru 2 sesi yang ditempatkan ke jadwal."`
2. `OVER_SCHEDULED_SESSION`:
   - `title`: `"Alokasi Sesi Melebihi Kebutuhan"`
   - `cause`: `"Jumlah sesi yang terpasang di grid melebihi target sesi mingguan yang ditentukan pada Kebutuhan Pembelajaran Mingguan."`
   - `resolution`: `"Pilih sesi berlebih pada grid lalu klik tombol Lepas dari Grid, atau perbarui angka target sesi mingguan di menu Data Master."`
   - `exampleCase`: `"Target Bahasa Indonesia dikurangi dari 3 menjadi 2 sesi per minggu ketika ke-3 sesi sudah terpasang di grid."`
3. `MISSING_TEACHER`:
   - `title`: `"Guru Belum Ditentukan"`
   - `cause`: `"Sesi pada grid atau data Kebutuhan Pembelajaran Mingguan belum memiliki guru pengajar yang ditugaskan."`
   - `resolution`: `"Klik blok sesi pada grid, lalu pilih nama Guru Pengajar pada formulir Panel Detail Sesi di sebelah kanan."`
   - `exampleCase`: `"Jadwal Kelas VII-B hasil penyalinan dengan strategi Kosongkan belum diisi nama guru pengajarnya."`
4. `MISSING_REQUIRED_ROOM`:
   - `title`: `"Ruangan Khusus Belum Dipilih"`
   - `cause`: `"Kebutuhan pembelajaran mengaktifkan opsi Wajib Ruangan Khusus (roomRequired), tetapi sesi belum memilih ruangan."`
   - `resolution`: `"Klik sesi terkait pada grid, kemudian pilih ruangan khusus yang sesuai (misalnya Lab IPA atau Lapangan Olahraga) di Panel Detail Sesi."`
   - `exampleCase`: `"Sesi praktik Ilmu Pengetahuan Alam (IPA) mewajibkan laboratorium, tetapi kolom Ruangan pada sesi masih kosong."`
5. `UNCONFIGURED_CLASS`:
   - `title`: `"Kelas Belum Dikonfigurasi"`
   - `cause`: `"Rombongan belajar telah ditambahkan di Tab Kelas, namun belum memiliki satu pun item Kebutuhan Pembelajaran Mingguan."`
   - `resolution`: `"Buka menu Data Master -> Kebutuhan Pembelajaran Mingguan, lalu tambahkan alokasi mata pelajaran untuk kelas tersebut."`
   - `exampleCase`: `"Operator baru saja menambahkan Kelas VII-C di daftar kelas tetapi belum mengatur mata pelajaran untuk kelas tersebut."`

#### Perilaku Interaktif `ConflictDictionaryExplorer`:
- Menyediakan 3 tombol filter kategori (`h-8`, `rounded-none`, `tabular-nums`):
  - `"Semua (12)"` (`ALL`)
  - `"Bentrokan Waktu / Error (7)"` (`ERROR`)
  - `"Kelengkapan / Warning (5)"` (`WARNING`)
- Menyediakan kolom `<Input>` pencarian instan (`placeholder="Cari nama konflik atau kode (misal: TEACHER_OVERLAP, istirahat)..."`).
- Jika pencarian tidak menemukan item yang cocok, wajib merender *empty state* jujur (`R-27`) beserta tombol `"Reset Filter & Pencarian"`.

---

### 2.3 Kontrak `SaveStatusBadgeReplica.tsx` (`src/components/replicas/SaveStatusBadgeReplica.tsx`)

```ts
export type SaveStatusState = "saving" | "saved" | "error";

export interface SaveStatusBadgeReplicaProps {
  readonly initialState?: SaveStatusState;
}
```

- Menyediakan 3 tombol pemilih simulasi state penyimpanan lokal IndexedDB (`AC-UG-05`):
  1. `"Menyimpan..."` (`saving`): Menampilkan lencana header berstatus sedang menulis transaksi ke database lokal peramban.
  2. `"Tersimpan di browser"` (`saved` - default): Menampilkan lencana aman beserta tombol/interaksi klik untuk membuka tampilan detail penyimpanan lokal yang memuat:
     - **Waktu Simpan Terakhir:** `10:42:18` (`font-mono tabular-nums`, format `HH:mm:ss`)
     - **Database Lokal:** `IndexedDB (schedovyn_local_db)`
     - **Estimasi Kuota Penyimpanan:** `1,4 MB terpakai dari 1.024 MB (0,1%)`
     - **Catatan Keamanan Data:** Peringatan agar tidak menghapus *Site Data / IndexedDB* peramban tanpa mengekspor jadwal ke Excel/PDF terlebih dahulu.
  3. `"Gagal menyimpan lokal"` (`error`): Menampilkan lencana merah peringatan beserta panduan mengatasi dua penyebab utamanya:
     - `Ruang Penyimpanan Browser Penuh` (*QuotaExceededError*)
     - `Akses Penyimpanan Dibatasi` (mode penyamaran / *incognito* dengan blokir penyimpanan lokal).

---

### 2.4 Kontrak `SessionBlockOverlapReplica.tsx` (`src/components/replicas/SessionBlockOverlapReplica.tsx`)

```ts
export type OverlapScenarioMode =
  | "overlap"
  | "resolved_sequential"
  | "unscheduled_removed";

export interface SessionBlockOverlapReplicaProps {
  readonly initialMode?: OverlapScenarioMode;
}
```

- Memperagakan kanvas grid waktu untuk **Kelas VII-A (Hari Senin)** dengan 3 mode interaktif:
  1. **Mode 1 (`overlap` - default): Kondisi Tumpang Tindih (*Overlap Cluster*)**
     - Menampilkan dua blok sesi berdampingan (masing-masing lebar 50%) pada jam `07:30 - 09:00`:
       - Blok A: `Matematika` (`Budi Santoso, S.Pd.`, `Ruang VII-A`)
       - Blok B: `Ilmu Pengetahuan Alam (IPA)` (`Siti Aminah, M.Pd.`, `Lab IPA`)
     - Menampilkan bingkai merah peringatan `CLASS_OVERLAP` (*Jadwal Kelas Tumpang Tindih*) dan status `"Konflik ditemukan"`.
  2. **Mode 2 (`resolved_sequential`): Sesi Dipindah Berurutan (`07:30 - 09:00` & `09:00 - 10:30`)**
     - Menampilkan `Matematika` pada `07:30 - 09:00` dan `Ilmu Pengetahuan Alam (IPA)` tepat sesudahnya pada `09:00 - 10:30`.
     - Menjelaskan aturan batas waktu tepat Schedovyn (`startA < endB && startB < endA`): sesi yang berakhir pukul `09:00` dan sesi berikutnya yang dimulai pukul `09:00` **tidak** dianggap bertabrakan.
  3. **Mode 3 (`unscheduled_removed`): Dilepas ke Panel Belum Terjadwal**
     - Menyimulasikan hasil menekan tombol **"Lepas dari Grid"** pada sesi kedua sehingga grid kembali menampilkan 1 sesi utuh dan kartu sesi kedua kembali ke daftar **Belum Terjadwal** dengan tombol aksi **"Tempatkan ke Jadwal"**.

---

### 2.5 Kontrak `KeyboardShortcutSwitch.tsx` (`src/components/replicas/KeyboardShortcutSwitch.tsx`)

```ts
export type ShortcutPlatform = "windows-linux" | "macos";

export interface KeyboardShortcutItem {
  readonly id: string;
  readonly actionLabel: string;
  readonly windowsLinuxKeys: readonly string[];
  readonly macosKeys: readonly string[];
  readonly description: string;
}

export interface KeyboardShortcutSwitchProps {
  readonly initialPlatform?: ShortcutPlatform;
}
```

- Menyediakan sakelar dua tombol (`"Windows / Linux"` vs `"macOS"`) yang mengubah tampilan `<kbd>` secara reaktif untuk ke-7 pintasan resmi Schedovyn (`PRD Bab 4 Modul 6.3` & `TDD Bab 6.5`):
  1. **Batal Perubahan (*Undo*):** `Ctrl + Z` (Windows/Linux) / `Cmd + Z` (macOS)
  2. **Ulangi Perubahan (*Redo*):** `Ctrl + Y` atau `Ctrl + Shift + Z` (Windows/Linux) / `Cmd + Shift + Z` (macOS)
  3. **Geser Waktu Sesi Maju / Mundur:** `Alt + ArrowUp` / `Alt + ArrowDown` (Windows/Linux) / `Option + ArrowUp` / `Option + ArrowDown` (macOS)
  4. **Pindahkan Sesi Antar-Hari:** `Alt + ArrowLeft` / `Alt + ArrowRight` (Windows/Linux) / `Option + ArrowLeft` / `Option + ArrowRight` (macOS)
  5. **Lepas dari Grid:** `Delete` / `Backspace` (Windows/Linux & macOS)
  6. **Fokus ke Panel Detail Sesi:** `Enter` (Windows/Linux & macOS)
  7. **Ganti Tema Tampilan:** `D` (Windows/Linux & macOS)

---

### 2.6 Integrasi ke `src/lib/mdx-loader.ts`
- Impor dan daftarkan kelima komponen replika ke dalam objek `mdxComponents` pada `src/lib/mdx-loader.ts`:
  - `ValidationStatusBadgesReplica`
  - `ConflictDictionaryExplorer`
  - `SaveStatusBadgeReplica`
  - `SessionBlockOverlapReplica`
  - `KeyboardShortcutSwitch`
- Perbarui juga fungsi `buildFallbackMdx(meta)` di `src/lib/mdx-loader.ts` agar menyertakan tag komponen replika yang sesuai dengan `meta.articleSlug` (mengacu Tabel Bab 2.2 TDD) sehingga rute artikel terkait langsung merender replika interaktifnya.

---

## 3. Acceptance Criteria (Given-When-Then)

1. **Skenario 1: Interaksi 4 Lencana Status Validasi (`FR-UG-03`, `AC-UG-04`, `AC-UG-05`)**
   - **Given** `ValidationStatusBadgesReplica` dirender di dalam halaman panduan,
   - **When** pengguna melihat daftar lencana status dan mengeklik masing-masing lencana (`"Konflik ditemukan"`, `"Belum lengkap"`, `"Tidak ada konflik pada data saat ini"`, `"Jadwal lengkap dan valid"`),
   - **Then** komponen menampilkan kode sistem yang tepat (`CONFLICT_DETECTED`, `INCOMPLETE`, `NO_CONFLICT_CURRENT_DATA`, `COMPLETE_AND_VALID`), kondisi Kelas Aktif vs Seluruh Ruang Kerja, contoh kasus `SMP Negeri 1 Nusantara`, serta langkah tindakan yang sesuai.

2. **Skenario 2: Filter Kategori & Pencarian pada Kamus 12 Konflik/Peringatan (`FR-UG-04`, `AC-UG-04`)**
   - **Given** `ConflictDictionaryExplorer` dirender dengan filter awal `"ALL"`,
   - **When** komponen pertama kali tampil,
   - **Then** seluruh 12 item kamus (7 `ERROR` dan 5 `WARNING`) ditampilkan lengkap dengan kode sistem dan langkah perbaikannya.
   - **And When** pengguna mengeklik tombol filter `"Bentrokan Waktu / Error (7)"`,
   - **Then** hanya ke-7 item konflik waktu (`CLASS_OVERLAP` s.d. `BREAK_TIME_OVERLAP`) yang ditampilkan.
   - **And When** pengguna mengeklik tombol filter `"Kelengkapan / Warning (5)"`,
   - **Then** hanya ke-5 item peringatan kelengkapan (`UNFULFILLED_REQUIREMENT` s.d. `UNCONFIGURED_CLASS`) yang ditampilkan.
   - **And When** pengguna mengetik `"TEACHER_OVERLAP"` atau `"istirahat"` pada input pencarian,
   - **Then** daftar langsung menyaring item yang cocok, dan apabila kata kunci tidak ditemukan (misalnya `"xyz999"`), menampilkan pesan *empty state* beserta tombol reset.

3. **Skenario 3: Simulasi 3 Status Penyimpanan Otomatis IndexedDB (`FR-UG-03`, `AC-UG-05`)**
   - **Given** `SaveStatusBadgeReplica` dirender,
   - **When** pengguna beralih di antara `"Menyimpan..."`, `"Tersimpan di browser"`, dan `"Gagal menyimpan lokal"`,
   - **Then** lencana replika menampilkan teks status yang 100% identik dengan aplikasi utama, menampilkan rincian waktu simpan (`HH:mm:ss`) serta kuota `IndexedDB` pada mode `"Tersimpan di browser"`, dan menampilkan solusi `Ruang Penyimpanan Browser Penuh` / `Akses Penyimpanan Dibatasi` pada mode `"Gagal menyimpan lokal"`.

4. **Skenario 4: Peraga Blok Sesi Overlap Cluster & Aksi `"Lepas dari Grid"` (`FR-UG-03`, `AC-UG-05`)**
   - **Given** `SessionBlockOverlapReplica` dirender pada mode *overlap cluster*,
   - **When** pengguna mengeklik tombol **"Lepas dari Grid"** atau tombol simulasi jadwal berurutan (`07:30 - 09:00` dan `09:00 - 10:30`),
   - **Then** peringatan `CLASS_OVERLAP` hilang, menampilkan kondisi bebas konflik, dan pada mode dilepas menampilkan tombol **"Tempatkan ke Jadwal"** untuk mengembalikan sesi ke grid.

5. **Skenario 5: Sakelar Pintasan Keyboard Windows/Linux vs macOS (`FR-UG-04`)**
   - **Given** `KeyboardShortcutSwitch` dirender dengan platform default `"windows-linux"`,
   - **When** pengguna mengeklik tombol sakelar `"macOS"`,
   - **Then** label tombol pintasan berubah dari `Ctrl + Z` dan `Alt + ArrowUp` menjadi `Cmd + Z` dan `Option + ArrowUp`.

---

## 4. Breakdown Task Eksekusi (TDD Roadmap)

### Langkah 0: Eksplorasi Konteks dengan `codegraph` (Wajib untuk QA & Frontend Engineer)
Sebelum menulis pengujian atau kode implementasi, jalankan:
```bash
codegraph explore "compileDocArticle mdxComponents Badge Button Input"
```

---

### Fase 1: Task QA Engineer (Fase RED)

**QA Engineer** wajib membuat berkas pengujian otomatis **`src/__tests__/interactive-replicas.test.tsx`** terlebih dahulu dan memastikan pengujian gagal (**RED**) karena ke-5 komponen di `src/components/replicas/` belum dibuat:

1. **Pengujian `ValidationStatusBadgesReplica`:**
   - Memverifikasi ke-4 lencana (`"Konflik ditemukan"`, `"Belum lengkap"`, `"Tidak ada konflik pada data saat ini"`, `"Jadwal lengkap dan valid"`) beserta ke-4 kode sistem (`CONFLICT_DETECTED`, `INCOMPLETE`, `NO_CONFLICT_CURRENT_DATA`, `COMPLETE_AND_VALID`) dirender dan merespons klik pergantian status.
   - Memverifikasi semua data dalam `VALIDATION_STATUS_ITEMS` bebas dari karakter *em dash* (`NFR-UG-01`).

2. **Pengujian `ConflictDictionaryExplorer`:**
   - Memverifikasi jumlah total item pada `ALL` adalah `12` (`7` Error + `5` Warning).
   - Memverifikasi klik filter `"Bentrokan Waktu / Error (7)"` hanya menampilkan 7 kode Error (`CLASS_OVERLAP`, `TEACHER_OVERLAP`, `ROOM_OVERLAP`, `TEACHER_UNAVAILABLE`, `ROOM_UNAVAILABLE`, `OUTSIDE_OPERATING_HOURS`, `BREAK_TIME_OVERLAP`).
   - Memverifikasi klik filter `"Kelengkapan / Warning (5)"` hanya menampilkan 5 kode Warning (`UNFULFILLED_REQUIREMENT`, `OVER_SCHEDULED_SESSION`, `MISSING_TEACHER`, `MISSING_REQUIRED_ROOM`, `UNCONFIGURED_CLASS`).
   - Memverifikasi pencarian kata kunci `"TEACHER_OVERLAP"` atau `"Istirahat"` menyaring item dengan tepat, serta pencarian `"tidakadakonflikxyz"` menampilkan *empty state* dan tombol reset.
   - Memverifikasi seluruh `CONFLICT_DICTIONARY_ITEMS` bebas dari karakter *em dash*.

3. **Pengujian `SaveStatusBadgeReplica`:**
   - Memverifikasi ketiga label resmi (`"Menyimpan..."`, `"Tersimpan di browser"`, `"Gagal menyimpan lokal"`) dapat dipilih dan menampilkan rincian kuota IndexedDB maupun panduan penanganan galat penyimpanan.

4. **Pengujian `SessionBlockOverlapReplica`:**
   - Memverifikasi tampilan awal *overlap cluster* (`CLASS_OVERLAP`), interaksi tombol `"Lepas dari Grid"`, tombol `"Tempatkan ke Jadwal"`, serta mode berurutan bebas konflik (`07:30 - 09:00` dan `09:00 - 10:30`).

5. **Pengujian `KeyboardShortcutSwitch`:**
   - Memverifikasi tampilan awal `"Windows / Linux"` (`Ctrl + Z`, `Alt + ArrowUp`) dan perubahan reaktif saat sakelar `"macOS"` diklik (`Cmd + Z`, `Option + ArrowUp`), termasuk keberadaan aksi `"Batal Perubahan"`, `"Ulangi Perubahan"`, dan `"Lepas dari Grid"`.

6. **Pengujian Integrasi MDX (`compileDocArticle`):**
   - Memverifikasi bahwa `compileDocArticle` berhasil merender artikel yang menyematkan komponen replika (misalnya artikel `4.1` dan `4.2`) tanpa error.

---

### Fase 2: Task Frontend Engineer (Fase GREEN & Refactor)

Setelah berkas pengujian Fase RED tersedia, **Frontend Engineer** mengimplementasikan berkas-berkas berikut hingga seluruh pengujian berstatus **GREEN**:

1. **Implementasi 5 Komponen Replika di `src/components/replicas/`:**
   - `src/components/replicas/ValidationStatusBadgesReplica.tsx`
   - `src/components/replicas/ConflictDictionaryExplorer.tsx`
   - `src/components/replicas/SaveStatusBadgeReplica.tsx`
   - `src/components/replicas/SessionBlockOverlapReplica.tsx`
   - `src/components/replicas/KeyboardShortcutSwitch.tsx`
   *(Hapus berkas placeholder `src/components/replicas/.gitkeep` setelah kelima komponen dibuat).*

2. **Integrasi ke `src/lib/mdx-loader.ts`:**
   - Impor kelima komponen replika ke dalam `src/lib/mdx-loader.ts` dan daftarkan pada objek `mdxComponents`.
   - Perbarui `buildFallbackMdx(meta)` agar menyertakan komponen replika yang relevan untuk artikel terkait sesuai Tabel Bab 2.2 pada `docs/Schedovyn-User-Guide-TDD.md`.

3. **Verifikasi Kualitas Akhir & Sinkronisasi `codegraph`:**
   Jalankan seluruh perintah berikut dan pastikan semuanya lulus (`0` error, `100% GREEN`):
   ```bash
   bun run typecheck
   bun run test
   bun run lint
   bun run build
   codegraph sync
   ```
