"use client";

import * as React from "react";
import type { ReactNode } from "react";
import { DocsNavbar } from "@/components/docs/DocsNavbar";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { SearchCommandDialog } from "@/components/docs/SearchCommandDialog";

export interface DocsShellProps {
  readonly children: ReactNode;
  readonly showSidebar?: boolean;
}

export function DocsShell({
  children,
  showSidebar = true,
}: DocsShellProps): React.ReactElement {
  const [searchOpen, setSearchOpen] = React.useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] =
    React.useState<boolean>(false);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      <DocsNavbar
        onOpenSearch={() => setSearchOpen(true)}
        onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
        showMobileMenuButton={showSidebar}
      />

      <SearchCommandDialog open={searchOpen} onOpenChange={setSearchOpen} />

      {showSidebar ? (
        <div className="mx-auto flex w-full max-w-[1440px] flex-1">
          <DocsSidebar
            mobileOpen={mobileSidebarOpen}
            onMobileClose={() => setMobileSidebarOpen(false)}
          />
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      ) : (
        <div className="flex-1 min-w-0">{children}</div>
      )}
    </div>
  );
}
