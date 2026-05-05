"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { 
  Shield, 
  Clock, 
  Sparkles, 
  Snowflake, 
  Refrigerator, 
  WashingMachine, 
  Monitor, 
  Thermometer,
  Calendar,
  CreditCard,
  CheckCircle2,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

const appliances = [
  { id: "AC", name: "Smart Care AC", icon: Snowflake, description: "Perawatan AC agar tetap dingin & hemat listrik." },
  { id: "Kulkas", name: "Fridge Guard", icon: Refrigerator, description: "Pastikan kulkas Anda tetap awet & steril." },
  { id: "Mesin Cuci", name: "Laundry Master", icon: WashingMachine, description: "Perawatan motor & kebersihan drum mesin cuci." },
  { id: "TV", name: "Display Shield", icon: Monitor, description: "Cek tegangan & kalibrasi layar secara rutin." },
  { id: "Water Heater", name: "Heater Safety", icon: Thermometer, description: "Pengecekan elemen pemanas & kelistrikan." },
];

const frequencies = [
  { id: 1, label: "Tiap 1 Bulan", price: 125000, discount: "" },
  { id: 3, label: "Tiap 3 Bulan", price: 299000, discount: "Hemat 20%" },
  { id: 6, label: "Tiap 6 Bulan", price: 549000, discount: "Hemat 25%" },
];

