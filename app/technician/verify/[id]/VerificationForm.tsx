"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { 
  CheckCircle2, Save, ArrowRight, Zap, 
  Droplets, Cog, ThermometerSnowflake, 
  Wind, ShieldAlert, Activity, Hammer
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface DiagnosticItem {
  label: string;
  category: "ELECTRICAL" | "MECHANICAL" | "COOLING" | "CLEANING" | "GENERAL";
  icon: any;
}

const DIAGNOSTIC_MAP: Record<string, DiagnosticItem[]> = {
  "Air Conditioner (AC)": [
    { label: "Kapasitor Fan/Kompresor Lemah", category: "ELECTRICAL", icon: Zap },
    { label: "Buntu Ekspansi / Kapiler", category: "COOLING", icon: ThermometerSnowflake },
    { label: "Evaporator Berlendir (Bocor Alus)", category: "COOLING", icon: Droplets },
    { label: "Motor Swing Macet / Patah", category: "MECHANICAL", icon: Cog },
    { label: "Kekurangan Tekanan Freon (R32/R410)", category: "COOLING", icon: Activity },
    { label: "Akumulasi Debu Sirip Evaporator", category: "CLEANING", icon: Wind },
    { label: "Sensor Thermistor Tidak Akurat", category: "ELECTRICAL", icon: Activity },
    { label: "Isolasi Pipa Terkelupas / Kondensasi", category: "GENERAL", icon: ShieldAlert },
  ],
  "Mesin Cuci": [
    { label: "Bearing Tabung Aus / Berisik", category: "MECHANICAL", icon: Cog },
    { label: "Modul Control Board Konslet", category: "ELECTRICAL", icon: Zap },
    { label: "Drain Motor Tidak Menarik", category: "MECHANICAL", icon: Droplets },
    { label: "V-Belt Kendor / Putus", category: "MECHANICAL", icon: Hammer },
    { label: "Water Inlet Valve Mampet", category: "GENERAL", icon: Droplets },
    { label: "Shockbreaker Tabung Lemah", category: "MECHANICAL", icon: Activity },
  ],
  "Kulkas / Refrigerator": [
    { label: "Refrigerant Mampet / Oli Naik", category: "COOLING", icon: ThermometerSnowflake },
    { label: "Relay PTC Kompresor Mati", category: "ELECTRICAL", icon: Zap },
    { label: "Defrost Heater Tidak Bekerja", category: "ELECTRICAL", icon: ThermometerSnowflake },
    { label: "Karet Pintu Getas / Tidak Rapat", category: "GENERAL", icon: ShieldAlert },
    { label: "Fan Evaporator Macet", category: "MECHANICAL", icon: Wind },
    { label: "Bocor Evaporator (Kena Benda Tajam)", category: "COOLING", icon: ShieldAlert },
  ],
  "Default": [
    { label: "Kerusakan Komponen Utama", category: "GENERAL", icon: Cog },
    { label: "Masalah Jalur Kelistrikan", category: "ELECTRICAL", icon: Zap },
    { label: "Perlu Pembersihan Menyeluruh", category: "CLEANING", icon: Wind },
    { label: "Keausan Akibat Usia Pakai", category: "GENERAL", icon: Hammer },
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
  const applianceName = order.appliance?.appliance_type?.name || "Lainnya";
  const options = DIAGNOSTIC_MAP[applianceName] || DIAGNOSTIC_MAP["Default"];
  
  const [selectedFindings, setSelectedFindings] = useState<string[]>(order.technical_findings || []);
  const [notes, setNotes] = useState(order.technical_notes || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const toggleFinding = (label: string) => {
    setSelectedFindings(prev => 
      prev.includes(label) ? prev.filter(i => i !== label) : [...prev, label]
    );
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
          notes: notes
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
                 Pusat Diagnosa Teknis
              </CardTitle>
              <p className="text-sm text-slate-500 mt-3 font-medium max-w-xl leading-relaxed">
                 Pilih temuan kerusakan berdasarkan pengecekan fisik di lapangan. 
                 Data ini akan menjadi dasar estimasi biaya dan laporan transparansi pelanggan.
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
                    "flex flex-col gap-4 p-5 rounded-[24px] border-2 transition-all cursor-pointer relative group overflow-hidden",
                    isSelected 
                      ? "bg-orange-500/5 border-orange-500/50 ring-4 ring-orange-500/5" 
                      : "bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50"
                  )}
                >
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={isSelected}
                    onChange={() => toggleFinding(item.label)}
                  />
                  
                  <div className="flex items-start justify-between">
                     <div className={cn(
                        "p-3 rounded-xl transition-all duration-300",
                        isSelected ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30" : "bg-slate-800 text-slate-400 group-hover:bg-slate-700"
                     )}>
                        <Icon size={20} />
                     </div>
                     <div className={cn(
                        "px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest border",
                        CATEGORY_STYLES[item.category]
                     )}>
                        {item.category}
                     </div>
                  </div>

                  <div>
                     <span className={cn(
                        "text-sm font-black tracking-tight transition-colors",
                        isSelected ? "text-orange-400" : "text-slate-300"
                     )}>
                        {item.label}
                     </span>
                  </div>

                  {/* Checkmark indicator for selected state */}
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-orange-500 rotate-45 flex items-end justify-center pb-1">
                       <CheckCircle2 size={12} className="text-white -rotate-45 mb-1" />
                    </div>
                  )}
                </label>
              );
            })}
          </div>

          <div className="mt-12 group">
            <div className="flex items-center gap-2 mb-4">
               <ShieldAlert size={14} className="text-orange-500" />
               <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Catatan & Rekomendasi Spesialis</label>
            </div>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Jelaskan temuan spesifik atau langkah perbaikan yang akan dilakukan secara profesional..."
              className="w-full bg-slate-950/50 border-2 border-slate-800 rounded-[32px] p-8 text-sm text-slate-200 outline-none focus:border-orange-500 focus:bg-slate-900/50 transition-all min-h-[180px] shadow-inner placeholder:text-slate-700 leading-relaxed"
            />
          </div>
        </CardContent>

        <div className="p-8 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between">
           <div className="hidden sm:block">
              <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 Ready to Sync with Customer
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
