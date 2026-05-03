import { Metadata } from "next";
import { Users, ShieldCheck, Target, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | FixIt",
  description: "Lebih dari sekadar teknisi, kami adalah mitra cerdas untuk kenyamanan rumah Anda.",
};

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <section className="relative w-full py-24 md:py-32 flex flex-col items-center justify-center border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-50 leading-tight">
              Revolusi <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Perawatan Rumah</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 leading-relaxed">
              [Placeholder Deskripsi] FixIt hadir untuk memberikan ketenangan pikiran. Kami menggabungkan teknologi cerdas dengan teknisi premium untuk merawat barang elektronik kesayangan Anda tanpa repot.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values / Visi Misi */}
      <section className="w-full py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-50">Nilai Inti Kami</h2>
            <p className="mt-4 text-slate-400 max-w-2xl mx-auto">Kami berpegang teguh pada prinsip-prinsip yang memastikan kepuasan dan kenyamanan Anda.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl backdrop-blur-md">
              <div className="w-12 h-12 bg-orange-500/10 text-orange-400 rounded-xl flex items-center justify-center mb-4">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-200 mb-2">Visi [Placeholder]</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Menjadi platform perawatan hunian modern terbaik di Indonesia yang transparan dan dapat diandalkan.</p>
            </div>
            
            <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl backdrop-blur-md">
              <div className="w-12 h-12 bg-orange-500/10 text-orange-400 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-200 mb-2">Misi [Placeholder]</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Menghubungkan ahli teknis terbaik dengan pemilik rumah melalui sistem yang cerdas dan bebas basa-basi.</p>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl backdrop-blur-md">
              <div className="w-12 h-12 bg-orange-500/10 text-orange-400 rounded-xl flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-200 mb-2">Integritas [Placeholder]</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Harga transparan tanpa biaya tersembunyi. Kepercayaan Anda adalah aset terbesar kami.</p>
            </div>

            <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl backdrop-blur-md">
              <div className="w-12 h-12 bg-orange-500/10 text-orange-400 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-200 mb-2">Inovasi [Placeholder]</h3>
              <p className="text-slate-400 text-sm leading-relaxed">Terus mengembangkan fitur-fitur baru seperti Smart Scheduling untuk membuat hidup Anda lebih mudah.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Placeholder */}
      <section className="w-full py-24 bg-slate-900 border-t border-slate-800">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl font-bold text-slate-50 mb-6">[Tempat Tambahan Cerita Anda]</h2>
          <p className="text-slate-400">Gunakan area ini untuk menambahkan timeline sejarah FixIt, foto tim, atau detail lainnya.</p>
        </div>
      </section>
    </div>
  );
}
