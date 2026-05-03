import Link from "next/link";
import Button from "@/components/ui/Button";
import { Shield, Sparkles, CheckCircle, ArrowRight } from "lucide-react";

export default function CaraKerjaPage() {
  const steps = [
    {
      num: "01",
      title: "Diagnosis (Smart UI)",
      desc: "Deteksi awal masalah perangkat elektronik Anda lewat antarmuka cerdas kami. Anda bisa mengisi gejala kerusakan dan langsung mendapatkan perkiraan biaya perbaikan.",
      accent: "from-orange-400 to-orange-500",
    },
    {
      num: "02",
      title: "Hybrid Choice",
      desc: "Pilih fleksibilitas penuh sesuai keinginan Anda. Tim teknisi kami bisa datang ke rumah Anda (Home Service), atau Anda bisa mengantar perangkat ke bengkel kami (Workshop Visit).",
      accent: "from-blue-400 to-blue-500",
    },
    {
      num: "03",
      title: "Technician Match",
      desc: "Sistem cerdas kami akan langsung mencocokkan Anda dengan teknisi spesialis yang bersertifikasi resmi dan terdekat dari lokasi Anda.",
      accent: "from-emerald-400 to-emerald-500",
    },
    {
      num: "04",
      title: "Professional Service",
      desc: "Teknisi melakukan pengerjaan secara transparan. Anda dapat memantau status pengerjaan secara live dari dasbor akun Anda.",
      accent: "from-amber-400 to-amber-500",
    },
    {
      num: "05",
      title: "Digital Report & Warranty",
      desc: "Setelah selesai, Anda akan menerima laporan digital yang berisi rincian penggantian suku cadang serta sertifikat garansi resmi hingga 30 hari.",
      accent: "from-indigo-400 to-indigo-500",
    },
  ];

  return (
    <div className="flex flex-col w-full bg-slate-900 text-slate-50 min-h-screen relative">
      {/* Background accent */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-32 flex flex-col items-center justify-center border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 text-sm font-medium text-orange-400 backdrop-blur-md animate-in fade-in duration-700">
              <Sparkles className="w-4 h-4" /> Proses Servis Kelas Dunia
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-50 leading-tight">
              How Excellence <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Gets Delivered</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Mulai dari deteksi masalah awal hingga penyerahan laporan digital lengkap dan garansi resmi. FixIt merancang alur pengerjaan yang transparan, mudah, dan aman.
            </p>
            <div className="flex justify-center pt-4">
              <Button href="/booking" variant="primary" size="lg" className="h-12 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                Pesan Servis Sekarang <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Step by Step Vertical Journey (alternating) */}
      <section className="w-full py-24 bg-slate-900 border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl space-y-24">
          {steps.map((step, idx) => (
            <div
              key={step.num}
              className={`flex flex-col md:flex-row items-center gap-12 ${
                idx % 2 !== 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Teks Step */}
              <div className="flex-1 space-y-4">
                <div className={`text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r ${step.accent} mb-2 select-none font-mono tracking-widest`}>
                  STEP {step.num}
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-50 tracking-tight leading-tight">
                  {step.title}
                </h3>
                <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {/* Box Representasi Visual / Placeholder / Preview */}
              <div className="flex-1 w-full max-w-md h-[250px] md:h-[300px] rounded-2xl bg-slate-800/40 border border-slate-700/50 p-8 flex items-center justify-center hover:border-orange-500/30 transition-all backdrop-blur-sm relative group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-blue-500/5 opacity-40 group-hover:opacity-70 transition-all duration-500" />
                <div className="relative z-10 text-center space-y-2 select-none">
                  <div className={`mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br ${step.accent} flex items-center justify-center text-slate-950 font-extrabold text-2xl shadow-lg mb-4`}>
                    {step.num}
                  </div>
                  <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                    Fitur Transparan FixIt
                  </h4>
                  <p className="text-xs text-slate-500 max-w-xs">
                    Mewujudkan rasa aman dan kepuasan total bagi Anda
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* The FixIt Guarantee Section */}
      <section className="w-full py-24 bg-slate-900 border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 blur-2xl opacity-40 group-hover:opacity-70 transition-all rounded-3xl" />
            <div className="w-full rounded-2xl bg-slate-800/40 border border-slate-700/50 p-12 backdrop-blur-xl relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 hover:border-emerald-500/30 transition-all duration-300">
              <div className="max-w-2xl text-left space-y-4">
                <div className="inline-flex items-center gap-2 text-emerald-400 font-medium text-sm border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 rounded-full">
                  <Shield className="w-4 h-4" /> The FixIt Guarantee
                </div>
                <h3 className="text-3xl font-bold tracking-tight text-slate-50 leading-tight">
                  Perlindungan & Kenyamanan Penuh
                </h3>
                <p className="text-slate-400 leading-relaxed text-base">
                  Setiap layanan perbaikan melalui platform FixIt dilindungi dengan Garansi Resmi Pengerjaan selama 30 hari penuh, suku cadang asli berstandar internasional, serta perlindungan terhadap kerusakan total.
                </p>
              </div>
              <div className="whitespace-nowrap flex flex-col gap-3 min-w-[200px]">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Garansi 30 Hari</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Suku Cadang Asli</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Proteksi Penuh</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="w-full py-20 bg-slate-900 border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center space-y-6">
          <h2 className="text-3xl font-bold text-slate-50 tracking-tight sm:text-4xl leading-tight">
            Siap untuk Pengalaman Servis Berkelas?
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">
            Tidak ada lagi kejutan biaya di akhir atau rasa was-was. Coba rasakan kemudahan proses kami sekarang juga.
          </p>
          <div className="flex justify-center pt-2">
            <Button href="/booking" variant="primary" size="lg" className="h-12 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
              Mulai Sekarang
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
