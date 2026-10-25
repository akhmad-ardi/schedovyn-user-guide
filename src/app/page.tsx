import * as React from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { DOCS_MODULES } from "@/lib/docs-registry";
import { PUBLIC_ENV } from "@/lib/env";
import { HomePortalFrame } from "@/components/docs/HomePortalFrame";

interface RoleScenarioItem {
  readonly number: string;
  readonly roleTitle: string;
  readonly scenarioDescription: string;
  readonly primaryHref: string;
  readonly primaryLabel: string;
}

const ROLE_SCENARIOS: readonly RoleScenarioItem[] = [
  {
    number: "01",
    roleTitle: "Onboarding Pertama Kali (Pengguna Baru)",
    scenarioDescription:
      "Ikuti urutan kerja standar dari pengaturan jam belajar, pengisian data master kelas dan guru, alokasi kebutuhan sesi mingguan, hingga penempatan sesi ke grid.",
    primaryHref: "/docs/01-pengenalan/mulai-cepat-10-menit",
    primaryLabel: "Buka Bab 1.2 Panduan Mulai Cepat 10 Menit",
  },
  {
    number: "02",
    roleTitle: "Troubleshooting Konflik Jadwal Saat Menyunting",
    scenarioDescription:
      "Pahami arti lencana status validasi serta langkah teknis memperbaiki 7 jenis bentrokan waktu (Error) dan 5 peringatan kelengkapan (Warning).",
    primaryHref: "/docs/04-kamus-konflik-dan-validasi/kamus-tujuh-konflik-waktu",
    primaryLabel: "Buka Bab 4.2 Kamus 7 Jenis Bentrokan Waktu",
  },
  {
    number: "03",
    roleTitle: "Cetak Laporan PDF & Rekap Beban Mengajar Guru Excel",
    scenarioDescription:
      "Pelajari perbedaan cakupan cetak Kelas Aktif vs Seluruh Ruang Kerja serta cara membaca lembar kerja Rekap Guru dan Rekap Ruangan pada berkas .xlsx.",
    primaryHref: "/docs/05-ekspor-dokumen/ekspor-excel-dan-rekap-guru",
    primaryLabel: "Buka Bab 5.2 Panduan Ekspor Excel & Rekap Guru",
  },
];

