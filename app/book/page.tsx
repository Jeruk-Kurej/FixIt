import { PrismaClient } from "@prisma/client";
import ServiceSelection from "@/components/features/ServiceSelection";

const prisma = new PrismaClient();

export default async function BookPage() {
  // Ambil data kategori dari database secara dinamis (Server Component)
  const categories = await prisma.applianceCategory.findMany({
    orderBy: { baseServiceFee: 'asc' }
  });

  return (
    <div className="min-h-[calc(100vh-64px)] w-full py-12 md:py-20 flex flex-col items-center relative overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="container px-4 z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Mulai <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Perawatan</span> Anda
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Proses pemesanan pintar kami memastikan Anda mendapatkan teknisi terbaik dengan estimasi harga yang paling transparan.
          </p>
        </div>

        {/* Mounting the Interactive Client Component */}
        <ServiceSelection categories={categories} />
      </div>
    </div>
  );
}
