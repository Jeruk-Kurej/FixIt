import { HardHat } from "lucide-react";
import Button from "@/components/ui/Button";

export default function PartnerRegistrationPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 text-center max-w-md space-y-6">
        <div className="w-24 h-24 bg-orange-500/10 text-orange-400 rounded-3xl mx-auto flex items-center justify-center border border-orange-500/20">
          <HardHat className="w-12 h-12" />
        </div>
        <h1 className="text-3xl font-bold text-slate-50">Halaman Sedang Dalam Pengembangan</h1>
        <p className="text-slate-400 text-lg">
          Kami sedang mempersiapkan portal pendaftaran mitra FixIt yang terbaik untuk Anda. Silakan kembali lagi nanti!
        </p>
        <div className="pt-6">
          <Button href="/contact" variant="outline" className="border-slate-700 hover:bg-slate-800">
            Kembali ke Pusat Bantuan
          </Button>
        </div>
      </div>
    </div>
  );
}
