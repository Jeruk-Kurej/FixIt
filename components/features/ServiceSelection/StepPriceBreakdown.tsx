"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { formatRupiah } from "@/lib/utils";

interface StepPriceBreakdownProps {
  categoryName: string;
  problem: string;
  serviceType: "HOME_SERVICE" | "WORKSHOP_VISIT";
  scheduledDate: Date | null;
  address: string;
  onBack: () => void;
  onFinish: (name: string, email: string, phone: string) => void;
}

export default function StepPriceBreakdown({
  categoryName,
  problem,
  serviceType,
  scheduledDate,
  address,
  onBack,
  onFinish,
}: StepPriceBreakdownProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) return;
    onFinish(name, email, phone);
  };

  const baseFee = 100000;
  const estimatedTotal = baseFee + 150000; // Contoh biaya jasa standar

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-50">
          Konfirmasi & Pembayaran
        </h2>
        <p className="text-slate-400">Review kembali rincian servis dan isi data diri Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        {/* Ringkasan Servis */}
        <div className="space-y-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-md">
          <h3 className="text-lg font-bold text-orange-400">Rincian Servis</h3>
          
          <div className="space-y-3 divide-y divide-slate-800/60">
            <div className="pt-2 flex justify-between">
              <span className="text-sm text-slate-400">Barang Elektronik</span>
              <span className="text-sm font-semibold text-slate-200">{categoryName}</span>
            </div>
            <div className="pt-2 flex justify-between">
              <span className="text-sm text-slate-400">Metode Servis</span>
              <span className="text-sm font-semibold text-slate-200">{serviceType === "HOME_SERVICE" ? "Home Service" : "Workshop Visit"}</span>
            </div>
            <div className="pt-2">
              <span className="text-sm text-slate-400 block mb-1">Masalah / Keluhan</span>
              <p className="text-sm font-semibold text-slate-200 leading-relaxed">{problem}</p>
            </div>
            {serviceType === "HOME_SERVICE" && (
              <div className="pt-2">
                <span className="text-sm text-slate-400 block mb-1">Alamat</span>
                <p className="text-sm font-semibold text-slate-200 leading-relaxed">{address}</p>
              </div>
            )}
            <div className="pt-2 flex justify-between">
              <span className="text-sm text-slate-400">Waktu Kedatangan</span>
              <span className="text-sm font-semibold text-slate-200">{scheduledDate ? scheduledDate.toLocaleString('id-ID') : "-"}</span>
            </div>
            
            <div className="pt-4 flex justify-between text-lg font-bold border-t border-slate-700 mt-4">
              <span className="text-slate-100">Estimasi Total</span>
              <span className="text-orange-500">{formatRupiah(estimatedTotal)}</span>
            </div>
          </div>
        </div>

        {/* Data Diri Formulir */}
        <form onSubmit={handleSubmit} className="space-y-4 bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-orange-400">Informasi Kontak</h3>
            <div className="space-y-1">
              <label className="text-xs text-slate-400">Nama Lengkap *</label>
              <input required type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Budi Santoso" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-200 focus:border-orange-500 outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-400">Email *</label>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="budi@example.com" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-200 focus:border-orange-500 outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-400">Nomor WhatsApp *</label>
              <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="081234567890" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-3 py-2.5 text-slate-200 focus:border-orange-500 outline-none" />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1">
              Kembali
            </Button>
            <Button type="submit" variant="primary" className="flex-1">
              Buat Pesanan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
