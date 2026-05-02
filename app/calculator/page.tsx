"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { ApplianceType, ProblemType, calculateEstimatedCost, formatRupiah } from "@/lib/price-logic";

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
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-blue-950">
            Kalkulator <span className="text-orange-500">Harga Servis</span>
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Pilih jenis barang elektronik dan kendala yang Anda alami untuk mendapatkan estimasi biaya yang transparan sebelum teknisi datang.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Kiri: Form Input */}
          <Card className="border-slate-200">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-xl">Detail Kerusakan</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Jenis Barang */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Jenis Barang Elektronik</label>
                <select
                  value={appliance}
                  onChange={(e) => setAppliance(e.target.value as ApplianceType)}
                  className="w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                >
                  <option value="" disabled>Pilih jenis barang...</option>
                  {applianceOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {/* Merk Barang */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Merk (Opsional)</label>
                <input
                  type="text"
                  placeholder="Contoh: Daikin, Samsung, dll."
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>

              {/* Jenis Keluhan */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Jenis Keluhan / Masalah</label>
                <select
                  value={problem}
                  onChange={(e) => setProblem(e.target.value as ProblemType)}
                  className="w-full rounded-md border border-slate-300 bg-white px-4 py-2.5 text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                >
                  <option value="" disabled>Pilih jenis keluhan...</option>
                  {problemOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Kanan: Hasil Estimasi */}
          <Card className={`border-2 transition-all duration-300 ${estimate ? 'border-orange-400 shadow-md' : 'border-slate-200'}`}>
            <CardHeader className={`${estimate ? 'bg-orange-50' : 'bg-slate-50/50'} border-b border-slate-100 transition-colors`}>
              <CardTitle className="text-xl">Estimasi Biaya</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {!estimate ? (
                <div className="flex flex-col items-center justify-center text-center py-10 text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <p>Silakan isi form di sebelah kiri untuk melihat estimasi harga perbaikan Anda.</p>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-500">Barang yang akan diservis:</p>
                    <p className="font-semibold text-blue-950 text-lg">
                      {appliance} {brand && `- ${brand}`}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-500">Keluhan:</p>
                    <p className="font-medium text-slate-800">{problem}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <p className="text-sm font-medium text-slate-500 mb-2">Estimasi Total Biaya:</p>
                    <div className="text-3xl font-bold text-orange-500 flex flex-wrap gap-2 items-center">
                      <span>{formatRupiah(estimate.minCost)}</span>
                      <span className="text-xl text-slate-400 font-normal">-</span>
                      <span>{formatRupiah(estimate.maxCost)}</span>
                    </div>
                  </div>

                  <div className="rounded-md bg-blue-50 p-4">
                    <div className="flex gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm text-blue-900 leading-relaxed">
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
