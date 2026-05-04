"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { formatRupiah } from "@/lib/utils";
import { bookingSchema } from "@/lib/validations";

function BookingFormInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Data dari Kalkulator atau Input Form langsung
  const [appliance, setAppliance] = useState(searchParams.get("appliance") || "");
  const [brand, setBrand] = useState(searchParams.get("brand") || "");
  const [problem, setProblem] = useState(searchParams.get("problem") || "");
  const [estimatedCost, setEstimatedCost] = useState(searchParams.get("maxCost") || "150000");

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

    const formData = {
      name,
      email,
      phone,
      address: serviceType === "HOME_SERVICE" ? address : null,
      appliance,
      brand: brand || "General",
      problem,
      serviceType,
      estimatedCost: estimatedCost || "150000",
    };

    // Validasi Zod Client-Side
    const validationResult = bookingSchema.safeParse(formData);
    
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]?.message || "Silakan periksa kembali isian form Anda.";
      setErrorMsg(firstError);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validationResult.data),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal membuat pesanan.");
      }

      alert("Pesanan berhasil dibuat! Sekarang mencari teknisi terdekat...");
      router.push(`/booking/status/${data.orderId}`);
      router.refresh();

    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 py-12 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-50">Lengkapi Data Pesanan</h1>
          <p className="mt-2 text-slate-400">Satu langkah lagi menuju barang elektronik yang kembali prima.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Form Utama */}
          <div className="md:col-span-2">
            <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-md">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Tipe Layanan (Tabs Style) */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-slate-300">Pilih Metode Layanan</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setServiceType("HOME_SERVICE")}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          serviceType === "HOME_SERVICE" 
                            ? "border-orange-500 bg-orange-500/10 backdrop-blur-md" 
                            : "border-slate-800 bg-slate-900/50 hover:border-orange-500/30"
                        }`}
                      >
                        <h4 className={`font-semibold ${serviceType === "HOME_SERVICE" ? "text-orange-400" : "text-slate-300"}`}>Panggil ke Rumah</h4>
                        <p className="text-xs text-slate-500 mt-1">Teknisi datang ke lokasi Anda.</p>
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => setServiceType("WORKSHOP_VISIT")}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          serviceType === "WORKSHOP_VISIT" 
                            ? "border-blue-500 bg-blue-500/10 backdrop-blur-md" 
                            : "border-slate-800 bg-slate-900/50 hover:border-blue-500/30"
                        }`}
                      >
                        <h4 className={`font-semibold ${serviceType === "WORKSHOP_VISIT" ? "text-blue-400" : "text-slate-300"}`}>Bawa ke Bengkel</h4>
                        <p className="text-xs text-slate-500 mt-1">Jaga privasi, antar barang ke kami.</p>
                      </button>
                    </div>
                  </div>

                  <hr className="border-slate-800" />

                  {/* Detail Barang & Keluhan */}
                  <div className="space-y-4 animate-in fade-in">
                    <label className="text-sm font-semibold text-slate-300">Detail Barang Elektronik & Keluhan</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Jenis Barang Elektronik *</label>
                        <input
                          required
                          type="text"
                          value={appliance}
                          onChange={(e) => setAppliance(e.target.value)}
                          placeholder="Contoh: AC, Kulkas, Mesin Cuci..."
                          className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:border-orange-500 outline-none placeholder-slate-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Merek / Brand (Opsional)</label>
                        <input
                          type="text"
                          value={brand}
                          onChange={(e) => setBrand(e.target.value)}
                          placeholder="Contoh: Daikin, Panasonic, LG..."
                          className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:border-orange-500 outline-none placeholder-slate-500"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400">Keluhan / Masalah *</label>
                      <textarea
                        required
                        rows={2}
                        value={problem}
                        onChange={(e) => setProblem(e.target.value)}
                        placeholder="Deskripsikan masalah barang Anda..."
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:border-orange-500 outline-none placeholder-slate-500"
                      />
                    </div>
                  </div>

                  <hr className="border-slate-800" />

                  {/* Data Diri */}
                  <div className="space-y-4">
                    <label className="text-sm font-semibold text-slate-300">Informasi Kontak</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Nama Lengkap *</label>
                        <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:border-orange-500 outline-none" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Email *</label>
                        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:border-orange-500 outline-none" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400">Nomor WhatsApp *</label>
                      <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:border-orange-500 outline-none" />
                    </div>
                  </div>

                  {/* Alamat (Kondisional) */}
                  {serviceType === "HOME_SERVICE" ? (
                    <div className="space-y-1 animate-in fade-in slide-in-from-top-2">
                      <label className="text-xs text-slate-400">Alamat Lengkap Kunjungan *</label>
                      <textarea required rows={3} value={address} onChange={(e) => setAddress(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:border-orange-500 outline-none placeholder-slate-500" placeholder="Jalan, RT/RW, Patokan..." />
                    </div>
                  ) : (
                    <div className="rounded-xl bg-blue-500/10 p-4 border border-blue-500/20 animate-in fade-in slide-in-from-top-2">
                      <p className="text-sm text-slate-300">
                        <strong>Lokasi Bengkel FixIt:</strong><br />
                        Jl. Sudirman No. 99, Jakarta Pusat. Kami akan mengirimkan jam operasional bengkel ke WhatsApp Anda setelah pesanan dibuat.
                      </p>
                    </div>
                  )}

                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-red-500/10 text-red-400 text-sm border border-red-500/30">
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
            <Card className="sticky top-24 border-orange-500/30 bg-orange-500/5 backdrop-blur-md">
              <CardHeader className="border-b border-orange-500/20 pb-4">
                <CardTitle className="text-lg text-orange-400">Ringkasan Servis</CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Barang</p>
                  <p className="font-medium text-slate-200">{appliance || "Tidak disebutkan"} {brand && `(${brand})`}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Keluhan</p>
                  <p className="font-medium text-slate-200">{problem || "Tidak disebutkan"}</p>
                </div>
                <div className="pt-4 border-t border-orange-500/20">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Maksimal Estimasi Biaya</p>
                  <p className="text-2xl font-bold text-orange-500">
                    {estimatedCost ? formatRupiah(parseInt(estimatedCost, 10)) : "Rp -"}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
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

export default function BookingForm() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-50">Memuat data pesanan...</div>}>
      <BookingFormInner />
    </Suspense>
  );
}
