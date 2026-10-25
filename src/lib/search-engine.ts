import MiniSearch from "minisearch";
import { DOCS_MODULES, type ModuleNumber } from "./docs-registry";

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

interface IndexedDocRecord {
  readonly id: string;
  readonly articleTitle: string;
  readonly sectionHeading: string;
  readonly moduleNumber: ModuleNumber;
  readonly moduleTitle: string;
  readonly href: string;
  readonly keywordsText: string;
  readonly content: string;
}

const ARTICLE_EXTRA_KEYWORDS: Readonly<Record<string, readonly string[]>> = {
  "mengenal-schedovyn": [
    "local-first",
    "zero-login",
    "kelas aktif",
    "validasi ruang kerja",
  ],
  "mulai-cepat-10-menit": [
    "quick start",
    "SMP Negeri 1 Nusantara",
    "langkah awal",
    "panduan cepat",
  ],
  "tata-letak-aplikasi": [
    "header bar",
    "save status badge",
    "Tersimpan di browser",
    "Menyimpan...",
    "Gagal menyimpan lokal",
    "Pasang Aplikasi",
  ],
  "pengaturan-jam-belajar": [
    "istirahat",
    "jam istirahat",
    "hari Jumat",
    "interval snap",
    "jam mulai",
    "jam selesai",
  ],
  "kelola-kelas-mapel-guru-ruangan": [
    "data master",
    "rombongan belajar",
    "warna mata pelajaran",
    "guru tidak bersedia",
    "laboratorium",
    "cascade delete",
  ],
  "kebutuhan-pembelajaran-mingguan": [
    "teaching requirements",
    "sessionsPerWeek",
    "durationMinutes",
    "roomRequired",
    "wajib ruangan khusus",
  ],
  "memilih-kelas-aktif": [
    "pemilih kelas",
    "Terjadwal",
    "Belum Terjadwal",
    "Kelas VII-A",
    "Kelas VII-B",
  ],
  "menempatkan-sesi-belum-terjadwal": [
    "drag and drop",
    "tarik lepas",
    "Tempatkan ke Jadwal",
    "filter mata pelajaran",
  ],
  "menyunting-dan-memindahkan-sesi": [
    "panel detail sesi",
    "Lepas dari Grid",
    "overlap cluster",
    "pindahkan sesi",
  ],
  "riwayat-undo-dan-redo": [
    "undo",
    "redo",
    "Batal Perubahan",
    "Ulangi Perubahan",
    "50 langkah",
    "Ctrl+Z",
  ],
  "menyalin-jadwal-antar-kelas": [
    "Salin Jadwal",
    "kelas paralel",
    "timpa seluruh jadwal lama",
    "gabungkan",
  ],
  "empat-status-validasi": [
    "CONFLICT_DETECTED",
    "INCOMPLETE",
    "NO_CONFLICT_CURRENT_DATA",
    "COMPLETE_AND_VALID",
    "Konflik ditemukan",
    "Belum lengkap",
    "Tidak ada konflik pada data saat ini",
    "Jadwal lengkap dan valid",
  ],
  "kamus-tujuh-konflik-waktu": [
    "CLASS_OVERLAP",
    "TEACHER_OVERLAP",
    "ROOM_OVERLAP",
    "TEACHER_UNAVAILABLE",
    "ROOM_UNAVAILABLE",
    "OUTSIDE_OPERATING_HOURS",
    "BREAK_TIME_OVERLAP",
    "konflik guru",
    "bentrokan jadwal guru",
    "bentrokan ruangan",
    "tumpang tindih",
  ],
  "kamus-lima-peringatan-kelengkapan": [
    "UNFULFILLED_REQUIREMENT",
    "OVER_SCHEDULED_SESSION",
    "MISSING_TEACHER",
    "MISSING_REQUIRED_ROOM",
    "UNCONFIGURED_CLASS",
    "peringatan kelengkapan",
  ],
  "matriks-kelengkapan-kelas": [
    "ringkasan validasi",
    "matriks kelas",
    "seluruh ruang kerja",
  ],
  "ekspor-pdf-landscape": [
    "pdf",
    "cetak",
    "landscape",
    "A4",
    "F4",
  ],
  "ekspor-excel-dan-rekap-guru": [
    "excel",
    "xlsx",
    "Rekap Guru",
    "Rekap Ruangan",
    "beban mengajar",
    "sanitasi formula",
  ],
  "penyimpanan-otomatis-indexeddb": [
    "indexeddb",
    "auto-save",
    "Tersimpan di browser",
    "Menyimpan...",
    "Gagal menyimpan lokal",
    "penyimpanan browser penuh",
  ],
  "pasang-aplikasi-pwa-offline": [
    "pwa",
    "offline",
    "Pasang Aplikasi",
    "Pembaruan Aplikasi Tersedia",
  ],
  "daftar-pintasan-keyboard": [
    "keyboard",
    "shortcut",
    "pintasan",
    "Ctrl+Z",
    "Alt+ArrowUp",
    "macOS",
    "Windows",
  ],
  "studi-kasus-smp-nusantara": [
    "studi kasus",
    "SMP Negeri 1 Nusantara",
    "Kelas VII-A",
    "Kelas VII-B",
    "Lab IPA",
  ],
};

