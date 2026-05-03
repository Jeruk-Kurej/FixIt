import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Star, ShieldCheck, Quote, BadgeCheck } from "lucide-react";

export default function TestimoniPage() {
  const reviews = [
    {
      name: "Andri Hermawan",
      location: "CitraLand, Surabaya",
      feedback: "Layanan servis AC di FixIt sangat luar biasa. Teknisi datang tepat waktu, sopan, dan transparan mengenai biaya suku cadang. Akhirnya ketemu platform yang jujur.",
      avatar: "AH",
    },
    {
      name: "Sinta Wijaya",
      location: "Graha Famili, Surabaya",
      feedback: "Saya sangat terbantu dengan Smart Scheduling FixIt. Booking perbaikan kulkas pun tidak ribet sama sekali. Harganya sama persis dengan estimasi.",
      avatar: "SW",
    },
    {
      name: "Budi Pratama",
      location: "Pakuwon Indah, Surabaya",
      feedback: "Tiga kali servis mesin cuci lewat platform ini, hasilnya selalu memuaskan. Teknisi tersertifikasi dan kerjanya sangat rapi. Sangat direkomendasikan!",
      avatar: "BP",
    },
  ];

  const technicians = [
    {
      name: "Budi Santoso",
      spec: "Spesialis AC & Pendingin",
      rating: "4.9",
      experience: "8 Tahun Pengalaman",
    },
    {
      name: "Siti Aminah",
      spec: "Spesialis Kulkas & Freezer",
      rating: "4.8",
      experience: "6 Tahun Pengalaman",
    },
    {
      name: "Andi Wijaya",
      spec: "Spesialis Mesin Cuci & Pengering",
      rating: "4.9",
      experience: "7 Tahun Pengalaman",
    },
    {
      name: "Hendra K.",
      spec: "Spesialis Instalasi & Modul",
      rating: "4.7",
      experience: "5 Tahun Pengalaman",
    },
  ];

  return (
    <div className="flex flex-col w-full bg-slate-900 text-slate-50 min-h-screen relative">
      {/* Visual background accent */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Header Section */}
      <section className="relative w-full py-20 md:py-32 flex flex-col items-center justify-center border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 text-sm font-medium text-orange-400 backdrop-blur-md animate-in fade-in duration-700">
              <Star className="w-4 h-4" /> Kisah Nyata & Ulasan Pelanggan
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-50 leading-tight">
              Real Stories from <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">The Sanctuary</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Dengarkan penuturan langsung dari para pemilik hunian premium yang mempercayakan perawatan elektronik rumah mereka kepada FixIt.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-16 bg-slate-900 border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <Card className="bg-slate-800/40 border-slate-700/50 hover:border-orange-500/30 transition-all p-8 flex flex-col justify-center items-center">
              <span className="text-5xl font-black text-orange-500 mb-2">99.2%</span>
              <span className="text-base font-semibold text-slate-200">Client Satisfaction Rate</span>
              <p className="text-xs text-slate-400 mt-2">Berdasarkan survei kepuasan pelanggan bulanan kami</p>
            </Card>

            <Card className="bg-slate-800/40 border-slate-700/50 hover:border-orange-500/30 transition-all p-8 flex flex-col justify-center items-center">
              <span className="text-5xl font-black text-orange-500 mb-2">15,000+</span>
              <span className="text-base font-semibold text-slate-200">Homes Maintained</span>
              <p className="text-xs text-slate-400 mt-2">Melayani pemeliharaan berkala rumah & apartemen mewah</p>
            </Card>

            <Card className="bg-slate-800/40 border-slate-700/50 hover:border-orange-500/30 transition-all p-8 flex flex-col justify-center items-center">
              <span className="text-5xl font-black text-orange-500 mb-2">100%</span>
              <span className="text-base font-semibold text-slate-200">Verified Professionals</span>
              <p className="text-xs text-slate-400 mt-2">Seluruh teknisi kami wajib lulus uji sertifikasi ketat</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Community Voices Section */}
      <section className="w-full py-24 bg-slate-900 border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl mb-4 leading-tight">
              Community Voices
            </h2>
            <p className="text-lg text-slate-400">
              Apa yang mereka katakan mengenai efisiensi, transparansi, dan kerapihan kerja teknisi kami.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {reviews.map((review, idx) => (
              <Card key={idx} className="flex flex-col justify-between h-full bg-slate-800/40 border-slate-700/50 hover:border-orange-500/30 transition-all p-8 group min-h-[300px]">
                <CardHeader className="p-0">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 font-bold">
                      {review.avatar}
                    </div>
                    <Quote className="w-6 h-6 text-slate-600 group-hover:text-orange-500/40 transition-colors" />
                  </div>
                </CardHeader>
                <CardContent className="p-0 flex-1 flex flex-col justify-between">
                  <p className="text-slate-300 text-sm leading-relaxed mb-6 italic select-none">
                    "{review.feedback}"
                  </p>
                  <div>
                    <h4 className="text-base font-bold text-slate-50 leading-tight">{review.name}</h4>
                    <span className="text-xs text-slate-500 font-medium">{review.location}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technician Spotlight Section */}
      <section className="w-full py-24 bg-slate-900 border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl mb-4 leading-tight">
              Andalan Kami (Verified Technicians)
            </h2>
            <p className="text-lg text-slate-400">
              Mengenal teknisi andalan kami yang siap menjaga kenyamanan perangkat rumah tangga Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {technicians.map((tech, idx) => (
              <Card key={idx} className="flex flex-col justify-between bg-slate-800/40 border-slate-700/50 hover:border-orange-500/30 transition-all p-6 group">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-slate-800 border-2 border-slate-700 mx-auto flex items-center justify-center text-orange-400 mb-4 group-hover:scale-105 transition-all">
                    <BadgeCheck className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-50 tracking-tight">{tech.name}</h4>
                  <span className="text-xs text-orange-400 font-medium block mt-1">{tech.spec}</span>
                </div>
                <div className="border-t border-slate-700/50 mt-6 pt-4 text-center flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="font-semibold text-slate-200">{tech.rating}</span>
                  </div>
                  <span>{tech.experience}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee Strip / Poin Keamanan */}
      <section className="w-full py-12 bg-slate-800/30 border-b border-slate-800/60 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center gap-3 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-sm font-semibold tracking-wider uppercase">Absolute Safety</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-sm font-semibold tracking-wider uppercase">Full Insurance</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-sm font-semibold tracking-wider uppercase">Quality Guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA section */}
      <section className="w-full py-20 bg-slate-900 border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-4xl space-y-6">
          <h2 className="text-3xl font-bold text-slate-50 tracking-tight sm:text-4xl leading-tight">
            Ingin Menjadi Bagian Dari Kisah Sukses Kami?
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">
            Dapatkan pelayanan premium tanpa kejutan biaya dan rasa khawatir. Daftarkan diri Anda sekarang.
          </p>
          <div className="flex justify-center pt-2">
            <Button href="/register" variant="primary" size="lg" className="h-12 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
              Daftar Sekarang
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
