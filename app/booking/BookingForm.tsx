"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { formatRupiah } from "@/lib/utils";
import { bookingSchema } from "@/lib/validations";
import { Calendar, Clock, Contact, Laptop, ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react";

function BookingFormInner() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Multi-step State
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // Step 1: Detail Barang
  const [appliance, setAppliance] = useState(searchParams.get("appliance") || "");
  const [brand, setBrand] = useState(searchParams.get("brand") || "");
  const [problem, setProblem] = useState(searchParams.get("problem") || "");
  const [estimatedCost, setEstimatedCost] = useState(searchParams.get("maxCost") || "150000");

  // Step 2: Kontak & Layanan
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceType, setServiceType] = useState<"HOME_SERVICE" | "WORKSHOP_VISIT">("HOME_SERVICE");
  const [address, setAddress] = useState("");

  // Step 3: Jadwal
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("09:00");

  // Step 4: Submit & Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch User Profile for Pre-fill
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/auth/profile");
        const data = await res.json();
        if (res.ok && data.user) {
          setName(data.user.name || "");
          setEmail(data.user.email || "");
          setPhone(data.user.phone || "");
          setAddress(data.user.address || "");
        }
      } catch (err) {
        console.error("Failed to fetch profile for pre-fill:", err);
      }
    };
    fetchProfile();
  }, []);

  const nextStep = () => {
    setErrorMsg("");
    if (step === 1 && (!appliance || !problem)) {
      setErrorMsg("Harap isi jenis barang dan keluhan.");
      return;
    }
    if (step === 2 && (!name || !email || !phone || (serviceType === "HOME_SERVICE" && !address))) {
      setErrorMsg("Harap lengkapi data kontak dan alamat.");
      return;
    }
    if (step === 3 && !scheduledDate) {
      setErrorMsg("Harap pilih tanggal servis.");
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    const fullDateTime = `${scheduledDate}T${scheduledTime}:00`;

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
      scheduled_date_time: fullDateTime,
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

      router.push(`/booking/status/${data.orderId}`);
      router.refresh();

    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderProgressBar = () => (
    <div className="mb-10">
      <div className="flex items-center justify-between max-w-xs mx-auto">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center relative">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 z-10 ${
              step >= i ? "bg-orange-500 border-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]" : "bg-slate-900 border-slate-700 text-slate-500"
            }`}>
              {step > i ? <CheckCircle2 size={20} /> : i}
            </div>
            {i < 4 && (
              <div className={`absolute left-10 w-full h-0.5 -z-0 transition-all duration-500 ${step > i ? "bg-orange-500" : "bg-slate-800"}`} style={{ width: 'calc(100% + 2rem)' }} />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between max-w-xs mx-auto mt-2 px-1">
        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Barang</span>
        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Kontak</span>
        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Jadwal</span>
        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Selesai</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 py-12 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10">
        <div className="mb-4 text-center">
          <h1 className="text-3xl font-bold text-slate-50">Lengkapi Data Pesanan</h1>
          <p className="mt-2 text-slate-400">Step {step} of {totalSteps}: {
            step === 1 ? "Detail Barang" : 
            step === 2 ? "Layanan & Kontak" : 
            step === 3 ? "Tentukan Jadwal" : "Konfirmasi Akhir"
          }</p>
        </div>

        {renderProgressBar()}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card className="bg-slate-800/40 border-slate-700/50 backdrop-blur-md overflow-hidden min-h-[400px] flex flex-col">
              <CardContent className="p-8 flex-grow">
                
                {/* STEP 1: APPLIANCE INFO */}
                {step === 1 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400"><Laptop size={20} /></div>
                      <h3 className="text-lg font-bold">Informasi Barang Elektronik</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Jenis Barang *</label>
                        <input
                          required
                          type="text"
                          value={appliance}
                          onChange={(e) => setAppliance(e.target.value)}
                          placeholder="Contoh: AC, Kulkas, TV..."
                          className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:border-orange-500 outline-none placeholder-slate-600 transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Merek (Opsional)</label>
                        <input
                          type="text"
                          value={brand}
                          onChange={(e) => setBrand(e.target.value)}
                          placeholder="Contoh: LG, Samsung, Sharp..."
                          className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:border-orange-500 outline-none placeholder-slate-600 transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Keluhan / Kerusakan *</label>
                      <textarea
                        required
                        rows={4}
                        value={problem}
                        onChange={(e) => setProblem(e.target.value)}
                        placeholder="Deskripsikan masalah barang Anda secara detail..."
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:border-orange-500 outline-none placeholder-slate-600 transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 2: CONTACT & SERVICE */}
                {step === 2 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400"><Contact size={20} /></div>
                      <h3 className="text-lg font-bold">Metode Layanan & Kontak</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setServiceType("HOME_SERVICE")}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          serviceType === "HOME_SERVICE" ? "border-orange-500 bg-orange-500/5" : "border-slate-800 bg-slate-900/50"
                        }`}
                      >
                        <span className="block font-bold text-sm">Panggil Teknisi</span>
                        <span className="text-[10px] text-slate-500">Datang ke alamat Anda</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setServiceType("WORKSHOP_VISIT")}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          serviceType === "WORKSHOP_VISIT" ? "border-orange-500 bg-orange-500/5" : "border-slate-800 bg-slate-900/50"
                        }`}
                      >
                        <span className="block font-bold text-sm">Bawa ke Bengkel</span>
                        <span className="text-[10px] text-slate-500">Antar barang ke kami</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Nama Lengkap *</label>
                          <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:border-orange-500 outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Nomor WhatsApp *</label>
                          <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:border-orange-500 outline-none" />
                        </div>
                      </div>
                      
                      {serviceType === "HOME_SERVICE" ? (
                        <div className="space-y-1 animate-in fade-in zoom-in-95">
                          <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Alamat Kunjungan *</label>
                          <textarea required rows={3} value={address} onChange={(e) => setAddress(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:border-orange-500 outline-none" placeholder="Tuliskan alamat lengkap..." />
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 animate-in fade-in zoom-in-95">
                          <div className="flex items-start gap-3">
                            <div className="mt-1 text-blue-400">📍</div>
                            <div>
                              <p className="text-xs text-blue-400 font-bold uppercase tracking-widest mb-1">Lokasi Bengkel FixIt</p>
                              <p className="text-sm text-slate-300 leading-relaxed">
                                Jl. Sudirman No. 99, Jakarta Pusat. <br />
                                <span className="text-[10px] text-slate-500">Buka: Senin - Sabtu (08:00 - 17:00)</span>
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                )}

                {/* STEP 3: SCHEDULE */}
                {step === 3 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400"><Calendar size={20} /></div>
                      <h3 className="text-lg font-bold">Tentukan Waktu Servis</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Pilih Tanggal *</label>
                        <input
                          required
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                          value={scheduledDate}
                          onChange={(e) => setScheduledDate(e.target.value)}
                          className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:border-orange-500 outline-none [color-scheme:dark]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Pilih Jam *</label>
                        <div className="flex items-center gap-3 p-3 bg-slate-900/50 border border-slate-700 rounded-xl">
                          <Clock className="text-slate-500" size={18} />
                          <select
                            value={scheduledTime}
                            onChange={(e) => setScheduledTime(e.target.value)}
                            className="flex-grow bg-transparent text-slate-200 outline-none"
                          >
                            <option value="08:00">08:00 WIB</option>
                            <option value="09:00">09:00 WIB</option>
                            <option value="10:00">10:00 WIB</option>
                            <option value="11:00">11:00 WIB</option>
                            <option value="13:00">13:00 WIB</option>
                            <option value="14:00">14:00 WIB</option>
                            <option value="15:00">15:00 WIB</option>
                            <option value="16:00">16:00 WIB</option>
                            <option value="17:00">17:00 WIB</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                      <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-1">Catatan Penting</p>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {serviceType === "HOME_SERVICE" 
                          ? "Teknisi akan mencoba datang tepat waktu ke alamat Anda. Harap pastikan ada orang di lokasi pada jadwal tersebut."
                          : "Harap antarkan barang Anda ke bengkel kami pada jadwal yang telah Anda pilih."}
                      </p>
                    </div>
                  </div>
                )}

                {/* STEP 4: SUMMARY & CONFIRM */}
                {step === 4 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 text-center">
                    <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto text-orange-500 mb-2">
                      <CheckCircle2 size={48} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Konfirmasi Pesanan</h3>
                      <p className="text-slate-400 text-sm mt-1">Harap tinjau kembali data pesanan Anda.</p>
                    </div>

                    <div className="bg-slate-900/50 rounded-2xl p-6 text-left space-y-4 border border-slate-800">
                      <div className="flex justify-between items-start">
                        <span className="text-xs text-slate-500 font-bold uppercase">Barang</span>
                        <span className="text-sm font-semibold text-slate-200">{appliance} {brand && `(${brand})`}</span>
                      </div>
                      <div className="flex justify-between items-start border-t border-slate-800 pt-3">
                        <span className="text-xs text-slate-500 font-bold uppercase">Metode</span>
                        <span className="text-sm font-semibold text-slate-200">{serviceType === "HOME_SERVICE" ? "Panggil Teknisi" : "Bawa ke Bengkel"}</span>
                      </div>
                      <div className="flex justify-between items-start border-t border-slate-800 pt-3">
                        <span className="text-xs text-slate-500 font-bold uppercase">Jadwal</span>
                        <span className="text-sm font-semibold text-orange-400">{scheduledDate} @ {scheduledTime}</span>
                      </div>
                    </div>
                  </div>
                )}

                {errorMsg && (
                  <div className="mt-6 p-4 rounded-xl bg-red-500/10 text-red-400 text-sm border border-red-500/20 animate-in shake duration-300">
                    {errorMsg}
                  </div>
                )}

              </CardContent>

              {/* Navigation Buttons */}
              <div className="p-8 bg-slate-900/30 border-t border-slate-800/60 flex items-center justify-between">
                {step > 1 ? (
                  <button
                    onClick={prevStep}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-200 font-bold text-sm transition-colors"
                  >
                    <ChevronLeft size={18} /> Kembali
                  </button>
                ) : <div />}

                {step < 4 ? (
                  <Button onClick={nextStep} variant="primary" className="group">
                    Lanjut <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} variant="primary" size="lg" disabled={isSubmitting} className="px-10">
                    {isSubmitting ? "Memproses..." : "Buat Pesanan Sekarang"}
                  </Button>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="md:col-span-1 space-y-6">
            <Card className="border-orange-500/30 bg-orange-500/5 backdrop-blur-md sticky top-24">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-orange-400 uppercase tracking-widest font-black">Estimasi Biaya</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-black text-slate-50">
                  {estimatedCost ? formatRupiah(parseInt(estimatedCost, 10)) : "Rp -"}
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed uppercase font-bold tracking-wider">
                  Harga ini adalah estimasi awal. Teknisi akan memberikan harga final setelah inspeksi di lokasi.
                </p>
                
                <hr className="border-orange-500/10" />
                
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    <span>Layanan Bergaransi 30 Hari</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    <span>Teknisi Terverifikasi</span>
                  </div>
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-50">Memuat form pemesanan...</div>}>
      <BookingFormInner />
    </Suspense>
  );
}