export const DEFAULT_SEARCHABLE_SECTIONS: readonly SearchableDocSection[] =
  DOCS_MODULES.flatMap((moduleGroup) =>
    moduleGroup.articles.map((article) => ({
      id: article.href,
      articleTitle: article.title,
      sectionHeading: `${article.order} ${article.title}`,
      moduleNumber: article.moduleNumber,
      moduleTitle: article.moduleTitle,
      href: article.href,
      keywords: ARTICLE_EXTRA_KEYWORDS[article.articleSlug] ?? [],
      content: article.description,
    }))
  );

function buildExcerpt(content: string, query: string): string {
  const clean = content.replace(/\s+/g, " ").trim();
  if (clean.length <= 160) {
    return clean;
  }

  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .filter((term) => term.length > 1);
  const lower = clean.toLowerCase();

  for (const term of terms) {
    const matchIndex = lower.indexOf(term);
    if (matchIndex !== -1) {
      const start = Math.max(0, matchIndex - 45);
      const end = Math.min(clean.length, start + 160);
      const prefix = start > 0 ? "..." : "";
      const suffix = end < clean.length ? "..." : "";
      return `${prefix}${clean.slice(start, end).trim()}${suffix}`;
    }
  }

  return `${clean.slice(0, 157).trim()}...`;
}

export function createDocsSearchIndex(
  sections: readonly SearchableDocSection[] = DEFAULT_SEARCHABLE_SECTIONS
): MiniSearch<IndexedDocRecord> {
  const miniSearch = new MiniSearch<IndexedDocRecord>({
    fields: ["articleTitle", "sectionHeading", "keywordsText", "content", "moduleTitle"],
    storeFields: [
      "id",
      "articleTitle",
      "sectionHeading",
      "moduleNumber",
      "moduleTitle",
      "href",
      "keywordsText",
      "content",
    ],
    tokenize: (text) =>
      text
        .toLowerCase()
        .split(/[\s,.;:!?()[\]{}"'/+-]+/)
        .filter(Boolean),
    searchOptions: {
      boost: {
        keywordsText: 4,
        articleTitle: 3,
        sectionHeading: 2.5,
        content: 1.5,
        moduleTitle: 1,
      },
      prefix: true,
      fuzzy: 0.2,
    },
  });

  const records: IndexedDocRecord[] = sections.map((section) => ({
    id: section.id,
    articleTitle: section.articleTitle,
    sectionHeading: section.sectionHeading,
    moduleNumber: section.moduleNumber,
    moduleTitle: section.moduleTitle,
    href: section.href,
    keywordsText: section.keywords.join(" "),
    content: section.content,
  }));

  miniSearch.addAll(records);
  return miniSearch;
}

export function searchDocsSections(
  query: string,
  sections: readonly SearchableDocSection[] = DEFAULT_SEARCHABLE_SECTIONS
): readonly SearchResultItem[] {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const index = createDocsSearchIndex(sections);
  const rawResults = index.search(trimmed);

  return rawResults.map((result) => {
    const content =
      typeof result.content === "string" ? result.content : "";
    return {
      id: String(result.id),
      articleTitle: String(result.articleTitle),
      sectionHeading: String(result.sectionHeading),
      moduleNumber: result.moduleNumber as ModuleNumber,
      moduleTitle: String(result.moduleTitle),
      href: String(result.href),
      excerpt: buildExcerpt(content, trimmed),
      score: result.score,
    };
  });
}

export function searchDocsGroupedByModule(
  query: string,
  sections: readonly SearchableDocSection[] = DEFAULT_SEARCHABLE_SECTIONS
): readonly SearchResultModuleGroup[] {
  const results = searchDocsSections(query, sections);
  if (results.length === 0) {
    return [];
  }

  const groupMap = new Map<
    ModuleNumber,
    { moduleTitle: string; items: SearchResultItem[] }
  >();

  for (const item of results) {
    const existing = groupMap.get(item.moduleNumber);
    if (existing) {
      existing.items.push(item);
    } else {
      groupMap.set(item.moduleNumber, {
        moduleTitle: item.moduleTitle,
        items: [item],
      });
    }
  }

  return Array.from(groupMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([moduleNumber, group]) => ({
      moduleNumber,
      moduleTitle: group.moduleTitle,
      items: group.items,
    }));
}
