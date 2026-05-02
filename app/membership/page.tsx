"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Shield, Clock, Sparkles } from "lucide-react";

export default function MembershipPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubscribe = async () => {
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/membership", {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal mengaktifkan membership.");

      alert("Selamat! Membership FixIt Anda sekarang aktif.");
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 py-12 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 text-sm font-medium text-orange-400 backdrop-blur-md mb-4">
            <Sparkles className="w-4 h-4 animate-pulse" /> Paket Premium Loyalty
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-50 tracking-tight leading-tight">
            FixIt <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Membership</span>
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg mt-3">
            Perawatan berkala yang cerdas untuk kenyamanan total hunian Anda. Hemat biaya dan nikmati prioritas kedatangan teknisi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Paket Tier */}
          <Card className="flex flex-col justify-between border-2 border-orange-500 bg-slate-800/40 backdrop-blur-md p-8 relative overflow-hidden min-h-[450px]">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Sparkles className="h-32 w-32 text-orange-400" />
            </div>

            <div>
              <div className="mb-6">
                <span className="text-xs bg-orange-500/10 border border-orange-500/30 px-3 py-1 text-orange-400 rounded-full font-semibold uppercase">Paling Populer</span>
                <h3 className="text-3xl font-bold text-slate-50 mt-4">Smart Care</h3>
                <p className="text-slate-400 text-sm mt-1">Paket otomatisasi perawatan 3 bulan penuh.</p>
              </div>

              <div className="mb-8 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-slate-50">Rp 299.000</span>
                <span className="text-slate-500 text-sm">/ 3 Bulan</span>
              </div>

              <ul className="space-y-4 mb-10">
                <li className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                  <span className="text-sm text-slate-300">Servis Cuci AC rutin otomatis setiap 3 bulan.</span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                  <span className="text-sm text-slate-300">Waktu respons teknisi prioritas (Express 2 jam tiba).</span>
                </li>
                <li className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" />
                  <span className="text-sm text-slate-300">Diskon suku cadang hingga 15%.</span>
                </li>
              </ul>
            </div>

            {errorMsg && (
              <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                {errorMsg}
              </div>
            )}

            <Button onClick={handleSubscribe} disabled={isSubmitting} variant="primary" size="lg" className="w-full font-bold h-12 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
              {isSubmitting ? "Mengaktifkan..." : "Daftar & Aktifkan Sekarang"}
            </Button>
          </Card>

          {/* Sisi Kanan: Benefit */}
          <div className="flex flex-col justify-center space-y-8">
            <div>
              <h4 className="text-xl font-bold text-slate-50 mb-2">Kenapa Langganan Membership?</h4>
              <p className="text-slate-400 text-sm leading-relaxed">
                FixIt Membership bukan hanya sekadar potongan harga, melainkan ketenangan pikiran bagi Anda yang sibuk.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0 text-orange-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-base font-semibold text-slate-200">Smart Scheduling</h5>
                  <p className="text-slate-400 text-sm mt-1 leading-relaxed">Sistem cerdas kami menjadwalkan cuci AC otomatis di dashboard tanpa perlu Anda hubungi secara manual.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0 text-orange-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-base font-semibold text-slate-200">Teknisi Prioritas</h5>
                  <p className="text-slate-400 text-sm mt-1 leading-relaxed">Teknisi level Platinum kami akan ditugaskan khusus untuk melayani rumah Anda.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
