"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Shield, Clock, Sparkles } from "lucide-react";

export default function MembershipForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedAppliance, setSelectedAppliance] = useState("AC");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const applianceOptions = ["AC", "Kulkas", "Mesin Cuci"];

  const handleSubscribe = async () => {
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/membership", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appliance: selectedAppliance }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengaktifkan membership.");

      alert(`Selamat! Paket Membership untuk ${selectedAppliance} Anda sekarang aktif.`);
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      {step === 1 ? (
        <Card className="max-w-xl mx-auto border-slate-700/60 bg-slate-800/40 backdrop-blur-md p-8 text-center space-y-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-slate-100">Pilih Alat Elektronik Utama</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Pilih satu alat elektronik yang ingin diprioritaskan untuk perawatan rutin setiap 3 bulan sekali.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 py-2">
            {applianceOptions.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setSelectedAppliance(opt)}
                className={`p-4 rounded-xl border-2 text-left flex justify-between items-center transition-all ${
                  selectedAppliance === opt 
                    ? "border-orange-500 bg-orange-500/10 text-orange-400" 
                    : "border-slate-800 bg-slate-900/50 text-slate-400 hover:border-orange-500/30"
                }`}
              >
                <span className="font-semibold text-lg">{opt}</span>
                {selectedAppliance === opt && (
                  <span className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center text-slate-900 font-bold text-xs shrink-0">
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>

          <Button onClick={() => setStep(2)} variant="primary" size="lg" className="w-full font-bold h-12 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
            Lanjutkan
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Tinjauan Paket */}
          <Card className="flex flex-col justify-between border-2 border-orange-500 bg-slate-800/40 backdrop-blur-md p-8 relative overflow-hidden min-h-[450px]">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Sparkles className="h-32 w-32 text-orange-400" />
            </div>

            <div>
              <div className="mb-6">
                <span className="text-xs bg-orange-500/10 border border-orange-500/30 px-3 py-1 text-orange-400 rounded-full font-semibold uppercase">Review Paket</span>
                <h3 className="text-3xl font-bold text-slate-50 mt-4">Smart Care {selectedAppliance}</h3>
                <p className="text-slate-400 text-sm mt-1 leading-relaxed">Merawat {selectedAppliance} Anda otomatis selama 3 bulan penuh.</p>
              </div>

              <div className="mb-8 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-slate-50">Rp 299.000</span>
                <span className="text-slate-500 text-sm">/ 3 Bulan</span>
              </div>

              <ul className="space-y-4 mb-10">
                <li className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                  <span className="text-sm text-slate-300">Servis rutin terjadwal otomatis 3 bulan sekali.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                  <span className="text-sm text-slate-300">Respons prioritas (Teknisi Gojek-style tiba dalam 2 jam).</span>
                </li>
                <li className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                  <span className="text-sm text-slate-300">Gratis biaya pengecekan awal & konsultasi.</span>
                </li>
              </ul>
            </div>

            {errorMsg && (
              <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {errorMsg}
              </div>
            )}

            <div className="flex gap-4">
              <Button onClick={() => setStep(1)} variant="outline" className="flex-1 border-slate-700">
                Kembali
              </Button>
              <Button onClick={handleSubscribe} disabled={isSubmitting} variant="primary" className="flex-1 font-bold h-12 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                {isSubmitting ? "Mengaktifkan..." : "Aktifkan"}
              </Button>
            </div>
          </Card>

          {/* Benefit Samping */}
          <div className="flex flex-col justify-center space-y-8 p-4">
            <div>
              <h4 className="text-xl font-bold text-slate-50 mb-2">Kenapa Paket Ini Sangat Penting?</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                Menjaga kualitas udara dan keawetan {selectedAppliance} Anda dengan kunjungan berkala yang cerdas tanpa perlu repot memesan secara manual.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0 text-orange-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-base font-semibold text-slate-200">Smart Scheduling</h5>
                  <p className="text-slate-400 text-sm mt-1 leading-relaxed">Sistem menjadwalkan servis rutin 3 bulan di dashboard Anda secara berkala.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0 text-orange-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-base font-semibold text-slate-200">Teknisi Gojek-Style</h5>
                  <p className="text-slate-400 text-sm mt-1 leading-relaxed">Teknisi berpengalaman tinggi dari sistem pencocokan otomatis.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
