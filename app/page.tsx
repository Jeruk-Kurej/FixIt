import Link from "next/link";
import Button from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { ShieldCheck, Calendar, Activity, Wrench, Shield, Clock } from "lucide-react";
import { cookies } from "next/headers";

export default async function Home() {
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get("user_email")?.value;

  return (
    <div className="flex flex-col w-full bg-slate-900 text-slate-50 min-h-screen relative">
      {/* Visual Background Accent */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none" />

      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-32 flex flex-col items-center justify-center border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 text-sm font-medium text-orange-400 backdrop-blur-md animate-in fade-in duration-700">
              <ShieldCheck className="w-4 h-4" /> Solusi Servis Terpercaya & Transparan
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-50 leading-tight">
              Servis Elektronik Mewah, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Tanpa Drama</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Tinggalkan masalah harga gaib dan repotnya merawat barang elektronik. FixIt memberikan transparansi biaya di awal dan kemudahan servis rutin dalam satu dasbor.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-3 duration-1000">
              <Button href={isLoggedIn ? "/book" : "/login"} variant="primary" size="lg" className="w-full sm:w-auto font-semibold h-12 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                {isLoggedIn ? "Pesan Servis Sekarang" : "Pesan Sekarang"}
              </Button>
              <Button href={isLoggedIn ? "/dashboard" : "/calculator"} variant="outline" size="lg" className="w-full sm:w-auto font-semibold h-12 border-slate-700 hover:bg-slate-800">
                {isLoggedIn ? "Dasbor Saya" : "Cek Estimasi Harga"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features Section */}
      <section className="w-full py-24 bg-slate-900 border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-5xl mb-4 leading-tight">
              Mengapa Memilih FixIt?
            </h2>
            <p className="text-lg text-slate-400">
              Kami menggabungkan teknologi modern dengan teknisi tersertifikasi untuk memberikan kenyamanan total.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Bento Card 1 */}
            <Card className="flex flex-col justify-between h-full bg-slate-800/40 border-slate-700/50 hover:border-orange-500/30 transition-all p-8 group min-h-[250px]">
              <CardHeader className="p-0">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-6 text-orange-400 group-hover:scale-110 group-hover:bg-orange-500/20 transition-all">
                  <Activity className="w-7 h-7" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-50 mb-3 leading-tight">
                  Kalkulator Transparansi
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-slate-400 leading-relaxed text-sm">
                  Ketahui detail biaya perbaikan dan suku cadang sebelum teknisi kami tiba. Kami menjamin tidak ada biaya siluman.
                </p>
              </CardContent>
            </Card>

            {/* Bento Card 2 */}
            <Card className="flex flex-col justify-between h-full bg-slate-800/40 border-slate-700/50 hover:border-orange-500/30 transition-all p-8 group min-h-[250px]">
              <CardHeader className="p-0">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-6 text-orange-400 group-hover:scale-110 group-hover:bg-orange-500/20 transition-all">
                  <Calendar className="w-7 h-7" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-50 mb-3 leading-tight">
                  Smart Scheduling
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-slate-400 leading-relaxed text-sm">
                  Langganan membership untuk pemeliharaan otomatis. Jadwal cuci AC rutin diatur secara berkala tanpa pusing.
                </p>
              </CardContent>
            </Card>

            {/* Bento Card 3 */}
            <Card className="flex flex-col justify-between h-full bg-slate-800/40 border-slate-700/50 hover:border-orange-500/30 transition-all p-8 group min-h-[250px]">
              <CardHeader className="p-0">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-6 text-orange-400 group-hover:scale-110 group-hover:bg-orange-500/20 transition-all">
                  <Wrench className="w-7 h-7" />
                </div>
                <CardTitle className="text-2xl font-bold text-slate-50 mb-3 leading-tight">
                  Home & Workshop
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-slate-400 leading-relaxed text-sm">
                  Fleksibilitas total. Panggil teknisi ahli langsung ke tempat Anda, atau bawa barang ke bengkel kami demi privasi ekstra.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* More Info Section / Mature Company Profile */}
      <section className="w-full py-24 bg-slate-900 border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-orange-500">Kualitas Tanpa Kompromi</h3>
              <h2 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl leading-tight">
                Teknisi Ahli dengan Skor Kepercayaan Tinggi
              </h2>
              <p className="text-slate-400 leading-relaxed">
                Kami tidak sembarangan mengirim teknisi. Setiap teknisi di platform FixIt wajib memiliki sertifikasi resmi dan dinilai secara transparan oleh pelanggan.
              </p>
              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Garansi Penuh 30 Hari untuk setiap perbaikan.</span>
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Waktu kedatangan teknisi tepat waktu 99.1%.</span>
                </li>
              </ul>
              <div className="pt-4">
                <Button href={isLoggedIn ? "/dashboard" : "/register"} variant="outline" className="border-slate-700 hover:bg-slate-800">
                  {isLoggedIn ? "Masuk Dasbor" : "Daftar Sekarang"}
                </Button>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-blue-500/10 blur-xl opacity-30 group-hover:opacity-60 transition-all rounded-3xl" />
              <div className="aspect-video w-full rounded-2xl bg-slate-800/60 border border-slate-700/50 p-6 flex items-center justify-center backdrop-blur-xl relative z-10 select-none overflow-hidden hover:border-orange-500/30 transition-all">
                <div className="text-center space-y-2">
                  <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-emerald-400">98% Kepuasan</span>
                  <p className="text-xs text-slate-500">Berdasarkan ulasan 10,000+ pelanggan FixIt</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}