export default function HomePage(): React.ReactElement {
  return (
    <HomePortalFrame>
      <div className="mx-auto max-w-360 px-4 py-10 sm:px-6 sm:py-12 flex flex-col gap-12">
        {/* Bagian 2: Jalur Baca Berdasarkan Peran & Skenario */}
        <section aria-labelledby="heading-skenario">
          <div className="mb-4 flex flex-col gap-1">
            <h2
              id="heading-skenario"
              className="font-heading text-lg font-bold tracking-tight text-foreground sm:text-xl"
            >
              Jalur Baca Berdasarkan Kebutuhan Operasional
            </h2>
            <p className="text-sm text-muted-foreground">
              Pilih skenario kerja yang sesuai dengan tugas penjadwalan Anda
              hari ini.
            </p>
          </div>

          <div className="grid grid-cols-1 border border-border lg:grid-cols-3">
            {ROLE_SCENARIOS.map((item) => (
              <div
                key={item.number}
                className="flex flex-col justify-between gap-4 border-b border-border bg-background p-5 last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex h-6 w-7 items-center justify-center rounded-none border border-primary bg-surface-subtle font-mono text-xs font-bold tabular-nums text-primary">
                      {item.number}
                    </span>
                    <h3 className="font-heading text-sm font-semibold text-foreground">
                      {item.roleTitle}
                    </h3>
                  </div>
                  <p className="text-xs leading-5 text-muted-foreground">
                    {item.scenarioDescription}
                  </p>
                </div>

                <div>
                  <Link
                    href={item.primaryHref}
                    className="inline-flex items-center gap-1.5 font-heading text-xs font-semibold text-primary hover:underline"
                  >
                    <span>{item.primaryLabel}</span>
                    <ArrowRight className="size-3.5 shrink-0" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bagian 3: Peta 6 Modul Dokumentasi */}
        <section aria-labelledby="heading-modul">
          <div className="mb-4 flex flex-col gap-1">
            <h2
              id="heading-modul"
              className="font-heading text-lg font-bold tracking-tight text-foreground sm:text-xl"
            >
              Peta 6 Modul Dokumentasi Schedovyn
            </h2>
            <p className="text-sm text-muted-foreground">
              Seluruh bab disusun mengikuti urutan kerja penyusunan jadwal di
              aplikasi Schedovyn.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {DOCS_MODULES.map((moduleGroup) => (
              <div
                key={moduleGroup.moduleSlug}
                className="flex flex-col justify-between border border-border bg-background p-5"
              >
                <div>
                  <div className="mb-2.5 flex items-center gap-2.5">
                    <span className="inline-flex h-6 w-8 items-center justify-center rounded-none border border-primary bg-surface-subtle font-mono text-xs font-bold tabular-nums text-primary">
                      {moduleGroup.moduleNumber}
                    </span>
                    <h3 className="font-heading text-base font-bold text-foreground">
                      {moduleGroup.title}
                    </h3>
                  </div>

                  <p className="mb-4 text-xs leading-5 text-muted-foreground">
                    {moduleGroup.description}
                  </p>

                  <ul className="flex flex-col border-t border-border pt-3 space-y-1.5">
                    {moduleGroup.articles.map((article) => (
                      <li key={article.href}>
                        <Link
                          href={article.href}
                          className="group flex items-start gap-2 py-0.5 text-xs text-foreground hover:text-primary"
                        >
                          <span className="shrink-0 font-mono text-[11px] font-semibold tabular-nums text-muted-foreground group-hover:text-primary">
                            {article.order}
                          </span>
                          <span className="font-medium leading-5">
                            {article.title}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bagian 4: Banner Studi Kasus Terpadu (FR-UG-05) */}
        <section
          aria-labelledby="heading-studi-kasus"
          className="border border-primary bg-surface-subtle p-6"
        >
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div className="max-w-3xl">
              <div className="mb-1.5 font-mono text-xs font-bold uppercase tracking-wide text-primary tabular-nums">
                TUTORIAL TERPADU BAB 6.4 (STUDI KASUS NYATA)
              </div>
              <h2
                id="heading-studi-kasus"
                className="font-heading text-lg font-bold text-foreground sm:text-xl"
              >
                Studi Kasus: Menyusun Jadwal SMP Negeri 1 Nusantara dari Nol
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm leading-6 text-muted-foreground">
                Praktikkan penyusunan jadwal untuk 2 kelas paralel (Kelas VII-A
                dan Kelas VII-B), pengaturan guru yang tidak hadir di hari Jumat
                pagi, pemakaian bergantian ruang Lab IPA, penyalinan jadwal
                antar-kelas, hingga mencapai status hijau Jadwal lengkap dan
                valid.
              </p>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-3">
              <Link
                href="/docs/06-penyimpanan-pwa-dan-pintasan/studi-kasus-smp-nusantara"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-none border border-primary bg-primary px-4 font-heading text-xs font-semibold text-primary-foreground hover:opacity-90"
              >
                <span>Pelajari Studi Kasus SMP Nusantara</span>
                <ArrowRight className="size-3.5 shrink-0" aria-hidden="true" />
              </Link>

              <a
                href={PUBLIC_ENV.APP_URL}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-none border border-border bg-background px-4 font-heading text-xs font-semibold text-foreground hover:border-primary"
              >
                <span>Buka Aplikasi Schedovyn</span>
                <ArrowUpRight className="size-3.5 shrink-0" aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
      </div>
    </HomePortalFrame>
  );
}
