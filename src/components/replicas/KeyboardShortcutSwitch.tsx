"use client";

import * as React from "react";
import { Command, Keyboard, Laptop } from "lucide-react";
import { cn } from "@/lib/utils";

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

export const KEYBOARD_SHORTCUTS: readonly KeyboardShortcutItem[] = [
  {
    id: "undo",
    actionLabel: "Batal Perubahan",
    windowsLinuxKeys: ["Ctrl", "Z"],
    macosKeys: ["Cmd", "Z"],
    description: "Membatalkan hingga 50 langkah penyuntingan terakhir pada jadwal.",
  },
  {
    id: "redo",
    actionLabel: "Ulangi Perubahan",
    windowsLinuxKeys: ["Ctrl+Y / Ctrl+Shift+Z"],
    macosKeys: ["Cmd+Shift+Z"],
    description:
      "Mengulangi langkah perubahan yang baru saja dibatalkan sebelumnya.",
  },
  {
    id: "nudge-time",
    actionLabel: "Geser Waktu Sesi Maju / Mundur",
    windowsLinuxKeys: ["Alt", "ArrowUp / ArrowDown"],
    macosKeys: ["Option", "ArrowUp / ArrowDown"],
    description:
      "Menggeser jam sesi yang dipilih sebesar interval snap default (15, 30, 45, atau 60 menit).",
  },
  {
    id: "move-day",
    actionLabel: "Pindahkan Sesi Antar-Hari",
    windowsLinuxKeys: ["Alt+ArrowLeft / ArrowRight"],
    macosKeys: ["Option+ArrowLeft / ArrowRight"],
    description:
      "Memindahkan sesi yang dipilih ke hari sekolah aktif sebelumnya atau berikutnya.",
  },
  {
    id: "remove-session",
    actionLabel: "Lepas dari Grid",
    windowsLinuxKeys: ["Delete / Backspace"],
    macosKeys: ["Delete / Backspace"],
    description:
      "Melepas sesi yang dipilih dari grid kanvas kembali ke daftar Belum Terjadwal.",
  },
  {
    id: "focus-detail",
    actionLabel: "Fokus ke Panel Detail Sesi",
    windowsLinuxKeys: ["Enter"],
    macosKeys: ["Enter"],
    description:
      "Membuka dan mengarahkan fokus kursor ke formulir penyuntingan Panel Detail Sesi di sebelah kanan.",
  },
  {
    id: "toggle-theme",
    actionLabel: "Ganti Tema Tampilan",
    windowsLinuxKeys: ["D"],
    macosKeys: ["D"],
    description:
      "Mengganti tema tampilan antarmuka antara Mode Terang dan Mode Gelap.",
  },
];

export function KeyboardShortcutSwitch({
  initialPlatform = "windows-linux",
}: KeyboardShortcutSwitchProps): React.ReactElement {
  const [platform, setPlatform] =
    React.useState<ShortcutPlatform>(initialPlatform);

  return (
    <div className="my-6 rounded-none border border-[var(--border)] bg-[var(--surface-subtle)] p-4 sm:p-5 print-avoid-break">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] pb-2.5">
        <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
          PERAGA INTERAKTIF ANTARMUKA SCHEDOVYN
        </span>
        <div className="flex items-center gap-1 font-mono text-[11px] text-[var(--muted-foreground)]">
          <Keyboard className="size-3.5" />
          <span>Pintasan Keyboard Terpasang</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <span className="font-heading text-xs font-semibold text-[var(--foreground)]">
          Pilih Sistem Operasi Komputer Anda:
        </span>
        <div className="inline-flex rounded-none border border-[var(--border)] bg-[var(--background)] p-0.5">
          <button
            type="button"
            onClick={() => setPlatform("windows-linux")}
            className={cn(
              "inline-flex h-7 items-center gap-1.5 rounded-none px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]",
              platform === "windows-linux"
                ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            )}
          >
            <Laptop className="size-3.5" />
            <span>Windows / Linux</span>
          </button>
          <button
            type="button"
            onClick={() => setPlatform("macos")}
            className={cn(
              "inline-flex h-7 items-center gap-1.5 rounded-none px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]",
              platform === "macos"
                ? "bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold"
                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            )}
          >
            <Command className="size-3.5" />
            <span>macOS</span>
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto border border-[var(--border)] bg-[var(--background)]">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--muted-foreground)] font-heading">
              <th className="px-3.5 py-2.5 font-bold uppercase tracking-wider text-[11px]">
                Aksi di Schedovyn
              </th>
              <th className="px-3.5 py-2.5 font-bold uppercase tracking-wider text-[11px]">
                Kombinasi Tombol ({platform === "macos" ? "macOS" : "Windows / Linux"})
              </th>
              <th className="px-3.5 py-2.5 font-bold uppercase tracking-wider text-[11px]">
                Keterangan Fungsi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {KEYBOARD_SHORTCUTS.map((item) => {
              const keys =
                platform === "macos" ? item.macosKeys : item.windowsLinuxKeys;

              return (
                <tr key={item.id} className="hover:bg-[var(--surface-subtle)]/50">
                  <td className="px-3.5 py-2.5 font-heading font-semibold text-[var(--foreground)] whitespace-nowrap">
                    {item.actionLabel}
                  </td>
                  <td className="px-3.5 py-2.5 whitespace-nowrap">
                    <div className="flex items-center gap-1 font-mono">
                      {keys.map((k, idx) => (
                        <React.Fragment key={k}>
                          <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded-none border border-[var(--border)] bg-[var(--surface-subtle)] px-1.5 text-[11px] font-semibold text-[var(--foreground)] tabular-nums shadow-none">
                            {k}
                          </kbd>
                          {idx < keys.length - 1 && (
                            <span className="text-[var(--muted-foreground)] text-xs">
                              +
                            </span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </td>
                  <td className="px-3.5 py-2.5 text-[var(--muted-foreground)] leading-5">
                    {item.description}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
