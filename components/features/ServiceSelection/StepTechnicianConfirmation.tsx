"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { formatRupiah } from "@/lib/utils";
import { Sparkles, Shield, User } from "lucide-react";

interface StepTechnicianConfirmationProps {
  categoryName: string;
  problem: string;
  serviceType: "HOME_SERVICE" | "WORKSHOP_VISIT";
  scheduledDate: Date | null;
  address: string;
  onBack: () => void;
  onFinish: () => void;
}

export default function StepTechnicianConfirmation({
  categoryName,
  problem,
  serviceType,
  scheduledDate,
  address,
  onBack,
  onFinish,
}: StepTechnicianConfirmationProps) {
  const [isFinishing, setIsFinishing] = useState(false);

  const handleSubmit = () => {
    setIsFinishing(true);
    onFinish();
  };

  // Teknisi fiktif ala Gojek (Randomly dynamic)
  const technician = {
    name: "Supriyadi Wijaya",
    rating: "4.9",
    skills: ["Sertifikasi Daikin", "Keahlian AC/Kulkas Level Platinum"],
  };

  const estimatedCost = 250000;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-50 leading-tight">
          Langkah 4: Konfirmasi Teknisi
        </h2>
        <p className="text-slate-400">Teknisi terbaik telah dipesan otomatis untuk Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto pt-2">
        {/* Kolom Kiri: Profil Teknisi Matched */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-md space-y-6 flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Teknisi Platinum Ditemukan
            </div>

            <div className="flex items-center gap-4 mt-6">
              <div className="w-16 h-16 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center shrink-0 text-orange-400">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-50">{technician.name}</h4>
                <p className="text-xs text-amber-400 flex items-center gap-1 mt-0.5">
                  ⭐ {technician.rating} • Teknisi Ahli FixIt
                </p>
              </div>
            </div>

            <div className="space-y-2 mt-6">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Keahlian & Sertifikasi</p>
              <ul className="space-y-1.5 text-sm text-slate-300">
                {technician.skills.map((s, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" /> {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-700/60 pt-4 mt-6">
            <p className="text-xs text-slate-500 italic">
              "Teknisi ini memiliki ketepatan waktu 99.4% dan siap memberikan pelayanan terbaik di rumah Anda."
            </p>
          </div>
        </div>

        {/* Kolom Kanan: Rincian Akhir */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-orange-400">Rincian Servis</h3>

            <div className="space-y-3 divide-y divide-slate-800/60 text-sm">
              <div className="pt-2 flex justify-between">
                <span className="text-slate-400">Barang</span>
                <span className="font-semibold text-slate-200">{categoryName}</span>
              </div>
              <div className="pt-2">
                <span className="text-slate-400 block mb-1">Masalah / Keluhan</span>
                <p className="font-semibold text-slate-200 leading-relaxed">{problem}</p>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-400">Metode</span>
                <span className="font-semibold text-slate-200">{serviceType === "HOME_SERVICE" ? "Panggil ke Rumah" : "Workshop Visit"}</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="text-slate-400">Kunjungan</span>
                <span className="font-semibold text-slate-200">{scheduledDate ? scheduledDate.toLocaleString('id-ID') : "-"}</span>
              </div>
              {serviceType === "HOME_SERVICE" && (
                <div className="pt-2">
                  <span className="text-slate-400 block mb-1">Alamat</span>
                  <p className="font-semibold text-slate-200 leading-relaxed">{address}</p>
                </div>
              )}

              <div className="pt-4 flex justify-between text-lg font-extrabold border-t border-slate-700/80 mt-4">
                <span className="text-slate-100">Estimasi Biaya</span>
                <span className="text-orange-500">{formatRupiah(estimatedCost)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1">
              Kembali
            </Button>
            <Button type="button" onClick={handleSubmit} disabled={isFinishing} variant="primary" className="flex-1 font-bold shadow-[0_0_15px_rgba(249,115,22,0.3)]">
              {isFinishing ? "Memproses..." : "Selesai & Konfirmasi"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
