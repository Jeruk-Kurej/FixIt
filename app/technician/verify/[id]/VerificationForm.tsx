"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { 
  CheckCircle2, Save, ArrowRight, Zap, 
  Droplets, Cog, ThermometerSnowflake, 
  Wind, ShieldAlert, Activity, Hammer, Wallet,
  Info, Tv, Microwave, Waves, Flame, MousePointer2
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn, formatRupiah } from "@/lib/utils";

interface DiagnosticItem {
  label: string;
  category: "ELECTRICAL" | "MECHANICAL" | "COOLING" | "CLEANING" | "GENERAL";
  icon: any;
  price: number;
  description: string;
}

const DIAGNOSTIC_MAP: Record<string, DiagnosticItem[]> = {
  "AC": [
    { label: "Pengecekan Sesuai Estimasi", category: "GENERAL", icon: Activity, price: 0, description: "Cek tekanan freon & arus listrik tanpa tindakan tambahan." },
    { label: "Pembersihan AC (Standard)", category: "CLEANING", icon: Wind, price: 75000, description: "Cuci unit indoor & outdoor (Pembersihan rutin)." },
    { label: "Cuci AC Besar / Overhaul", category: "CLEANING", icon: Droplets, price: 350000, description: "Bongkar unit indoor untuk pembersihan total kerak." },
    { label: "Tambah Freon (R32/R410)", category: "COOLING", icon: ThermometerSnowflake, price: 150000, description: "Pengisian sebagian tekanan freon yang berkurang." },
    { label: "Isi Freon Full (R32/R410)", category: "COOLING", icon: Activity, price: 350000, description: "Isi ulang freon dari nol (Setelah perbaikan bocor)." },
    { label: "Ganti Kapasitor Fan/Kipas", category: "ELECTRICAL", icon: Zap, price: 175000, description: "Penggantian kapasitor untuk putaran fan yang lemah." },
    { label: "Ganti Kapasitor Kompresor", category: "ELECTRICAL", icon: Zap, price: 275000, description: "Penggantian starter kompresor agar mesin mau start." },
    { label: "Ganti Sensor Thermistor", category: "ELECTRICAL", icon: Activity, price: 185000, description: "Penggantian sensor suhu yang menyebabkan AC mati sendiri." },
    { label: "Las Titik Bocor & Vakum", category: "MECHANICAL", icon: Hammer, price: 450000, description: "Perbaikan pipa bocor termasuk proses vakum sistem." },
  ],
  "KULKAS": [
    { label: "Pengecekan Sesuai Estimasi", category: "GENERAL", icon: Activity, price: 0, description: "Cek suhu, arus kompresor & kelistrikan dasar." },
    { label: "Ganti Relay PTC / Overload", category: "ELECTRICAL", icon: Zap, price: 135000, description: "Penggantian komponen starter/pelindung kompresor." },
    { label: "Ganti Defrost Heater/Timer", category: "ELECTRICAL", icon: Zap, price: 225000, description: "Perbaikan sistem pencairan bunga es otomatis." },
    { label: "Ganti Fan Motor Evaporator", category: "MECHANICAL", icon: Wind, price: 285000, description: "Ganti kipas penyebar hawa dingin di dalam kulkas." },
    { label: "Isi Freon & Las Pipa", category: "COOLING", icon: ThermometerSnowflake, price: 475000, description: "Las kebocoran pipa & pengisian ulang refrigerant." },
    { label: "Ganti Karet Pintu (Seal)", category: "GENERAL", icon: ShieldAlert, price: 250000, description: "Ganti seal magnet agar pintu rapat & suhu terjaga." },
    { label: "Ganti Termostat / Sensor", category: "ELECTRICAL", icon: Activity, price: 195000, description: "Penggantian alat pengatur suhu (Mechanical/Digital)." },
    { label: "Pembersihan Saluran Drainase", category: "CLEANING", icon: Droplets, price: 100000, description: "Atasi air bocor di bawah atau dalam kulkas." },
  ],
  "MESIN CUCI": [
    { label: "Pengecekan Sesuai Estimasi", category: "GENERAL", icon: Activity, price: 0, description: "Cek putaran, drainase & modul tanpa penggantian part." },
    { label: "Ganti V-Belt Tabung", category: "MECHANICAL", icon: Hammer, price: 125000, description: "Ganti karet penghubung motor ke tabung." },
    { label: "Ganti Drain Motor / Katup", category: "MECHANICAL", icon: Droplets, price: 235000, description: "Perbaikan sistem pembuangan air yang tersumbat/macet." },
    { label: "Ganti Water Inlet Valve", category: "MECHANICAL", icon: Droplets, price: 195000, description: "Perbaikan keran air otomatis yang tidak mau mengisi." },
    { label: "Service Modul PCB Utama", category: "ELECTRICAL", icon: Zap, price: 450000, description: "Perbaikan jalur elektronik / modul kontrol mesin." },
    { label: "Ganti Capacitor Motor", category: "ELECTRICAL", icon: Zap, price: 185000, description: "Ganti kapasitor agar putaran mesin kuat kembali." },
    { label: "Ganti Bearing & Seal (Set)", category: "MECHANICAL", icon: Cog, price: 675000, description: "Ganti laher tabung yang sudah berisik/kasar." },
    { label: "Ganti Shockbreaker (Set)", category: "MECHANICAL", icon: Waves, price: 350000, description: "Ganti peredam getaran tabung agar tidak goyang." },
  ],
  "MICROWAVE": [
    { label: "Pengecekan Sesuai Estimasi", category: "GENERAL", icon: Activity, price: 0, description: "Cek daya pancar magnetron & kelistrikan." },
    { label: "Ganti Magnetron Utama", category: "ELECTRICAL", icon: Zap, price: 375000, description: "Ganti komponen penghasil panas microwave." },
    { label: "Ganti High Voltage Fuse/Diode", category: "ELECTRICAL", icon: Zap, price: 125000, description: "Perbaikan sekring tegangan tinggi yang putus." },
    { label: "Ganti Motor Turn Table", category: "MECHANICAL", icon: Cog, price: 185000, description: "Ganti motor pemutar piringan dalam microwave." },
    { label: "Service Panel Touchscreen", category: "ELECTRICAL", icon: MousePointer2, price: 250000, description: "Perbaikan tombol / panel kontrol yang tidak respon." },
  ],
  "WATER HEATER": [
    { label: "Pengecekan Sesuai Estimasi", category: "GENERAL", icon: Activity, price: 0, description: "Cek elemen & thermostat tanpa tindakan berat." },
    { label: "Ganti Heating Element", category: "ELECTRICAL", icon: Flame, price: 385000, description: "Ganti elemen pemanas air yang sudah mati/putus." },
    { label: "Ganti Thermostat / Sensor", category: "ELECTRICAL", icon: Zap, price: 215000, description: "Ganti pengatur suhu otomatis biar air nggak kepanasan." },
    { label: "Descaling / Cuci Tanki", category: "CLEANING", icon: Droplets, price: 150000, description: "Pembersihan kerak kapur di dalam tangki pemanas." },
    { label: "Ganti Magnesium Anode", category: "MECHANICAL", icon: ShieldAlert, price: 145000, description: "Ganti batang pelindung karat di dalam tangki." },
  ],
  "TV": [
    { label: "Pengecekan Sesuai Estimasi", category: "GENERAL", icon: Activity, price: 0, description: "Diagnosa jalur mainboard & panel backlight." },
    { label: "Ganti Backlight LED (Full Set)", category: "ELECTRICAL", icon: Zap, price: 475000, description: "Ganti lampu layar (Solusi suara ada gambar tidak ada)." },
    { label: "Service Power Supply Board", category: "ELECTRICAL", icon: Zap, price: 385000, description: "Perbaikan modul daya utama TV." },
    { label: "Service Mainboard / Chipset", category: "ELECTRICAL", icon: Cog, price: 550000, description: "Perbaikan otak elektronik utama TV." },
  ],
  "DISPENSER": [
    { label: "Pengecekan Sesuai Estimasi", category: "GENERAL", icon: Activity, price: 0, description: "Cek kompresor/peltier & jalur selang air." },
    { label: "Ganti Kran Air (Full Set)", category: "MECHANICAL", icon: Droplets, price: 95000, description: "Ganti kran yang bocor / patah." },
    { label: "Ganti Peltier (Pendingin)", category: "ELECTRICAL", icon: ThermometerSnowflake, price: 175000, description: "Ganti modul pendingin air elektronik." },
    { label: "Ganti Pompa Air (Electric)", category: "MECHANICAL", icon: Activity, price: 225000, description: "Ganti pompa untuk dispenser galon bawah." },
  ],
  "DEFAULT": [
    { label: "Pengecekan Sesuai Estimasi", category: "GENERAL", icon: Activity, price: 0, description: "Pengecekan standar tanpa tindakan tambahan." },
    { label: "Pembersihan Menyeluruh", category: "CLEANING", icon: Wind, price: 50000, description: "Pembersihan unit secara mendalam." },
    { label: "Perbaikan Jalur Kabel", category: "ELECTRICAL", icon: Zap, price: 125000, description: "Perbaikan kabel yang putus / short circuit." },
    { label: "Ganti Komponen Ringan", category: "GENERAL", icon: Hammer, price: 175000, description: "Penggantian baut, pengait, atau part kecil lainnya." },
  ]
};

