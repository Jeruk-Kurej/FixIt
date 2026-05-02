"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

interface StepDiagnosticsNewProps {
  categories: { id: string; name: string }[];
  onNext: (categoryId: string, categoryName: string, problem: string, serviceType: "HOME_SERVICE" | "WORKSHOP_VISIT") => void;
}

export default function StepDiagnosticsNew({ categories, onNext }: StepDiagnosticsNewProps) {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || "");
  const [problem, setProblem] = useState("");
  const [serviceType, setServiceType] = useState<"HOME_SERVICE" | "WORKSHOP_VISIT">("HOME_SERVICE");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem.trim() || !selectedCategory) return;
    const cat = categories.find((c) => c.id === selectedCategory);
    onNext(selectedCategory, cat?.name || selectedCategory, problem, serviceType);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-50 leading-tight">
          Langkah 1: Diagnosa Kerusakan
        </h2>
        <p className="text-slate-400">Pilih alat elektronik yang rusak dan berikan keluhan lengkap.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Pilih Alat Elektronik *</label>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCategory(c.id)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  selectedCategory === c.id 
                    ? "border-orange-500 bg-orange-500/10 text-orange-400" 
                    : "border-slate-800 bg-slate-900/50 text-slate-400 hover:border-orange-500/30"
                }`}
              >
                <span className="font-semibold">{c.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Detail Keluhan Kerusakan *</label>
          <textarea
            required
            rows={3}
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="Contoh: AC bocor air atau kompresor kulkas berbunyi kasar..."
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 outline-none transition-all text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Metode Servis Kunjungan *</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setServiceType("HOME_SERVICE")}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                serviceType === "HOME_SERVICE" 
                  ? "border-orange-500 bg-orange-500/10" 
                  : "border-slate-800 bg-slate-900/50 hover:border-orange-500/30"
              }`}
            >
              <h4 className={`font-semibold ${serviceType === "HOME_SERVICE" ? "text-orange-400" : "text-slate-300"}`}>Panggil ke Rumah</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Teknisi kami datang ke rumah Anda.</p>
            </button>

            <button
              type="button"
              onClick={() => setServiceType("WORKSHOP_VISIT")}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                serviceType === "WORKSHOP_VISIT" 
                  ? "border-blue-500 bg-blue-500/10" 
                  : "border-slate-800 bg-slate-900/50 hover:border-blue-500/30"
              }`}
            >
              <h4 className={`font-semibold ${serviceType === "WORKSHOP_VISIT" ? "text-blue-400" : "text-slate-300"}`}>Bawa ke Bengkel</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Antar langsung barang ke kami.</p>
            </button>
          </div>
        </div>

        <div className="pt-2">
          <Button type="submit" variant="primary" className="w-full font-bold h-12 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
            Lanjutkan
          </Button>
        </div>
      </form>
    </div>
  );
}
