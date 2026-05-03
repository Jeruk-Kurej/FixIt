import Link from "next/link";
import Button from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Wrench, ShieldCheck, Zap, Activity } from "lucide-react";

export default function LayananPage() {
  return (
    <div className="flex flex-col w-full bg-slate-900 text-slate-50 min-h-screen relative">
      {/* Background visual accent */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-32 flex flex-col items-center justify-center border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 text-sm font-medium text-orange-400 backdrop-blur-md animate-in fade-in duration-700">
              <Zap className="w-4 h-4" /> Solusi Lengkap untuk Anda
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-50 leading-tight">
              Layanan <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Premium FixIt</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Kenyamanan ekstra dan transparansi penuh untuk perawatan seluruh perangkat elektronik rumah tangga Anda di wilayah Surabaya dan sekitarnya.
            </p>
          </div>
        </div>
      </section>

      {/* Service Cards Grid */}
      <section className="w-full py-24 bg-slate-900 border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl mb-4 leading-tight">
              Katalog Servis Unggulan
            </h2>
            <p className="text-lg text-slate-400">
              Pilih jenis layanan perbaikan atau perawatan yang sesuai dengan kebutuhan perangkat rumah tangga Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Service 1: AC */}
            <Card className="flex flex-col justify-between h-full bg-slate-800/40 border-slate-700/50 hover:border-orange-500/30 transition-all p-8 group min-h-[380px]">
              <CardHeader className="p-0">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-6 text-orange-400 group-hover:scale-110 group-hover:bg-orange-500/20 transition-all">
                  <Wrench className="w-7 h-7" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-50 mb-3 leading-tight">
                  Spesialis Servis AC
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex-1 flex flex-col justify-between">
                <div className="space-y-4 mb-6">
                  <p className="text-slate-400 leading-relaxed text-sm">
                    Menangani berbagai tipe AC agar ruangan tetap sejuk maksimal dan udara tetap sehat.
                  </p>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Cuci rutin & pembersihan filter</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Pengisian & tambah freon</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Perbaikan modul & PCB</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Bongkar pasang unit AC</span>
                    </li>
                  </ul>
                </div>
                <Button href="/book" variant="primary" className="w-full justify-center">
                  Booking Sekarang
                </Button>
              </CardContent>
            </Card>

            {/* Service 2: Kulkas */}
            <Card className="flex flex-col justify-between h-full bg-slate-800/40 border-slate-700/50 hover:border-orange-500/30 transition-all p-8 group min-h-[380px]">
              <CardHeader className="p-0">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-6 text-orange-400 group-hover:scale-110 group-hover:bg-orange-500/20 transition-all">
                  <Activity className="w-7 h-7" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-50 mb-3 leading-tight">
                  Kulkas & Freezer
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex-1 flex flex-col justify-between">
                <div className="space-y-4 mb-6">
                  <p className="text-slate-400 leading-relaxed text-sm">
                    Perawatan & perbaikan kulkas 1 atau 2 pintu, side-by-side, hingga freezer box.
                  </p>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Perbaikan tidak dingin / kurang beku</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Penggantian kompresor rusak</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Pembersihan drainase tersumbat</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Penggantian termostat & relay</span>
                    </li>
                  </ul>
                </div>
                <Button href="/book" variant="primary" className="w-full justify-center">
                  Booking Sekarang
                </Button>
              </CardContent>
            </Card>

            {/* Service 3: Mesin Cuci */}
            <Card className="flex flex-col justify-between h-full bg-slate-800/40 border-slate-700/50 hover:border-orange-500/30 transition-all p-8 group min-h-[380px]">
              <CardHeader className="p-0">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-6 text-orange-400 group-hover:scale-110 group-hover:bg-orange-500/20 transition-all">
                  <Zap className="w-7 h-7" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-50 mb-3 leading-tight">
                  Servis Mesin Cuci
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex-1 flex flex-col justify-between">
                <div className="space-y-4 mb-6">
                  <p className="text-slate-400 leading-relaxed text-sm">
                    Layanan perbaikan mesin cuci top loading maupun front loading dengan segala merk.
                  </p>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Perbaikan modul & kelistrikan</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Atasi air tidak keluar / bocor</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Perbaikan tabung bunyi kasar</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Ganti dinamo / motor penggerak</span>
                    </li>
                  </ul>
                </div>
                <Button href="/book" variant="primary" className="w-full justify-center">
                  Booking Sekarang
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="w-full py-24 bg-slate-900 border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-blue-500/20 blur-2xl opacity-40 group-hover:opacity-70 transition-all rounded-3xl" />
            <div className="w-full rounded-2xl bg-slate-800/50 border border-slate-700/60 p-12 backdrop-blur-xl relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 hover:border-orange-500/40 transition-all">
              <div className="max-w-2xl text-left">
                <h3 className="text-3xl font-bold tracking-tight text-slate-50 mb-3">
                  Punya Masalah Elektronik Lainnya?
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  Tim kami juga melayani konsultasi & perbaikan perangkat seperti TV, Microwave, Pompa Air, dll. Jangkauan area luas dari Gubeng, Ngagel, hingga Surabaya Barat.
                </p>
              </div>
              <Button href="/bantuan" variant="outline" className="border-slate-700 hover:bg-slate-700 whitespace-nowrap min-w-[180px] h-12">
                Hubungi Kami
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
