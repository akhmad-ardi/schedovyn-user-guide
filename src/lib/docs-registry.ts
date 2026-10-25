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

function createArticle(
  moduleNumber: ModuleNumber,
  moduleSlug: string,
  moduleTitle: string,
  order: string,
  articleSlug: string,
  title: string,
  description: string
): DocArticleMeta {
  return {
    order,
    title,
    description,
    moduleNumber,
    moduleSlug,
    moduleTitle,
    articleSlug,
    href: `/docs/${moduleSlug}/${articleSlug}`,
    filePath: `${moduleSlug}/${articleSlug}.mdx`,
  };
}

export const DOCS_MODULES: readonly DocModuleGroup[] = [
  {
    moduleNumber: "01",
    moduleSlug: "01-pengenalan",
    title: "Pengenalan & Mulai Cepat",
    description:
      "Pahami prinsip penyusunan jadwal berbasis kelas aktif dengan validasi seluruh sekolah serta panduan mulai cepat 10 menit.",
    articles: [
      createArticle(
        "01",
        "01-pengenalan",
        "Pengenalan & Mulai Cepat",
        "1.1",
        "mengenal-schedovyn",
        "Mengenal Schedovyn & Prinsip Kerja",
        "Konsep penyuntingan per kelas aktif dengan deteksi bentrokan di seluruh ruang kerja sekolah secara real-time dan local-first."
      ),
      createArticle(
        "01",
        "01-pengenalan",
        "Pengenalan & Mulai Cepat",
        "1.2",
        "mulai-cepat-10-menit",
        "Panduan Mulai Cepat 10 Menit",
        "Alur 5 langkah praktis mulai dari ruang kerja contoh SMP Negeri 1 Nusantara hingga berhasil mengunduh jadwal PDF pertama."
      ),
      createArticle(
        "01",
        "01-pengenalan",
        "Pengenalan & Mulai Cepat",
        "1.3",
        "tata-letak-aplikasi",
        "Mengenal Tata Letak Aplikasi",
        "Penjelasan fungsi Header Bar, indikator status penyimpanan lokal, Class Selector Bar, dan 3 panel utama pada kanvas editor jadwal."
      ),
    ],
  },
  {
    moduleNumber: "02",
    moduleSlug: "02-ruang-kerja-dan-data-master",
    title: "Persiapan Ruang Kerja & Data Master",
    description:
      "Atur jam operasional sekolah per hari, waktu istirahat, data kelas, guru, mata pelajaran, ruangan, serta target kebutuhan sesi mingguan.",
    articles: [
      createArticle(
        "02",
        "02-ruang-kerja-dan-data-master",
        "Persiapan Ruang Kerja & Data Master",
        "2.1",
        "pengaturan-jam-belajar",
        "Mengatur Identitas Sekolah & Jam Belajar",
        "Cara mengubah nama ruang kerja, periode akademik, interval snap, hari sekolah aktif, jam operasional harian, dan waktu istirahat."
      ),
      createArticle(
        "02",
        "02-ruang-kerja-dan-data-master",
        "Persiapan Ruang Kerja & Data Master",
        "2.2",
        "kelola-kelas-mapel-guru-ruangan",
        "Mengelola Kelas, Guru, Mata Pelajaran, dan Ruangan",
        "Panduan mendaftarkan rombongan belajar, memilih warna mata pelajaran, mengatur waktu tidak bersedia guru, dan ketersediaan ruangan."
      ),
      createArticle(
        "02",
        "02-ruang-kerja-dan-data-master",
        "Persiapan Ruang Kerja & Data Master",
        "2.3",
        "kebutuhan-pembelajaran-mingguan",
        "Menyusun Kebutuhan Pembelajaran Mingguan",
        "Menentukan alokasi mata pelajaran per kelas, guru pengajar default, target sesi per minggu, durasi sesi, dan kewajiban ruangan khusus."
      ),
    ],
  },
  {
    moduleNumber: "03",
    moduleSlug: "03-menyusun-jadwal-editor",
    title: "Menyusun Jadwal di Kanvas Editor",
    description:
      "Tempatkan sesi pembelajaran ke grid waktu, sunting detail sesi, gunakan riwayat perubahan, dan salin jadwal antar-kelas paralel.",
    articles: [
      createArticle(
        "03",
        "03-menyusun-jadwal-editor",
        "Menyusun Jadwal di Kanvas Editor",
        "3.1",
        "memilih-kelas-aktif",
        "Memilih & Berpindah Kelas Aktif",
        "Cara berpindah antar-rombongan belajar di editor dan membaca indikator kuota sesi Terjadwal serta Belum Terjadwal."
      ),
      createArticle(
        "03",
        "03-menyusun-jadwal-editor",
        "Menyusun Jadwal di Kanvas Editor",
        "3.2",
        "menempatkan-sesi-belum-terjadwal",
        "Menempatkan Sesi dari Panel Belum Terjadwal",
        "Memfilter daftar sesi dan menempatkannya ke jadwal melalui tarik-lepas atau tombol Tempatkan ke Jadwal."
      ),
      createArticle(
        "03",
        "03-menyusun-jadwal-editor",
        "Menyusun Jadwal di Kanvas Editor",
        "3.3",
        "menyunting-dan-memindahkan-sesi",
        "Menyunting, Memindahkan, dan Melepas Sesi di Grid",
        "Menggeser jam mulai sesi, mengganti guru atau ruangan lewat Panel Detail Sesi, memahami tampilan overlap cluster, dan tombol Lepas dari Grid."
      ),
      createArticle(
        "03",
        "03-menyusun-jadwal-editor",
        "Menyusun Jadwal di Kanvas Editor",
        "3.4",
        "riwayat-undo-dan-redo",
        "Menggunakan Riwayat Perubahan (Undo & Redo)",
        "Membatalkan atau mengulangi hingga 50 langkah penyuntingan terakhir menggunakan tombol Batal Perubahan dan Ulangi Perubahan."
      ),
      createArticle(
        "03",
        "03-menyusun-jadwal-editor",
        "Menyusun Jadwal di Kanvas Editor",
        "3.5",
        "menyalin-jadwal-antar-kelas",
        "Menyalin Jadwal ke Kelas Lain",
        "Panduan fitur Salin Jadwal untuk menduplikasi susunan jadwal ke kelas paralel beserta pilihan mode penanganan dan strategi guru."
      ),
    ],
  },
  {
    moduleNumber: "04",
    moduleSlug: "04-kamus-konflik-dan-validasi",
    title: "Kamus Konflik & Ringkasan Validasi",
    description:
      "Referensi lengkap 4 status validasi jadwal, 7 jenis bentrokan waktu (Error), 5 peringatan kelengkapan (Warning), dan matriks kelas.",
    articles: [
      createArticle(
        "04",
        "04-kamus-konflik-dan-validasi",
        "Kamus Konflik & Ringkasan Validasi",
        "4.1",
        "empat-status-validasi",
        "Memahami 4 Status Validasi Jadwal",
        "Arti lencana Konflik ditemukan, Belum lengkap, Tidak ada konflik pada data saat ini, dan Jadwal lengkap dan valid."
      ),
      createArticle(
        "04",
        "04-kamus-konflik-dan-validasi",
        "Kamus Konflik & Ringkasan Validasi",
        "4.2",
        "kamus-tujuh-konflik-waktu",
        "Kamus 7 Jenis Bentrokan Waktu (Error)",
        "Penyebab dan langkah perbaikan untuk CLASS_OVERLAP, TEACHER_OVERLAP, ROOM_OVERLAP, TEACHER_UNAVAILABLE, ROOM_UNAVAILABLE, OUTSIDE_OPERATING_HOURS, dan BREAK_TIME_OVERLAP."
      ),
      createArticle(
        "04",
        "04-kamus-konflik-dan-validasi",
        "Kamus Konflik & Ringkasan Validasi",
        "4.3",
        "kamus-lima-peringatan-kelengkapan",
        "Kamus 5 Peringatan Kelengkapan (Warning)",
        "Penjelasan dan cara mengatasi UNFULFILLED_REQUIREMENT, OVER_SCHEDULED_SESSION, MISSING_TEACHER, MISSING_REQUIRED_ROOM, dan UNCONFIGURED_CLASS."
      ),
      createArticle(
        "04",
        "04-kamus-konflik-dan-validasi",
        "Kamus Konflik & Ringkasan Validasi",
        "4.4",
        "matriks-kelengkapan-kelas",
        "Menggunakan Dialog Ringkasan Validasi & Matriks Kelas",
        "Membandingkan status kelas aktif terhadap seluruh ruang kerja dan melompat langsung ke kelas yang masih memiliki kendala."
      ),
    ],
  },
  {
    moduleNumber: "05",
    moduleSlug: "05-ekspor-dokumen",
    title: "Ekspor Dokumen (PDF & Excel)",
    description:
      "Cetak jadwal kelas dalam format PDF Landscape siap tempel dan unduh laporan Excel 4 lembar kerja termasuk analisis beban mengajar guru.",
    articles: [
      createArticle(
        "05",
        "05-ekspor-dokumen",
        "Ekspor Dokumen (PDF & Excel)",
        "5.1",
        "ekspor-pdf-landscape",
        "Panduan Ekspor PDF Cetak Landscape",
        "Memilih cakupan cetak kelas aktif atau seluruh ruang kerja, memahami dialog pra-ekspor, dan pengaturan kertas A4 atau F4 Landscape."
      ),
      createArticle(
        "05",
        "05-ekspor-dokumen",
        "Ekspor Dokumen (PDF & Excel)",
        "5.2",
        "ekspor-excel-dan-rekap-guru",
        "Panduan Ekspor Excel (.xlsx) & Analisis Beban Guru",
        "Penjelasan isi 4 lembar kerja (Jadwal, Rekap Guru, Rekap Ruangan, Konflik) serta perlindungan keamanan sanitasi formula spreadsheet."
      ),
    ],
  },
  {
    moduleNumber: "06",
    moduleSlug: "06-penyimpanan-pwa-dan-pintasan",
    title: "Penyimpanan Lokal, PWA Offline & Pintasan",
    description:
      "Cara kerja penyimpanan otomatis IndexedDB di peramban, pemasangan aplikasi desktop offline (PWA), daftar pintasan keyboard, dan studi kasus terpadu.",
    articles: [
      createArticle(
        "06",
        "06-penyimpanan-pwa-dan-pintasan",
        "Penyimpanan Lokal, PWA Offline & Pintasan",
        "6.1",
        "penyimpanan-otomatis-indexeddb",
        "Cara Kerja Penyimpanan Otomatis Lokal (Auto-Save)",
        "Memahami status Menyimpan..., Tersimpan di browser, dan Gagal menyimpan lokal beserta pemeriksaan kuota penyimpanan peramban."
      ),
      createArticle(
        "06",
        "06-penyimpanan-pwa-dan-pintasan",
        "Penyimpanan Lokal, PWA Offline & Pintasan",
        "6.2",
        "pasang-aplikasi-pwa-offline",
        "Memasang Aplikasi ke Komputer & Bekerja Offline (PWA)",
        "Cara menggunakan tombol Pasang Aplikasi di header untuk menjalankan Schedovyn tanpa internet dan memperbarui versi aplikasi."
      ),
      createArticle(
        "06",
        "06-penyimpanan-pwa-dan-pintasan",
        "Penyimpanan Lokal, PWA Offline & Pintasan",
        "6.3",
        "daftar-pintasan-keyboard",
        "Daftar Lengkap Pintasan Keyboard",
        "Referensi tombol cepat untuk Windows, Linux, dan macOS guna mempercepat pemindahan sesi, pembatalan perubahan, dan pergantian tema."
      ),
      createArticle(
        "06",
        "06-penyimpanan-pwa-dan-pintasan",
        "Penyimpanan Lokal, PWA Offline & Pintasan",
        "6.4",
        "studi-kasus-smp-nusantara",
        "Studi Kasus: Menyusun Jadwal SMP Negeri 1 Nusantara dari Nol",
        "Tutorial terpadu menyusun jadwal 2 kelas paralel, menangani guru lintas kelas, menyalin jadwal, hingga mencapai status Jadwal lengkap dan valid."
      ),
    ],
  },
];

