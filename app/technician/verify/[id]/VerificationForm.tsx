"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { CheckCircle2, Save, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const CHECKLIST_ITEMS: Record<string, string[]> = {
  "Air Conditioner (AC)": [
    "Tekanan Freon Rendah",
    "Filter Udara Kotor",
    "Kompresor Berisik",
    "Thermostat Bermasalah",
    "Kebocoran Air/Drainase",
    "Kipas (Fan) Lemah",
    "Kabel Kelistrikan Rapuh"
  ],
  "Mesin Cuci": [
    "Drum Tidak Seimbang",
    "Saluran Pembuangan Tersumbat",
    "Motor Penggerak Berisik",
    "Segel Pintu Bocor",
    "Error Board Kontrol",
    "Sensor Air Bermasalah"
  ],
  "Kulkas / Refrigerator": [
    "Suhu Tidak Stabil",
    "Bunga Es Berlebih",
    "Kompresor Terlalu Panas",
    "Karet Pintu Longgar",
    "Kebocoran Gas Pendingin",
    "Lampu Interior Mati"
  ],
  "Default": [
    "Koneksi Daya Bermasalah",
    "Kerusakan Mekanik Umum",
    "Perlu Ganti Komponen",
    "Hanya Perlu Pembersihan",
    "Kerusakan Akibat Pemakaian Luar"
  ]
};

export default function VerificationForm({ order }: { order: any }) {
  const applianceName = order.appliance?.appliance_type?.name || "Lainnya";
  const checklistOptions = CHECKLIST_ITEMS[applianceName] || CHECKLIST_ITEMS["Default"];
  
  const [selectedFindings, setSelectedFindings] = useState<string[]>(order.technical_findings || []);
  const [notes, setNotes] = useState(order.technical_notes || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const toggleFinding = (item: string) => {
    setSelectedFindings(prev => 
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
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
        router.push("/technician/dashboard");
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
    <div className="space-y-8 animate-in slide-in-from-right duration-500">
      <Card className="border-slate-800 bg-slate-800/40 backdrop-blur-md shadow-2xl overflow-hidden">
        <CardHeader className="border-b border-slate-800 p-8 bg-gradient-to-r from-orange-500/10 to-transparent">
          <CardTitle className="text-xl font-black flex items-center gap-3">
             <span className="p-2 bg-orange-500 rounded-xl text-white shadow-lg shadow-orange-500/20">
               <CheckCircle2 size={24} />
             </span>
             Analisis Teknis Pekerjaan
          </CardTitle>
          <p className="text-sm text-slate-500 mt-2">Silakan centang semua kerusakan yang Anda temukan di lapangan.</p>
        </CardHeader>
        
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {checklistOptions.map((item) => (
              <label 
                key={item} 
                className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer group ${
                  selectedFindings.includes(item) 
                    ? "bg-orange-500/10 border-orange-500/50 text-orange-400" 
                    : "bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700"
                }`}
              >
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={selectedFindings.includes(item)}
                  onChange={() => toggleFinding(item)}
                />
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center border-2 transition-all ${
                  selectedFindings.includes(item) 
                    ? "bg-orange-500 border-orange-500 scale-110 shadow-lg shadow-orange-500/20" 
                    : "border-slate-700 group-hover:border-slate-600"
                }`}>
                  {selectedFindings.includes(item) && <CheckCircle2 size={14} className="text-white" />}
                </div>
                <span className="text-sm font-bold tracking-tight">{item}</span>
              </label>
            ))}
          </div>

          <div className="mt-12">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 block">Catatan & Rekomendasi Teknis</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Jelaskan temuan spesifik atau langkah perbaikan yang akan dilakukan..."
              className="w-full bg-slate-950 border-2 border-slate-800 rounded-3xl p-6 text-sm text-slate-200 outline-none focus:border-orange-500 transition-all min-h-[150px] shadow-inner"
            />
          </div>
        </CardContent>

        <div className="p-8 border-t border-slate-800 bg-slate-800/20 flex items-center justify-between">
           <p className="text-[10px] text-slate-600 font-bold uppercase max-w-[200px]">Data ini akan ditampilkan secara transparan kepada pelanggan.</p>
           <Button 
             onClick={handleSubmit} 
             variant="primary" 
             className="px-10 py-6 text-lg shadow-[0_15px_30px_rgba(249,115,22,0.3)] group"
             disabled={isSubmitting}
           >
             {isSubmitting ? "Menyimpan..." : (
               <span className="flex items-center gap-2">
                 Simpan Analisis <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
               </span>
             )}
           </Button>
        </div>
      </Card>
    </div>
  );
}
