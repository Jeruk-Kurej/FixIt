"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

interface StepDiagnosticsProps {
  applianceName: string;
  onNext: (problem: string, serviceType: "HOME_SERVICE" | "WORKSHOP_VISIT") => void;
  onBack: () => void;
}

export default function StepDiagnostics({ applianceName, onNext, onBack }: StepDiagnosticsProps) {
  const [problem, setProblem] = useState("");
  const [serviceType, setServiceType] = useState<"HOME_SERVICE" | "WORKSHOP_VISIT">("HOME_SERVICE");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem.trim()) return;
    onNext(problem, serviceType);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-50">
          Diagnosa Masalah
        </h2>
        <p className="text-slate-400">Jelaskan kerusakan pada {applianceName} Anda.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto pt-4">
        {/* Deskripsi Masalah */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Apa keluhan barang Anda? *</label>
          <textarea
            required
            rows={3}
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
            placeholder="Contoh: AC bocor air atau tidak dingin sama sekali..."
          />
        </div>

        {/* Jenis Layanan */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Metode Kunjungan *</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setServiceType("HOME_SERVICE")}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                serviceType === "HOME_SERVICE" 
                  ? "border-orange-500 bg-orange-500/10" 
                  : "border-slate-800 bg-slate-900/50 hover:border-orange-500/20"
              }`}
            >
              <h4 className={`font-semibold ${serviceType === "HOME_SERVICE" ? "text-orange-400" : "text-slate-300"}`}>Panggil ke Rumah</h4>
              <p className="text-xs text-slate-500 mt-1">Teknisi kami datang ke tempat Anda.</p>
            </button>

            <button
              type="button"
              onClick={() => setServiceType("WORKSHOP_VISIT")}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                serviceType === "WORKSHOP_VISIT" 
                  ? "border-blue-500 bg-blue-500/10" 
                  : "border-slate-800 bg-slate-900/50 hover:border-blue-500/20"
              }`}
            >
              <h4 className={`font-semibold ${serviceType === "WORKSHOP_VISIT" ? "text-blue-400" : "text-slate-300"}`}>Bawa ke Bengkel</h4>
              <p className="text-xs text-slate-500 mt-1">Antar langsung demi privasi penuh.</p>
            </button>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onBack} className="flex-1">
            Kembali
          </Button>
          <Button type="submit" variant="primary" className="flex-1" disabled={!problem.trim()}>
            Lanjutkan
          </Button>
        </div>
      </form>
    </div>
  );
}