export default function MembershipForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedAppliance, setSelectedAppliance] = useState(appliances[0]);
  const [selectedFreq, setSelectedFreq] = useState(frequencies[1]);
  const [paymentMethod, setPaymentMethod] = useState<"QRIS" | "TF">("QRIS");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubscribe = async () => {
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/membership", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          appliance: selectedAppliance.id,
          frequency: selectedFreq.id,
          price: selectedFreq.price,
          paymentMethod: paymentMethod
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengaktifkan membership.");

      if (paymentMethod === "QRIS") {
         // Direct activate for QRIS in demo
         await fetch("/api/membership/approve", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ membershipId: data.membershipId }),
         });
         alert(`Pembayaran QRIS Berhasil! Paket Membership ${selectedAppliance.name} Anda sekarang AKTIF.`);
      } else {
         alert(`Pemesanan Membership ${selectedAppliance.name} diajukan. Silakan lakukan Transfer Bank dan tunggu verifikasi admin.`);
      }
      
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto">
      {/* Stepper Progress */}
      <div className="flex items-center justify-center gap-4 mb-10">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all",
              step === s ? "bg-orange-500 text-white ring-4 ring-orange-500/20" : 
              step > s ? "bg-emerald-500 text-white" : "bg-slate-800 text-slate-500"
            )}>
              {step > s ? <CheckCircle2 size={16} /> : s}
            </div>
            {s < 3 && <div className={cn("w-12 h-0.5 rounded-full", step > s ? "bg-emerald-500" : "bg-slate-800")} />}
          </div>
        ))}
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">Pilih Alat Utama</h2>
              <p className="text-slate-500 text-sm">Pilih satu perangkat yang ingin mendapatkan prioritas servis rutin.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {appliances.map((app) => (
                <button
                  key={app.id}
                  onClick={() => setSelectedAppliance(app)}
                  className={cn(
                    "p-6 rounded-[32px] border-2 text-left transition-all relative overflow-hidden group",
                    selectedAppliance.id === app.id 
                      ? "border-orange-500 bg-orange-500/10 shadow-[0_20px_40px_rgba(249,115,22,0.1)]" 
                      : "border-slate-800 bg-slate-900/40 hover:border-slate-700"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all",
                    selectedAppliance.id === app.id ? "bg-orange-500 text-white" : "bg-slate-800 text-slate-400 group-hover:scale-110"
                  )}>
                    <app.icon size={24} />
                  </div>
                  <h4 className="font-black text-slate-100 text-lg leading-tight mb-1">{app.name}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{app.description}</p>
                </button>
              ))}
            </div>
            <div className="flex justify-end pt-6">
              <Button onClick={() => setStep(2)} variant="primary" size="lg" className="px-10 h-14 group">
                Lanjutkan <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-2xl font-black text-white uppercase tracking-tight">Atur Frekuensi Servis</h2>
              <p className="text-slate-500 text-sm">Tentukan seberapa sering teknisi kami harus berkunjung.</p>
            </div>
            <div className="max-w-xl mx-auto space-y-4">
              {frequencies.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFreq(f)}
                  className={cn(
                    "w-full p-6 rounded-[24px] border-2 text-left flex items-center justify-between transition-all group",
                    selectedFreq.id === f.id 
                      ? "border-orange-500 bg-orange-500/10" 
                      : "border-slate-800 bg-slate-900/40 hover:border-slate-700"
                  )}
                >
                  <div className="flex items-center gap-4">
                     <div className={cn(
                       "w-10 h-10 rounded-xl flex items-center justify-center",
                       selectedFreq.id === f.id ? "bg-orange-500 text-white" : "bg-slate-800 text-slate-500"
                     )}>
                        <Calendar size={20} />
                     </div>
                     <div>
                        <h4 className="font-black text-slate-100 uppercase tracking-widest text-xs">{f.label}</h4>
                        <p className="text-slate-500 text-[10px] font-bold mt-0.5">Sistem akan otomatis menjadwalkan kunjungan Anda.</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="font-black text-lg text-white">Rp {(f.price/1000).toFixed(0)}K</p>
                     {f.discount && <span className="text-[9px] font-black text-emerald-500 uppercase tracking-tighter">{f.discount}</span>}
                  </div>
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between pt-6 max-w-xl mx-auto">
              <Button onClick={() => setStep(1)} variant="ghost" className="text-slate-500">
                <ChevronLeft className="mr-2" /> Kembali
              </Button>
              <Button onClick={() => setStep(3)} variant="primary" size="lg" className="px-10 h-14 group">
                Review Paket <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-7 space-y-6">
               <Card className="border-slate-800 bg-slate-900/40 p-8 rounded-[32px] overflow-hidden relative">
                  <div className="absolute -top-10 -right-10 opacity-5">
                     <selectedAppliance.icon size={200} className="text-orange-500" />
                  </div>
                  <div className="relative z-10">
                     <span className="px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-[10px] font-black text-orange-500 uppercase tracking-widest">Premium Plan</span>
                     <h3 className="text-3xl font-black text-white mt-4 leading-tight">Konfirmasi <br /> {selectedAppliance.name}</h3>
                     
                     <div className="mt-8 space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-slate-800/40 rounded-2xl border border-slate-800">
                           <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                              <Calendar size={18} />
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Frekuensi</p>
                              <p className="text-sm font-bold text-slate-100">{selectedFreq.label}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-slate-800/40 rounded-2xl border border-slate-800">
                           <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                              <CreditCard size={18} />
                           </div>
                           <div>
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Pembayaran</p>
                              <p className="text-sm font-bold text-slate-100">Rp {selectedFreq.price.toLocaleString('id-ID')}</p>
                           </div>
                        </div>
                     </div>

                     {/* Payment Method Selector */}
                     <div className="mt-8">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Pilih Metode Pembayaran</p>
                        <div className="grid grid-cols-2 gap-3">
                           <button 
                             onClick={() => setPaymentMethod("QRIS")}
                             className={cn(
                               "p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2",
                               paymentMethod === "QRIS" ? "border-orange-500 bg-orange-500/10" : "border-slate-800 bg-slate-900 hover:border-slate-700"
                             )}
                           >
                              <div className="p-2 bg-white rounded-lg">
                                 <img src="/images/icons/qris.png" alt="QRIS" className="h-4 object-contain" onError={(e) => e.currentTarget.src='https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/QR_Code_Logo.svg/1200px-QR_Code_Logo.svg.png'} />
                              </div>
                              <span className="text-[10px] font-black text-white uppercase tracking-widest">QRIS (Auto)</span>
                           </button>
                           <button 
                             onClick={() => setPaymentMethod("TF")}
                             className={cn(
                               "p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2",
                               paymentMethod === "TF" ? "border-orange-500 bg-orange-500/10" : "border-slate-800 bg-slate-900 hover:border-slate-700"
                             )}
                           >
                              <div className="w-10 h-6 bg-slate-800 rounded flex items-center justify-center text-slate-400 font-black text-[8px]">BANK</div>
                              <span className="text-[10px] font-black text-white uppercase tracking-widest">Transfer (Manual)</span>
                           </button>
                        </div>
                     </div>
                  </div>
               </Card>
            </div>

            <div className="md:col-span-5 space-y-6">
               {paymentMethod === "QRIS" ? (
                  <div className="bg-white p-6 rounded-[32px] text-center space-y-4 animate-in zoom-in duration-300">
                     <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Scan QRIS untuk Bayar</p>
                     <div className="bg-slate-100 p-4 rounded-2xl inline-block border-2 border-slate-200">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=FixItMembership" alt="QR Code" className="w-32 h-32" />
                     </div>
                     <div className="pt-2">
                        <p className="text-[10px] font-bold text-slate-500 leading-tight">Pastikan nominal sesuai: <br /> <span className="text-slate-900 font-black">Rp {selectedFreq.price.toLocaleString('id-ID')}</span></p>
                     </div>
                  </div>
               ) : (
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
                        <CheckCircle2 size={20} />
                      </div>
                      <div>
                        <h5 className="text-sm font-black text-white uppercase tracking-tight">Auto-Pilot Scheduling</h5>
                        <p className="text-slate-500 text-xs mt-1 leading-relaxed">Sistem akan menjadwalkan servis rutin Anda otomatis di kalender setiap {selectedFreq.id} bulan.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 text-emerald-400">
                        <Shield size={20} />
                      </div>
                      <div>
                        <h5 className="text-sm font-black text-white uppercase tracking-tight">Teknisi Gojek-Style</h5>
                        <p className="text-slate-500 text-xs mt-1 leading-relaxed">Anda diprioritaskan penuh di antrean harian teknisi premium kami.</p>
                      </div>
                    </div>
                  </div>
               )}

               <div className="pt-6 space-y-4">
                  <Button onClick={handleSubscribe} disabled={isSubmitting} variant="primary" size="lg" className="w-full h-14 font-black text-sm uppercase tracking-widest shadow-[0_20px_40px_rgba(249,115,22,0.2)]">
                    {isSubmitting ? "Memproses..." : (paymentMethod === "QRIS" ? "Saya Sudah Bayar" : "Kirim Pengajuan TF")}
                  </Button>
                  <button onClick={() => setStep(2)} className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-widest">
                    Ganti Paket
                  </button>
               </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
