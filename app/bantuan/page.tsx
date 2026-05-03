import Button from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { HelpCircle, Calendar, CreditCard, Shield, Settings, MessageCircle, Mail } from "lucide-react";

export default function BantuanPage() {
  const categories = [
    {
      title: "Booking",
      desc: "Modifikasi, pembatalan, dan penjadwalan ulang kunjungan teknisi.",
      icon: <Calendar className="w-6 h-6" />,
    },
    {
      title: "Payment",
      desc: "Invoice, status pengembalian dana, dan rincian metode pembayaran.",
      icon: <CreditCard className="w-6 h-6" />,
    },
    {
      title: "FixIt Care",
      desc: "Standar kualitas, jaminan kebersihan, dan keamanan penuh.",
      icon: <Shield className="w-6 h-6" />,
    },
    {
      title: "Technical Issues",
      desc: "Solusi kendala aplikasi, login, serta notifikasi di perangkat Anda.",
      icon: <Settings className="w-6 h-6" />,
    },
  ];

  const faqs = [
    {
      q: "Bagaimana cara FixIt memverifikasi teknisi?",
      a: "Seluruh teknisi kami wajib melalui proses seleksi ketat, meliputi verifikasi dokumen resmi, wawancara latar belakang, serta uji kompetensi teknis sebelum dapat melayani pelanggan.",
    },
    {
      q: "Apakah pengerjaan dilindungi garansi?",
      a: "Tentu saja. Semua jenis pengerjaan lewat aplikasi FixIt dilindungi oleh Garansi Resmi selama 30 hari. Jika masalah yang sama terjadi lagi dalam masa garansi, teknisi akan kembali memperbaikinya tanpa biaya tambahan.",
    },
    {
      q: "Bagaimana jika ada kerusakan saat teknisi bekerja?",
      a: "Kami menyediakan asuransi perlindungan penuh (Full Insurance) untuk memastikan keamanan total barang berharga di hunian Anda. Segala kerusakan akibat kelalaian akan kami tanggung sepenuhnya.",
    },
    {
      q: "Apakah biaya yang ditampilkan di kalkulator bersifat mengikat?",
      a: "Ya. Estimasi biaya yang Anda lihat di kalkulator kami adalah biaya yang transparan dan jujur. Teknisi kami tidak akan menarik biaya tambahan yang tidak terdaftar (no hidden fees).",
    },
  ];

  return (
    <div className="flex flex-col w-full bg-slate-900 text-slate-50 min-h-screen relative">
      {/* Background visual accent */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Header & Title */}
      <section className="relative w-full py-20 md:py-32 flex flex-col items-center justify-center border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 text-sm font-medium text-orange-400 backdrop-blur-md animate-in fade-in duration-700">
              <HelpCircle className="w-4 h-4" /> Bantuan & Pusat Informasi
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-50 leading-tight">
              How can we assist your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Peace of Mind</span> today?
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Temukan jawaban untuk berbagai pertanyaan umum atau langsung hubungi tim bantuan premium kami yang siap melayani Anda.
            </p>
          </div>
        </div>
      </section>

      {/* Support Categories Grid */}
      <section className="w-full py-24 bg-slate-900 border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl mb-4 leading-tight">
              Kategori Informasi Bantuan
            </h2>
            <p className="text-lg text-slate-400">
              Pilih salah satu kategori topik di bawah ini untuk mendapatkan bantuan spesifik.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {categories.map((cat, idx) => (
              <Card key={idx} className="flex flex-col justify-between h-full bg-slate-800/40 border-slate-700/50 hover:border-orange-500/30 transition-all p-6 group min-h-[220px]">
                <CardHeader className="p-0">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-4 text-orange-400 group-hover:scale-110 group-hover:bg-orange-500/20 transition-all">
                    {cat.icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-50 mb-2 leading-tight">
                    {cat.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {cat.desc}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Essential Guide (FAQ Accordion Style) */}
      <section className="w-full py-24 bg-slate-900 border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-start">
            
            {/* Visual Accent Box in grid */}
            <div className="md:col-span-5 relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-blue-500/10 blur-xl opacity-40 group-hover:opacity-70 transition-all rounded-3xl" />
              <div className="w-full rounded-2xl bg-slate-800/50 border border-slate-700/60 p-8 backdrop-blur-xl relative z-10 space-y-6 hover:border-orange-500/30 transition-all">
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-orange-500">FAQ Kami</h3>
                  <h2 className="text-3xl font-bold text-slate-50 leading-tight">
                    Pertanyaan Penting Bagi Pemilik Rumah
                  </h2>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Kami mengerti bahwa mempercayakan perbaikan elektronik rumah tangga membutuhkan rasa aman yang tinggi. Berikut penjelasan lengkap terkait prosedur operasional kami.
                </p>
                <div className="pt-4">
                  <span className="text-xs text-slate-500 font-medium select-none block">Dapatkan panduan terlengkap dari tim kami.</span>
                </div>
              </div>
            </div>

            {/* Accordion Questions List */}
            <div className="md:col-span-7 space-y-4">
              {faqs.map((faq, idx) => (
                <Card key={idx} className="bg-slate-800/20 border-slate-700/40 hover:border-orange-500/30 transition-all p-6 backdrop-blur-md">
                  <h4 className="text-lg font-bold text-slate-100 mb-2 leading-snug">
                    {faq.q}
                  </h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {faq.a}
                  </p>
                </Card>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Still Need Help Section Banner */}
      <section className="w-full py-24 bg-slate-900 border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-blue-500/20 blur-2xl opacity-40 group-hover:opacity-70 transition-all rounded-3xl" />
            <div className="w-full rounded-2xl bg-slate-800/50 border border-slate-700/60 p-12 backdrop-blur-xl relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 hover:border-orange-500/40 transition-all">
              <div className="max-w-2xl text-left">
                <h3 className="text-3xl font-bold tracking-tight text-slate-50 mb-3">
                  Masih Membutuhkan Bantuan?
                </h3>
                <p className="text-slate-400 leading-relaxed text-base">
                  Jika Anda tidak menemukan jawaban untuk pertanyaan Anda, Anda dapat langsung menghubungi kami melalui opsi bantuan langsung di bawah ini.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                <Button href="https://wa.me/6280012345678" variant="outline" className="border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-400 flex items-center justify-center gap-2 h-12 px-6">
                  <MessageCircle className="w-5 h-5" /> WhatsApp CS
                </Button>
                <Button href="mailto:cs@fixit.com" variant="outline" className="border-slate-700 hover:bg-slate-700 flex items-center justify-center gap-2 h-12 px-6">
                  <Mail className="w-5 h-5" /> Kirim Tiket
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
