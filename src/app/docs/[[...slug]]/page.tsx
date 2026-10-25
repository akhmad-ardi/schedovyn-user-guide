import * as React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  DOCS_MODULES,
  getAllDocArticles,
  getDocArticleBySlug,
} from "@/lib/docs-registry";
import { compileDocArticle } from "@/lib/mdx-loader";
import { DocsPager } from "@/components/docs/DocsPager";
import { TableOfContents } from "@/components/docs/TableOfContents";

export interface DocCatchAllPageProps {
  readonly params: Promise<{
    readonly slug?: string[];
  }>;
}

export function generateStaticParams(): Array<{ slug?: string[] }> {
  const staticParams: Array<{ slug?: string[] }> = [{ slug: undefined }];

  for (const moduleGroup of DOCS_MODULES) {
    staticParams.push({ slug: [moduleGroup.moduleSlug] });
  }

  for (const article of getAllDocArticles()) {
    staticParams.push({ slug: [article.moduleSlug, article.articleSlug] });
  }

  return staticParams;
}

export async function generateMetadata({
  params,
}: DocCatchAllPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const articleMeta = getDocArticleBySlug(resolvedParams.slug);

  if (!articleMeta) {
    return {
      title: "Halaman Tidak Ditemukan | Panduan Pemakaian Schedovyn",
    };
  }

  return {
    title: `${articleMeta.order} ${articleMeta.title} | Panduan Schedovyn`,
    description: articleMeta.description,
  };
}

export default async function DocCatchAllPage({
  params,
}: DocCatchAllPageProps): Promise<React.ReactElement> {
  const resolvedParams = await params;
  const articleMeta = getDocArticleBySlug(resolvedParams.slug);

  if (!articleMeta) {
    notFound();
  }

  const compiled = await compileDocArticle(articleMeta);

  return (
    <div className="flex w-full justify-between gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <article
        data-docs-article
        className="flex-1 min-w-0 max-w-3xl mx-auto"
      >
        <div className="mb-6 border-b border-border pb-5">
          <div className="mb-2 flex items-center gap-2 font-mono text-xs font-semibold tabular-nums text-primary">
            <span>Modul {articleMeta.moduleNumber}</span>
            <span>/</span>
            <span>{articleMeta.moduleTitle}</span>
            <span>/</span>
            <span>Bab {articleMeta.order}</span>
          </div>

          <h1 className="font-heading text-2xl font-bold tracking-tight leading-tight text-foreground sm:text-3xl">
            {articleMeta.title}
          </h1>

          <p className="mt-2.5 text-base leading-7 text-muted-foreground">
            {articleMeta.description}
          </p>
        </div>

        <div className="docs-mdx-content">{compiled.content}</div>

        <DocsPager currentHref={articleMeta.href} />
      </article>

      <TableOfContents headings={compiled.headings} />
    </div>
  );
}
