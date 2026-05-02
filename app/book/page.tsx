import { PrismaClient } from "@prisma/client";
import ServiceSelection from "@/components/features/ServiceSelection";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export default async function BookPage() {
  const cookieStore = await cookies();
  const userEmail = cookieStore.get("user_email")?.value;

  // Jika belum login, redirect ke halaman login dulu
  if (!userEmail) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    redirect("/login");
  }

  const categories = await prisma.applianceCategory.findMany({
    orderBy: { baseServiceFee: 'asc' }
  });

  // Jika kategori kosong, kita buat seeder manual atau pakai data default
  const defaultCategories = categories.length > 0 ? categories : [
    { id: "ac", name: "AC", baseServiceFee: 100000, iconUrl: "" },
    { id: "kulkas", name: "Kulkas", baseServiceFee: 150000, iconUrl: "" },
    { id: "mesincuci", name: "Mesin Cuci", baseServiceFee: 120000, iconUrl: "" }
  ] as any;

  return (
    <div className="min-h-[calc(100vh-64px)] w-full py-12 md:py-20 flex flex-col items-center relative overflow-hidden bg-slate-900 text-slate-50">
      {/* Background Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="container px-4 z-10 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Mulai <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Perawatan</span> Anda
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg">
            Proses pemesanan pintar Gojek-Style memastikan Anda mendapatkan teknisi terbaik dengan rincian data Anda yang aman.
          </p>
        </div>

        {/* Passing initial User details to the Client component */}
        <ServiceSelection 
          categories={defaultCategories} 
          initialPhone={user.phone || ""} 
          initialAddress={user.address || ""} 
        />
      </div>
    </div>
  );
}
