"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

interface StepScheduleProps {
  serviceType: "HOME_SERVICE" | "WORKSHOP_VISIT";
  onNext: (scheduledDate: Date, address: string) => void;
  onBack: () => void;
}

export default function StepSchedule({ serviceType, onNext, onBack }: StepScheduleProps) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) return;
    if (serviceType === "HOME_SERVICE" && !address.trim()) return;

    // Gabungkan tanggal dan waktu menjadi objek Date utuh
    const combined = new Date(`${selectedDate}T${selectedTime}`);
    onNext(combined, address);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-50">
          Penjadwalan
        </h2>
        <p className="text-slate-400">Pilih waktu kunjungan dan lengkapi alamat Anda.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto pt-4">
        {/* Tanggal & Waktu Terpisah untuk UI yang Lebih Premium */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-300">Waktu Kedatangan Teknisi *</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-medium">Pilih Tanggal</span>
              <input
                type="date"
                required
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{ colorScheme: "dark" }}
                className="w-full bg-slate-900/50 border border-slate-700/80 rounded-xl px-4 py-3 text-slate-200 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all font-medium text-sm"
              />
            </div>
            
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-medium">Pilih Jam</span>
              <input
                type="time"
                required
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                style={{ colorScheme: "dark" }}
                className="w-full bg-slate-900/50 border border-slate-700/80 rounded-xl px-4 py-3 text-slate-200 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all font-medium text-sm"
              />
            </div>
          </div>
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
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all text-sm outline-none"
            />
          </div>
        )}

        <div className="flex gap-4 pt-4">
          <Button type="button" variant="outline" onClick={onBack} className="flex-1">
            Kembali
          </Button>
          <Button type="submit" variant="primary" className="flex-1 font-bold h-12 shadow-[0_0_15px_rgba(249,115,22,0.3)]" disabled={!selectedDate || !selectedTime}>
            Lanjutkan
          </Button>
        </div>
      </form>
    </div>
  );
}
