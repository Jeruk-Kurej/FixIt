"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { formatRupiah } from "@/lib/price-logic";

function BookingForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Data dari Kalkulator
  const appliance = searchParams.get("appliance") || "";
  const brand = searchParams.get("brand") || "";
  const problem = searchParams.get("problem") || "";
  const maxCost = searchParams.get("maxCost") || "";

  // State Form Pelanggan
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  // State Layanan
  const [serviceType, setServiceType] = useState<"HOME_SERVICE" | "WORKSHOP_VISIT">("HOME_SERVICE");
  const [address, setAddress] = useState("");
  
  // State Proses
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    if (serviceType === "HOME_SERVICE" && !address) {
      setErrorMsg("Alamat lengkap wajib diisi untuk layanan Home Service.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          address: serviceType === "HOME_SERVICE" ? address : null,
          appliance,
          brand,
          problem,
          serviceType,
          estimatedCost: maxCost,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal membuat pesanan.");
      }

      alert("Pesanan berhasil dibuat! Teknisi kami akan segera menghubungi Anda.");
      router.push("/");
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-950">Lengkapi Data Pesanan</h1>
          <p className="mt-2 text-slate-600">Satu langkah lagi menuju barang elektronik yang kembali prima.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Form Utama */}
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Tipe Layanan (Tabs Style) */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-slate-700">Pilih Metode Layanan</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setServiceType("HOME_SERVICE")}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          serviceType === "HOME_SERVICE" 
                            ? "border-orange-500 bg-orange-50" 
                            : "border-slate-200 bg-white hover:border-orange-200"
                        }`}
                      >
                        <h4 className={`font-semibold ${serviceType === "HOME_SERVICE" ? "text-orange-700" : "text-slate-700"}`}>Panggil ke Rumah</h4>
                        <p className="text-sm text-slate-500 mt-1">Teknisi datang ke lokasi Anda.</p>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setServiceType("WORKSHOP_VISIT")}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          serviceType === "WORKSHOP_VISIT" 
                            ? "border-blue-500 bg-blue-50" 
                            : "border-slate-200 bg-white hover:border-blue-200"
                        }`}
                      >
                        <h4 className={`font-semibold ${serviceType === "WORKSHOP_VISIT" ? "text-blue-700" : "text-slate-700"}`}>Bawa ke Bengkel</h4>
                        <p className="text-sm text-slate-500 mt-1">Jaga privasi, antar barang ke kami.</p>
                      </button>
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  {/* Data Diri */}
                  <div className="space-y-4">
                    <label className="text-sm font-semibold text-slate-700">Informasi Kontak</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs text-slate-500">Nama Lengkap *</label>
                        <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-500">Email *</label>
                        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-500">Nomor WhatsApp *</label>
                      <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
                    </div>
                  </div>

                  {/* Alamat (Kondisional) */}
                  {serviceType === "HOME_SERVICE" ? (
                    <div className="space-y-1 animate-in fade-in slide-in-from-top-2">
                      <label className="text-xs text-slate-500">Alamat Lengkap Kunjungan *</label>
                      <textarea required rows={3} value={address} onChange={(e) => setAddress(e.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="Jalan, RT/RW, Patokan..." />
                    </div>
                  ) : (
                    <div className="rounded-md bg-blue-50 p-4 border border-blue-100 animate-in fade-in slide-in-from-top-2">
                      <p className="text-sm text-blue-800">
                        <strong>Lokasi Bengkel FixIt:</strong><br />
                        Jl. Sudirman No. 99, Jakarta Pusat. Kami akan mengirimkan jam operasional bengkel ke WhatsApp Anda setelah pesanan dibuat.
                      </p>
                    </div>
                  )}

                  {errorMsg && (
                    <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm border border-red-200">
                      {errorMsg}
                    </div>
                  )}

                  <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Memproses..." : "Konfirmasi & Buat Pesanan"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Ringkasan Pesanan (Sidebar) */}
          <div className="md:col-span-1">
            <Card className="sticky top-24 border-orange-200 bg-orange-50/30">
              <CardHeader className="border-b border-orange-100 bg-orange-50/50 pb-4">
                <CardTitle className="text-lg text-orange-900">Ringkasan Servis</CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Barang</p>
                  <p className="font-medium text-slate-800">{appliance || "Tidak disebutkan"} {brand && `(${brand})`}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Keluhan</p>
                  <p className="font-medium text-slate-800">{problem || "Tidak disebutkan"}</p>
                </div>
                <div className="pt-4 border-t border-orange-100">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Maksimal Estimasi Biaya</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {maxCost ? formatRupiah(parseInt(maxCost, 10)) : "Rp -"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Harga final akan ditentukan oleh teknisi setelah pengecekan langsung.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Memuat data pesanan...</div>}>
      <BookingForm />
    </Suspense>
  );
}
