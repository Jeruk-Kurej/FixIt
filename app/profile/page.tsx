import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import ProfileForm from "./ProfileForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { redirect } from "next/navigation";

export default async function CustomerProfilePage() {
  const session = await getServerSession(authOptions);
  const cookieStore = await cookies();
  const userEmail = session?.user?.email || cookieStore.get("user_email")?.value;

  if (!userEmail) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col py-8 px-4">
      <div className="w-full max-w-xl mx-auto space-y-6 relative z-10">
        
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-slate-800/60 pb-4">
          <Link href="/dashboard" className="p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-black text-slate-100">Profil Saya</h1>
            <p className="text-xs font-medium text-slate-500 mt-1">Kelola informasi pribadi dan pengaturan Anda</p>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl backdrop-blur-md">
          <div className="mb-6 pb-6 border-b border-slate-800/60">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-1">Email Terdaftar</p>
            <p className="text-sm font-black text-slate-300">{user.email}</p>
          </div>
          
          <ProfileForm 
            initialName={user.name || ""} 
            initialPhone={user.phone || ""}
            initialAddress={user.address || ""}
            initialAge={user.age}
            initialGender={user.gender}
          />
        </div>

      </div>
    </div>
  );
}
