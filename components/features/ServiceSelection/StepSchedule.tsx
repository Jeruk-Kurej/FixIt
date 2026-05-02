"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

interface StepScheduleProps {
  serviceType: "HOME_SERVICE" | "WORKSHOP_VISIT";
  onNext: (scheduledDate: Date, address: string) => void;
  onBack: () => void;
}

export default function StepSchedule({ serviceType, onNext, onBack }: StepScheduleProps) {
  const [date, setDate] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;
    if (serviceType === "HOME_SERVICE" && !address.trim()) return;
    onNext(new Date(date), address);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-50">
          Penjadwalan
        </h2>
        <p className="text-slate-400">Pilih waktu kunjungan dan lengkapi alamat Anda.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto pt-4">
        {/* Tanggal & Waktu */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Tanggal & Jam Kedatangan *</label>
          <input
            type="datetime-local"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
          />
        </div>

        {/* Alamat Lengkap */}
        {serviceType === "HOME_SERVICE" && (
          <div className="space-y-2 animate-in fade-in">
            <label className="text-sm font-medium text-slate-300">Alamat Lengkap Kunjungan *</label>
            <textarea
              required
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Jalan, RT/RW, Komplek perumahan, No rumah..."
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
            />
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onBack} className="flex-1">
            Kembali
          </Button>
          <Button type="submit" variant="primary" className="flex-1" disabled={!date}>
            Lanjutkan
          </Button>
        </div>
      </form>
    </div>
  );
}
