"use client";

import type { ApplianceType } from "@prisma/client";
import { Wrench } from "lucide-react"; // Fallback icon jika Lottie gagal

interface StepApplianceProps {
  categories: ApplianceType[];
  onNext: (id: string, name: string) => void;
}

export default function StepAppliance({ categories, onNext }: StepApplianceProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-50">
          Apa yang bisa kami bantu hari ini?
        </h2>
        <p className="text-slate-400">Pilih jenis barang elektronik yang bermasalah.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onNext(category.id, category.name)}
            className="group relative flex flex-col items-center p-8 rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-md hover:bg-slate-800 hover:border-orange-500/50 transition-all duration-300 overflow-hidden"
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-orange-500/0 to-orange-500/0 group-hover:to-orange-500/10 transition-colors duration-500" />
            
            <div className="h-20 w-20 flex items-center justify-center mb-4 text-orange-500 group-hover:scale-110 transition-transform duration-500">
              {/* Untuk MVP kita pakai Lucide Icon sebagai placeholder Lottie */}
              <Wrench size={48} strokeWidth={1.5} />
            </div>
            
            <h3 className="text-lg font-semibold text-slate-200 group-hover:text-orange-400 transition-colors">
              {category.name}
            </h3>
            
            <p className="text-xs text-slate-500 mt-2 font-mono">
              Biaya Dasar: Rp {category.base_service_fee.toLocaleString('id-ID')}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

