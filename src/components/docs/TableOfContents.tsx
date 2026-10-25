"use client";

import * as React from "react";
import type { TocHeadingItem } from "@/lib/mdx-loader";
import { cn } from "@/lib/utils";

export interface TableOfContentsProps {
  readonly headings: readonly TocHeadingItem[];
}

export function TableOfContents({
  headings,
}: TableOfContentsProps): React.ReactElement {
  const [activeId, setActiveId] = React.useState<string>(
    headings[0]?.id ?? ""
  );

  React.useEffect(() => {
    if (headings.length === 0) {
      return;
    }

    const elements = headings
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      {
        rootMargin: "-80px 0px -70% 0px",
        threshold: 0,
      }
    );

    for (const el of elements) {
      observer.observe(el);
    }

    return () => {
      observer.disconnect();
    };
  }, [headings]);

  return (
    <aside
      data-docs-chrome
      aria-label="Daftar isi artikel"
      className="no-print hidden xl:block w-56 shrink-0"
    >
      <div className="sticky top-20 py-2">
        <p className="mb-3 font-heading text-xs font-semibold text-[var(--foreground)]">
          Di Halaman Ini
        </p>

        {headings.length === 0 ? (
          <p className="text-xs text-[var(--muted-foreground)]">
            Tidak ada sub-bagian pada halaman ini.
          </p>
        ) : (
          <ul className="flex flex-col border-l border-[var(--border)] text-xs">
            {headings.map((heading) => {
              const isActive = heading.id === activeId;
              return (
                <li key={heading.id}>
                  <a
                    href={`#${heading.id}`}
                    onClick={() => setActiveId(heading.id)}
                    className={cn(
                      "block border-l-2 py-1.5 pr-2 leading-5 transition-colors",
                      heading.level === 3 ? "pl-5" : "pl-3",
                      isActive
                        ? "border-[var(--primary)] font-semibold text-[var(--primary)]"
                        : "border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    )}
                  >
                    {heading.text}
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}
