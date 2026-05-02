import Link from "next/link";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h2 className="text-4xl font-bold text-blue-900 mb-4">404</h2>
      <p className="text-xl text-slate-600 mb-8">Oops! Halaman yang Anda cari tidak ditemukan.</p>
      <Button href="/" variant="primary" size="lg">
        Kembali ke Beranda
      </Button>
    </div>
  );
}
