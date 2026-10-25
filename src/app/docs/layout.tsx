import * as React from "react";
import type { ReactNode } from "react";
import { DocsShell } from "@/components/docs/DocsShell";

export interface DocsLayoutProps {
  readonly children: ReactNode;
}

export default function DocsLayout({
  children,
}: DocsLayoutProps): React.ReactElement {
  return <DocsShell showSidebar={true}>{children}</DocsShell>;
}
