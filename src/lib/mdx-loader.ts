import fs from "node:fs/promises";
import path from "node:path";
import * as React from "react";
import type { ReactNode } from "react";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import type { DocArticleMeta } from "./docs-registry";
import { Callout } from "@/components/docs/Callout";
import { StepItem, StepList } from "@/components/docs/StepList";
import { ValidationStatusBadgesReplica } from "@/components/replicas/ValidationStatusBadgesReplica";
import { ConflictDictionaryExplorer } from "@/components/replicas/ConflictDictionaryExplorer";
import { SaveStatusBadgeReplica } from "@/components/replicas/SaveStatusBadgeReplica";
import { SessionBlockOverlapReplica } from "@/components/replicas/SessionBlockOverlapReplica";
import { KeyboardShortcutSwitch } from "@/components/replicas/KeyboardShortcutSwitch";

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

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function extractHeadingsFromMdx(
  rawMdx: string
): readonly TocHeadingItem[] {
  const withoutFrontmatter = rawMdx.replace(
    /^---\r?\n[\s\S]*?\r?\n---\r?\n?/,
    ""
  );
  const lines = withoutFrontmatter.split(/\r?\n/);
  const headings: TocHeadingItem[] = [];
  let inCodeBlock = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("```") || trimmed.startsWith("~~~")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock) {
      continue;
    }

    const match = /^(#{2,3})\s+(.+)$/.exec(trimmed);
    if (!match) {
      continue;
    }

    const hashes = match[1];
    const rawHeadingText = match[2];
    if (!hashes || !rawHeadingText) {
      continue;
    }

    const cleanText = rawHeadingText
      .replace(/[`*_~]+/g, "")
      .replace(/\s+#+\s*$/, "")
      .trim();

    if (!cleanText) {
      continue;
    }

    headings.push({
      id: slugifyHeading(cleanText),
      text: cleanText,
      level: hashes.length === 2 ? 2 : 3,
    });
  }

  return headings;
}

function extractTextFromChildren(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(extractTextFromChildren).join("");
  }
  if (React.isValidElement<{ readonly children?: ReactNode }>(children)) {
    return extractTextFromChildren(children.props.children);
  }
  return "";
}

function getReplicaTagForArticle(articleSlug: string): string {
  switch (articleSlug) {
    case "empat-status-validasi":
    case "mengenal-schedovyn":
    case "studi-kasus-smp-nusantara":
      return "\n<ValidationStatusBadgesReplica />\n";
    case "kamus-tujuh-konflik-waktu":
      return '\n<ConflictDictionaryExplorer initialFilter="ERROR" />\n';
    case "kamus-lima-peringatan-kelengkapan":
      return '\n<ConflictDictionaryExplorer initialFilter="WARNING" />\n';
    case "penyimpanan-otomatis-indexeddb":
    case "tata-letak-aplikasi":
      return "\n<SaveStatusBadgeReplica />\n";
    case "menyunting-dan-memindahkan-sesi":
      return "\n<SessionBlockOverlapReplica />\n";
    case "daftar-pintasan-keyboard":
      return "\n<KeyboardShortcutSwitch />\n";
    default:
      return "";
  }
}

function buildFallbackMdx(meta: DocArticleMeta): string {
  const replicaSnippet = getReplicaTagForArticle(meta.articleSlug);

  return [
    "## Ringkasan Panduan",
    "",
    meta.description,
    "",
    `<Callout variant="info" title="Modul ${meta.moduleNumber}: ${meta.moduleTitle}">`,
    `Panduan bab ${meta.order} (${meta.title}) disusun untuk membantu Staf Kurikulum dan Operator Sekolah mengelola jadwal pelajaran secara terstruktur di aplikasi Schedovyn.`,
    "</Callout>",
    replicaSnippet,
    "## Langkah Operasional Utama",
    "",
    "<StepList>",
    `<StepItem step="1" title="Buka Menu Terkait di Aplikasi Schedovyn">`,
    "Pastikan ruang kerja sekolah Anda sudah aktif dan status penyimpanan menunjukkan Tersimpan di browser pada bilah header atas.",
    "</StepItem>",
    `<StepItem step="2" title="Terapkan Pengaturan Sesuai Panduan Bab ${meta.order}">`,
    "Ikuti petunjuk konfigurasi dan periksa lencana status validasi jadwal di toolbar editor.",
    "</StepItem>",
    "</StepList>",
    "",
    "### Verifikasi Status Validasi",
    "",
    "Setelah perubahan diterapkan, periksa kembali lencana status validasi untuk memastikan tidak ada bentrokan waktu baru yang muncul.",
  ].join("\n");
}

async function readRawMdxFile(meta: DocArticleMeta): Promise<string> {
  const fullPath = path.join(process.cwd(), "src/content/docs", meta.filePath);
  try {
    const fileContent = await fs.readFile(fullPath, "utf-8");
    if (fileContent.trim().length > 0) {
      return fileContent;
    }
  } catch {
    // Fallback used when MDX file is not yet written on disk
  }
  return buildFallbackMdx(meta);
}

const mdxComponents = {
  h2: ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>): React.ReactElement => {
    const text = extractTextFromChildren(children);
    const id = slugifyHeading(text);
    return React.createElement(
      "h2",
      {
        ...props,
        id,
        className:
          "mt-10 scroll-mt-20 border-t border-[var(--border)] pt-6 font-heading text-xl font-semibold tracking-tight leading-snug text-[var(--foreground)]",
      },
      children
    );
  },
  h3: ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>): React.ReactElement => {
    const text = extractTextFromChildren(children);
    const id = slugifyHeading(text);
    return React.createElement(
      "h3",
      {
        ...props,
        id,
        className:
          "mt-6 mb-2 scroll-mt-20 font-heading text-base sm:text-lg font-semibold leading-snug text-[var(--foreground)]",
      },
      children
    );
  },
  p: ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLParagraphElement>): React.ReactElement =>
    React.createElement(
      "p",
      {
        ...props,
        className:
          "my-3 text-base font-normal leading-7 text-[var(--foreground)]",
      },
      children
    ),
  ul: ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLUListElement>): React.ReactElement =>
    React.createElement(
      "ul",
      {
        ...props,
        className:
          "my-3 list-disc pl-6 space-y-1.5 text-base leading-7 text-[var(--foreground)]",
      },
      children
    ),
  ol: ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLOListElement>): React.ReactElement =>
    React.createElement(
      "ol",
      {
        ...props,
        className:
          "my-3 list-decimal pl-6 space-y-1.5 text-base leading-7 text-[var(--foreground)] tabular-nums",
      },
      children
    ),
  li: ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLLIElement>): React.ReactElement =>
    React.createElement(
      "li",
      {
        ...props,
        className: "leading-7",
      },
      children
    ),
  table: ({
    children,
    ...props
  }: React.TableHTMLAttributes<HTMLTableElement>): React.ReactElement =>
    React.createElement(
      "div",
      {
        className:
          "my-5 w-full overflow-x-auto border border-[var(--border)] print-avoid-break",
      },
      React.createElement(
        "table",
        {
          ...props,
          className:
            "w-full border-collapse text-left text-sm leading-6 tabular-nums",
        },
        children
      )
    ),
  thead: ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLTableSectionElement>): React.ReactElement =>
    React.createElement(
      "thead",
      {
        ...props,
        className:
          "border-b border-[var(--border)] bg-[var(--surface-subtle)] font-heading text-xs font-semibold uppercase tracking-wide text-[var(--foreground)]",
      },
      children
    ),
  th: ({
    children,
    ...props
  }: React.ThHTMLAttributes<HTMLTableCellElement>): React.ReactElement =>
    React.createElement(
      "th",
      {
        ...props,
        className:
          "border-r border-[var(--border)] px-3 py-2 last:border-r-0",
      },
      children
    ),
  td: ({
    children,
    ...props
  }: React.TdHTMLAttributes<HTMLTableCellElement>): React.ReactElement =>
    React.createElement(
      "td",
      {
        ...props,
        className:
          "border-t border-r border-[var(--border)] px-3 py-2 align-top last:border-r-0",
      },
      children
    ),
  code: ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLElement>): React.ReactElement =>
    React.createElement(
      "code",
      {
        ...props,
        className:
          "rounded-none border border-[var(--border)] bg-[var(--surface-subtle)] px-1.5 py-0.5 font-mono text-xs text-[var(--foreground)] tabular-nums",
      },
      children
    ),
  kbd: ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLElement>): React.ReactElement =>
    React.createElement(
      "kbd",
      {
        ...props,
        className:
          "inline-flex items-center rounded-none border border-[var(--border)] bg-[var(--surface-subtle)] px-1.5 py-0.5 font-mono text-xs font-medium text-[var(--foreground)] tabular-nums",
      },
      children
    ),
  Callout,
  StepList,
  StepItem,
  ValidationStatusBadgesReplica,
  ConflictDictionaryExplorer,
  SaveStatusBadgeReplica,
  SessionBlockOverlapReplica,
  KeyboardShortcutSwitch,
};

export async function compileDocArticle(
  meta: DocArticleMeta
): Promise<CompiledDocPage> {
  const rawFile = await readRawMdxFile(meta);
  const parsed = matter(rawFile);
  const rawBody = parsed.content.trim();
  const headings = extractHeadingsFromMdx(rawBody);

  const { content } = await compileMDX({
    source: rawBody,
    components: mdxComponents,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
  });

  return {
    meta,
    content,
    headings,
    rawBody,
  };
}