const ALL_ARTICLES: readonly DocArticleMeta[] = DOCS_MODULES.flatMap(
  (moduleGroup) => moduleGroup.articles
);

export function getAllDocArticles(): readonly DocArticleMeta[] {
  return ALL_ARTICLES;
}

export function getDocArticleBySlug(
  slugParts?: readonly string[]
): DocArticleMeta | null {
  if (!slugParts || slugParts.length === 0) {
    return ALL_ARTICLES[0] ?? null;
  }

  if (slugParts.length === 1) {
    const single = slugParts[0];
    const byModule = DOCS_MODULES.find((m) => m.moduleSlug === single);
    if (byModule && byModule.articles.length > 0) {
      return byModule.articles[0] ?? null;
    }
    return ALL_ARTICLES.find((a) => a.articleSlug === single) ?? null;
  }

  if (slugParts.length === 2) {
    const [moduleSlug, articleSlug] = slugParts;
    return (
      ALL_ARTICLES.find(
        (article) =>
          article.moduleSlug === moduleSlug &&
          article.articleSlug === articleSlug
      ) ?? null
    );
  }

  return null;
}

export function getAdjacentArticles(currentHref: string): AdjacentArticles {
  const normalizedHref = currentHref.replace(/\/+$/, "");
  const index = ALL_ARTICLES.findIndex(
    (article) => article.href === normalizedHref
  );

  if (index === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: index > 0 ? (ALL_ARTICLES[index - 1] ?? null) : null,
    next:
      index < ALL_ARTICLES.length - 1 ? (ALL_ARTICLES[index + 1] ?? null) : null,
  };
}
