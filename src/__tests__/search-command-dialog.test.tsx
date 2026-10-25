import { useState } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { SearchCommandDialog } from "@/components/docs/SearchCommandDialog";

const mockPush = vi.fn<(href: string) => void>();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/docs/01-pengenalan/mengenal-schedovyn",
}));

function SearchDialogHarness({
  initialOpen = false,
}: {
  readonly initialOpen?: boolean;
}): React.ReactElement {
  const [open, setOpen] = useState(initialOpen);
  return (
    <div>
      <input
        data-testid="outside-input"
        type="text"
        placeholder="Input biasa di halaman"
      />
      <SearchCommandDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}

describe("TASK-02: Pencarian Instan Client-Side SearchCommandDialog (FR-UG-02, AC-UG-03, R-27)", () => {
  beforeEach(() => {
    mockPush.mockReset();
  });

  it("membuka dialog pencarian saat pengguna menekan Ctrl+K atau tombol '/' di luar input teks", () => {
    render(<SearchDialogHarness initialOpen={false} />);

    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    expect(
      screen.getByPlaceholderText(/Cari panduan, topik, atau kode konflik/i)
    ).toBeInTheDocument();
  });

  it("membuka dialog saat menekan '/' di window tetapi mengabaikannya saat fokus berada di dalam elemen <input>", () => {
    render(<SearchDialogHarness initialOpen={false} />);

    const outsideInput = screen.getByTestId("outside-input");
    outsideInput.focus();
    fireEvent.keyDown(outsideInput, { key: "/" });
    expect(
      screen.queryByPlaceholderText(/Cari panduan, topik, atau kode konflik/i)
    ).not.toBeInTheDocument();

    outsideInput.blur();
    fireEvent.keyDown(window, { key: "/" });
    expect(
      screen.getByPlaceholderText(/Cari panduan, topik, atau kode konflik/i)
    ).toBeInTheDocument();
  });

  it("menampilkan hasil artikel yang relevan dan dikelompokkan per modul untuk kata kunci 'istirahat', 'konflik guru', 'excel', dan 'undo' (AC-UG-03)", () => {
    render(<SearchDialogHarness initialOpen={true} />);

    const searchInput = screen.getByPlaceholderText(
      /Cari panduan, topik, atau kode konflik/i
    );

    // 1. Kata kunci "istirahat"
    fireEvent.change(searchInput, { target: { value: "istirahat" } });
    expect(
      screen.getByText(/Mengatur Identitas Sekolah & Jam Belajar/i)
    ).toBeInTheDocument();

    // 2. Kata kunci "konflik guru"
    fireEvent.change(searchInput, { target: { value: "konflik guru" } });
    expect(
      screen.getByText(/Kamus 7 Jenis Bentrokan Waktu/i)
    ).toBeInTheDocument();

    // 3. Kata kunci "excel"
    fireEvent.change(searchInput, { target: { value: "excel" } });
    expect(
      screen.getByText(/Panduan Ekspor Excel \(\.xlsx\) & Analisis Beban Guru/i)
    ).toBeInTheDocument();

    // 4. Kata kunci "undo"
    fireEvent.change(searchInput, { target: { value: "undo" } });
    expect(
      screen.getByText(/Menggunakan Riwayat Perubahan \(Undo & Redo\)/i)
    ).toBeInTheDocument();
  });

  it("mengarahkan pengguna ke rute artikel (router.push) dan menutup dialog saat salah satu hasil pencarian diklik", () => {
    const handleOpenChange = vi.fn();
    render(<SearchCommandDialog open={true} onOpenChange={handleOpenChange} />);

    const searchInput = screen.getByPlaceholderText(
      /Cari panduan, topik, atau kode konflik/i
    );
    fireEvent.change(searchInput, { target: { value: "excel" } });

    const resultOption = screen.getByText(
      /Panduan Ekspor Excel \(\.xlsx\) & Analisis Beban Guru/i
    );
    fireEvent.click(resultOption);

    expect(mockPush).toHaveBeenCalledWith(
      "/docs/05-ekspor-dokumen/ekspor-excel-dan-rekap-guru"
    );
    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });

  it("menampilkan pesan empty state Bahasa Indonesia beserta saran kata kunci dan tautan Kamus Konflik saat kueri tidak ditemukan (R-27)", () => {
    render(<SearchDialogHarness initialOpen={true} />);

    const searchInput = screen.getByPlaceholderText(
      /Cari panduan, topik, atau kode konflik/i
    );
    fireEvent.change(searchInput, { target: { value: "xyzabctidakada" } });

    expect(
      screen.getByText(
        /Tidak ditemukan panduan untuk kata kunci 'xyzabctidakada'\./i
      )
    ).toBeInTheDocument();

    const conflictDictLink = screen.getByRole("link", {
      name: /Kamus Konflik/i,
    });
    expect(conflictDictLink).toHaveAttribute(
      "href",
      "/docs/04-kamus-konflik-dan-validasi/empat-status-validasi"
    );
  });
});
