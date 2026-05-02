"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { calculateEstimatedCost } from "@/lib/price-logic";
import { ApplianceType, ProblemType } from "@/types";
import { formatRupiah } from "@/lib/utils";

export default function CalculatorPage() {
  const [appliance, setAppliance] = useState<ApplianceType | "">("");
  const [brand, setBrand] = useState("");
  const [problem, setProblem] = useState<ProblemType | "">("");

  const estimate = calculateEstimatedCost(appliance, problem);

  // Daftar opsi standar
  const applianceOptions: ApplianceType[] = ["AC", "Kulkas", "Mesin Cuci"];
  const problemOptions: ProblemType[] = [
    "Mati Total",
    "Kurang Dingin",
    "Bocor",
    "Suara Kasar",
    "Error Code",
    "Lainnya",
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 py-12 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative z-10">
        <div className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-50">
            Kalkulator <span className="text-orange-500">Harga Servis</span>
          </h1>
          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            Pilih jenis barang elektronik dan kendala yang Anda alami untuk mendapatkan estimasi biaya yang transparan sebelum teknisi datang.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Kiri: Form Input */}
          <Card className="border-slate-800 bg-slate-800/40 backdrop-blur-md">
            <CardHeader className="border-b border-slate-800 pb-4">
              <CardTitle className="text-xl">Detail Kerusakan</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Jenis Barang */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Jenis Barang Elektronik</label>
                <select
                  value={appliance}
                  onChange={(e) => setAppliance(e.target.value as ApplianceType)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-3 text-slate-200 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
                >
                  <option value="" disabled className="bg-slate-900">Pilih jenis barang...</option>
                  {applianceOptions.map((opt) => (
                    <option key={opt} value={opt} className="bg-slate-900">{opt}</option>
                  ))}
                </select>
              </div>

              {/* Merk Barang */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Merk (Opsional)</label>
                <input
                  type="text"
                  placeholder="Contoh: Daikin, Samsung, dll."
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-3 text-slate-200 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
                />
              </div>

              {/* Jenis Keluhan */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Jenis Keluhan / Masalah</label>
                <select
                  value={problem}
                  onChange={(e) => setProblem(e.target.value as ProblemType)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-3 text-slate-200 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
                >
                  <option value="" disabled className="bg-slate-900">Pilih jenis keluhan...</option>
                  {problemOptions.map((opt) => (
                    <option key={opt} value={opt} className="bg-slate-900">{opt}</option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Kanan: Hasil Estimasi */}
          <Card className={`border-2 transition-all duration-300 bg-slate-800/40 backdrop-blur-md ${estimate ? 'border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.15)]' : 'border-slate-800'}`}>
            <CardHeader className={`${estimate ? 'bg-orange-500/5' : 'bg-transparent'} border-b border-slate-800 pb-4 transition-colors`}>
              <CardTitle className="text-xl">Estimasi Biaya</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {!estimate ? (
                <div className="flex flex-col items-center justify-center text-center py-10 text-slate-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-30 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm">Silakan isi form di sebelah kiri untuk melihat estimasi harga perbaikan Anda.</p>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-500">Barang yang akan diservis:</p>
                    <p className="font-semibold text-slate-200 text-lg">
                      {appliance} {brand && `- ${brand}`}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-500">Keluhan:</p>
                    <p className="font-medium text-slate-300">{problem}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-800">
                    <p className="text-sm font-medium text-slate-500 mb-2">Estimasi Total Biaya:</p>
                    <div className="text-3xl font-bold text-orange-500 flex flex-wrap gap-2 items-center">
                      <span>{formatRupiah(estimate.minCost)}</span>
                      <span className="text-xl text-slate-400 font-normal">-</span>
                      <span>{formatRupiah(estimate.maxCost)}</span>
                    </div>
                  </div>

                  <div className="rounded-xl bg-orange-500/10 border border-orange-500/20 p-4">
                    <div className="flex gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {estimate.description} Harga ini mencakup ongkos kedatangan teknisi sebesar {formatRupiah(100000)}.
                      </p>
                    </div>
                  </div>

                  <div className="pt-6">
                    <Button 
                      href={`/booking?appliance=${encodeURIComponent(appliance)}&brand=${encodeURIComponent(brand)}&problem=${encodeURIComponent(problem)}&maxCost=${estimate.maxCost}`}
                      variant="primary" 
                      size="lg" 
                      className="w-full font-semibold shadow-md"
                    >
                      Lanjutkan Booking Servis
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
