import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import ProfileForm from "./ProfileForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { redirect } from "next/navigation";

export default async function TechnicianProfilePage() {
  const session = await getServerSession(authOptions);
  const cookieStore = await cookies();
  const userEmail = session?.user?.email || cookieStore.get("user_email")?.value;

  if (!userEmail) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    include: {
      technician: {
        include: { specialties: true }
      }
    }
  });

  if (!user || user.role !== "TECHNICIAN" || !user.technician) {
    redirect("/dashboard");
  }

  const applianceTypes = await prisma.applianceType.findMany({
    orderBy: { name: 'asc' }
  });

  const initialData = {
    name: user.name || "",
    phone: user.phone || "",
    specialties: user.technician.specialties.map(s => s.id)
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col py-8 px-4">
      <div className="w-full max-w-xl mx-auto space-y-6 relative z-10">
        
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-slate-800/60 pb-4">
          <Link href="/dashboard" className="p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-black text-slate-100">Profil Teknisi</h1>
            <p className="text-xs font-medium text-slate-500 mt-1">Kelola informasi pribadi dan spesialisasi Anda</p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-md">
          <ProfileForm initialData={initialData} applianceTypes={applianceTypes} />
        </div>

      </div>
    </div>
  );
}