const CATEGORY_STYLES = {
  ELECTRICAL: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
  MECHANICAL: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  COOLING: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20",
  CLEANING: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  GENERAL: "text-slate-500 bg-slate-500/10 border-slate-500/20",
};

export default function VerificationForm({ order }: { order: any }) {
  const applianceName = order.appliance?.appliance_type?.name || "DEFAULT";
  
  // Smart category matching
  const getOptions = () => {
    const name = applianceName.toUpperCase();
    if (name.includes("AC") || name.includes("AIR CONDITIONER")) return DIAGNOSTIC_MAP["AC"];
    if (name.includes("KULKAS") || name.includes("REFRIGERATOR") || name.includes("LEMARI ES")) return DIAGNOSTIC_MAP["KULKAS"];
    if (name.includes("MESIN CUCI") || name.includes("WASHING")) return DIAGNOSTIC_MAP["MESIN CUCI"];
    if (name.includes("MICROWAVE") || name.includes("OVEN")) return DIAGNOSTIC_MAP["MICROWAVE"];
    if (name.includes("WATER HEATER")) return DIAGNOSTIC_MAP["WATER HEATER"];
    if (name.includes("TV") || name.includes("TELEVISI")) return DIAGNOSTIC_MAP["TV"];
    if (name.includes("DISPENSER")) return DIAGNOSTIC_MAP["DISPENSER"];
    return DIAGNOSTIC_MAP["DEFAULT"];
  };

  const options = getOptions();
  
  const [selectedFindings, setSelectedFindings] = useState<string[]>(order.technical_findings || []);
  const [notes, setNotes] = useState(order.technical_notes || "");
  const [totalAdditionalCost, setTotalAdditionalCost] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const cost = selectedFindings.reduce((sum, findingLabel) => {
      const item = options.find(o => o.label === findingLabel);
      return sum + (item?.price || 0);
    }, 0);
    setTotalAdditionalCost(cost);
  }, [selectedFindings, options]);

  const toggleFinding = (label: string) => {
    const item = options.find(o => o.label === label);
    if (!item) return;

    setSelectedFindings(prev => {
      const isCurrentlySelected = prev.includes(label);
      
      if (item.price === 0) {
        return isCurrentlySelected ? [] : [label];
      } else {
        const next = isCurrentlySelected 
          ? prev.filter(i => i !== label) 
          : [...prev, label];
          
        return next.filter(i => {
          const opt = options.find(o => o.label === i);
          return opt && opt.price > 0;
        });
      }
    });
  };

  const handleSubmit = async () => {
    if (selectedFindings.length === 0) {
      alert("Harap pilih minimal satu temuan teknis.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/orders/${order.id}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          findings: selectedFindings,
          notes: notes,
          additionalCost: totalAdditionalCost
        })
      });

      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        const errorData = await res.json();
        alert(`Gagal menyimpan: ${errorData.error || "Terjadi kesalahan"}`);
      }
    } catch (err) {
      alert("Terjadi kesalahan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-2xl overflow-hidden border-t-orange-500/20 border-t-2">
        <CardHeader className="p-8 border-b border-slate-800/50 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <Activity size={120} className="text-orange-500" />
           </div>
           
           <div className="relative z-10">
              <CardTitle className="text-2xl font-black flex items-center gap-4 text-slate-50">
                 <div className="p-3 bg-orange-500 rounded-2xl text-white shadow-[0_0_20px_rgba(249,115,22,0.4)]">
                   <CheckCircle2 size={28} />
                 </div>
                 Pusat Verifikasi & Rincian Tugas
              </CardTitle>
              <p className="text-sm text-slate-500 mt-3 font-medium max-w-xl leading-relaxed">
                 Diagnosa untuk: <span className="text-orange-400 font-bold">{applianceName}</span>. 
                 Pilih pekerjaan yang dilakukan sesuai standar transparansi FixIt.
              </p>
           </div>
        </CardHeader>
        
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {options.map((item) => {
              const Icon = item.icon;
              const isSelected = selectedFindings.includes(item.label);
              
              return (
                <label 
                  key={item.label} 
                  className={cn(
                    "relative flex flex-col gap-4 p-6 rounded-[28px] border-2 transition-all duration-500 cursor-pointer group overflow-hidden",
                    isSelected 
                      ? "bg-orange-500/10 border-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.15)] scale-[1.01]" 
                      : "bg-slate-950/40 border-slate-800/50 hover:border-slate-700 hover:bg-slate-900/40"
                  )}
                >
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={isSelected}
                    onChange={() => toggleFinding(item.label)}
                  />
                  
                  <div className="relative z-10 flex items-start justify-between">
                     <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                        isSelected 
                          ? "bg-orange-500 text-white shadow-[0_8px_20px_rgba(249,115,22,0.4)]" 
                          : "bg-slate-800 text-slate-500 group-hover:bg-slate-700 group-hover:text-slate-300"
                     )}>
                        <Icon size={24} />
                     </div>
                     
                     <div className="flex flex-col items-end gap-2">
                        <div className={cn(
                           "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border transition-all duration-300",
                           isSelected ? "bg-white text-orange-600 border-white" : CATEGORY_STYLES[item.category]
                        )}>
                           {item.price === 0 ? "Standard" : `+ Rp ${item.price.toLocaleString('id-ID')}`}
                        </div>
                     </div>
                  </div>

                  <div className="relative z-10">
                     <h4 className={cn(
                        "text-base font-black tracking-tight transition-all duration-300",
                        isSelected ? "text-white" : "text-slate-300 group-hover:text-white"
                     )}>
                        {item.label}
                     </h4>
                     <p className={cn(
                        "text-[10px] font-bold leading-relaxed mt-1 transition-all duration-300",
                        isSelected ? "text-orange-300/80" : "text-slate-600 group-hover:text-slate-500"
                     )}>
                        {item.description}
                     </p>
                  </div>
                </label>
              );
            })}
          </div>

          {/* Cost Summary Section */}
          <div className="mt-12 p-8 bg-slate-950/60 border-2 border-slate-800 rounded-[32px] relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:rotate-12 transition-transform duration-700">
                <Wallet size={120} className="text-emerald-500" />
             </div>
             
             <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-2">
                   <div className="flex items-center gap-2">
                      <Wallet size={16} className="text-emerald-500" />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Rincian Biaya Tambahan</p>
                   </div>
                   <h3 className="text-4xl font-black text-white tracking-tighter">
                      <span className="text-emerald-500">Rp</span> {totalAdditionalCost.toLocaleString('id-ID')}
                   </h3>
                   <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">
                      *Otomatis terakumulasi dari checklist di atas
                   </p>
                </div>

                <div className="flex flex-col gap-3 max-w-xs">
                   <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-3">
                      <Info size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                      <p className="text-[9px] font-bold text-emerald-400 leading-relaxed uppercase tracking-wider">
                         Teknisi dilarang melakukan mark-up harga di luar checklist yang tersedia.
                      </p>
                   </div>
                </div>
             </div>
          </div>

          <div className="mt-12 group">
            <div className="flex items-center gap-2 mb-4">
               <ShieldAlert size={14} className="text-orange-500" />
               <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Catatan Tambahan untuk Pelanggan</label>
            </div>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Berikan penjelasan tambahan mengenai kondisi unit atau tips perawatan untuk pelanggan..."
              className="w-full bg-slate-950/40 border-2 border-slate-800 rounded-[32px] p-8 text-sm text-slate-200 outline-none focus:border-orange-500 focus:bg-slate-900/60 transition-all min-h-[160px] shadow-inner placeholder:text-slate-700 leading-relaxed"
            />
          </div>
        </CardContent>

        <div className="p-8 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between">
           <div className="hidden sm:block">
              <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 Transparan • Profesional • Terpercaya
              </p>
           </div>
           <Button 
             onClick={handleSubmit} 
             variant="primary" 
             className="w-full sm:w-auto px-12 py-6 text-lg font-black uppercase tracking-widest shadow-[0_20px_40px_rgba(249,115,22,0.25)] group rounded-[20px]"
             disabled={isSubmitting}
           >
             {isSubmitting ? "Syncing..." : (
               <span className="flex items-center gap-3">
                 Kirim Laporan <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
               </span>
             )}
           </Button>
        </div>
      </Card>
    </div>
  );
}
