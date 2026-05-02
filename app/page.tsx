import Button from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-slate-50 pt-20 pb-24 lg:pt-32 lg:pb-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-blue-950">
              Servis Elektronik Transparan, <span className="text-orange-500">Tanpa Drama</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Tinggalkan masalah harga gaib dan repotnya merawat barang elektronik. FixIt memberikan transparansi biaya di awal dan kemudahan servis rutin langsung dari genggaman Anda.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button href="/kalkulator" variant="secondary" size="lg" className="w-full sm:w-auto font-semibold">
                Cek Estimasi Harga
              </Button>
              <Button href="/membership" variant="outline" size="lg" className="w-full sm:w-auto font-semibold bg-white">
                Daftar Membership
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Keunggulan (MVP Features) Section */}
      <section className="w-full py-20 lg:py-32 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-blue-950 sm:text-4xl">
              Mengapa Memilih FixIt?
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Kami hadir untuk menyelesaikan masalah utama Anda saat merawat elektronik rumah tangga.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <Card className="flex flex-col h-full border-slate-200 hover:border-orange-300 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                  {/* Kalkulator Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <CardTitle className="text-xl">Kalkulator Harga</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed">
                  Ketahui estimasi biaya perbaikan dan suku cadang sebelum teknisi kami datang ke rumah. Tidak ada lagi harga gaib yang bikin jantungan.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="flex flex-col h-full border-slate-200 hover:border-orange-300 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center mb-4">
                  {/* Calendar Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <CardTitle className="text-xl">Smart Scheduling</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed">
                  Langganan membership untuk servis atau cuci AC rutin secara otomatis. Kami yang selalu ingat jadwalnya, Anda tinggal duduk manis.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="flex flex-col h-full border-slate-200 hover:border-orange-300 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                  {/* Home/Workshop Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <CardTitle className="text-xl">Home Service & Workshop</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed">
                  Bebas pilih teknisi datang langsung ke rumah, atau bawa barang elektronik Anda ke bengkel kami untuk ekstra privasi dan kenyamanan Anda.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}