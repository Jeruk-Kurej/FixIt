"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { CheckCircle2, AlertCircle, X, ClipboardCheck } from "lucide-react";

interface VerificationModalProps {
  order: any;
  onClose: () => void;
  onSuccess: () => void;
}

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

export default function VerificationModal({ order, onClose, onSuccess }: VerificationModalProps) {
  const applianceName = order.appliance?.appliance_type?.name || "Lainnya";
  const checklistOptions = CHECKLIST_ITEMS[applianceName] || CHECKLIST_ITEMS["Default"];
  
  const [selectedFindings, setSelectedFindings] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        onSuccess();
      } else {
        alert("Gagal menyimpan verifikasi.");
      }
    } catch (err) {
      alert("Terjadi kesalahan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-800 bg-slate-800/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-xl text-orange-500">
              <ClipboardCheck size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-50">Verifikasi Kerusakan</h2>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">{applianceName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-8">
          {/* Comparison Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 mb-3 flex items-center gap-2">
                  <AlertCircle size={10} className="text-blue-500" />
                  Keluhan Awal Customer
                </p>
                <p className="text-sm text-slate-300 italic">"{order.problem}"</p>
             </div>
             <div className="p-4 bg-orange-500/5 rounded-2xl border border-orange-500/20">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-orange-500/60 mb-3 flex items-center gap-2">
                  <CheckCircle2 size={10} className="text-orange-500" />
                  Temuan Teknis (Checklist)
                </p>
                <div className="space-y-2">
                  {checklistOptions.map((item) => (
                    <label 
                      key={item} 
                      className={`flex items-center gap-3 p-2 rounded-xl border transition-all cursor-pointer ${
                        selectedFindings.includes(item) 
                          ? "bg-orange-500/20 border-orange-500/50 text-orange-400" 
                          : "bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700"
                      }`}
                    >
                      <input 
                        type="checkbox" 
                        className="hidden" 
                        checked={selectedFindings.includes(item)}
                        onChange={() => toggleFinding(item)}
                      />
                      <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                        selectedFindings.includes(item) ? "bg-orange-500 border-orange-500" : "border-slate-700"
                      }`}>
                        {selectedFindings.includes(item) && <CheckCircle2 size={10} className="text-white" />}
                      </div>
                      <span className="text-xs font-bold">{item}</span>
                    </label>
                  ))}
                </div>
             </div>
          </div>

          {/* Notes Section */}
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 mb-3">Catatan Tambahan Teknisi</p>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Jelaskan lebih detail jika ada temuan lain..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-slate-200 outline-none focus:border-orange-500 transition-all min-h-[100px]"
            />
          </div>
        </div>

        <div className="p-6 border-t border-slate-800 bg-slate-800/20 flex justify-end gap-4">
          <Button onClick={onClose} variant="secondary">Batal</Button>
          <Button 
            onClick={handleSubmit} 
            variant="primary" 
            className="shadow-lg shadow-orange-500/20"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Hasil Verifikasi"}
          </Button>
        </div>
      </div>
    </div>
  );
}
