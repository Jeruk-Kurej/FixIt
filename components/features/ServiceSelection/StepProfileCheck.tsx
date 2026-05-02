"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

interface StepProfileCheckProps {
  initialPhone: string;
  initialAddress: string;
  serviceType: "HOME_SERVICE" | "WORKSHOP_VISIT";
  onNext: (phone: string, address: string) => void;
  onBack: () => void;
}

export default function StepProfileCheck({
  initialPhone,
  initialAddress,
  serviceType,
  onNext,
  onBack,
}: StepProfileCheckProps) {
  const [phone, setPhone] = useState(initialPhone || "");
  const [address, setAddress] = useState(initialAddress || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      setErrorMsg("Nomor HP wajib diisi.");
      return;
    }
    if (serviceType === "HOME_SERVICE" && !address.trim()) {
      setErrorMsg("Alamat kunjungan wajib diisi.");
      return;
    }

    setIsUpdating(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, address }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan data.");

      onNext(phone, address);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-50 leading-tight">
          Langkah 2: Lengkapi Data Profil
        </h2>
        <p className="text-slate-400">Pastikan nomor kontak dan alamat kunjungan Anda sudah benar.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Nomor WhatsApp *</label>
          <input
            required
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Contoh: 081234567890"
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:border-orange-500 outline-none text-sm transition-all"
          />
        </div>

        {serviceType === "HOME_SERVICE" && (
          <div className="space-y-2 animate-in fade-in">
            <label className="text-sm font-medium text-slate-300">Alamat Lengkap Kunjungan *</label>
            <textarea
              required
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Jalan, RT/RW, Komplek, No rumah..."
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:border-orange-500 outline-none text-sm transition-all placeholder-slate-600"
            />
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-xs">
            {errorMsg}
          </div>
        )}

        <div className="flex gap-4 pt-2">
          <Button type="button" variant="outline" onClick={onBack} className="flex-1">
            Kembali
          </Button>
          <Button type="submit" variant="primary" className="flex-1 font-bold shadow-[0_0_15px_rgba(249,115,22,0.3)]" disabled={isUpdating}>
            {isUpdating ? "Menyimpan..." : "Lanjutkan"}
          </Button>
        </div>
      </form>
    </div>
  );
}
