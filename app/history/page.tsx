import prisma from "@/lib/prisma";
// Force recompile to detect new Prisma schema
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import OrderHistoryList from "@/app/dashboard/OrderHistoryList";
import { History, ChevronLeft } from "lucide-react";
import Link from "next/link";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function HistoryPage() {
  const session = await getServerSession(authOptions);
  const cookieStore = await cookies();
  const userEmail = session?.user?.email || cookieStore.get("user_email")?.value;

  if (!userEmail) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    include: {
      orders: {
        include: {
          appliance: { include: { appliance_type: true } },
          review: true
        },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-8">
          <div className="flex items-center gap-4">
             <div>
                <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
                  <History className="text-orange-500" size={28} />
                  RIWAYAT LENGKAP
                </h1>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Maintenance Records & History</p>
             </div>
          </div>
        </div>


        {/* Full Screen History List */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
           <OrderHistoryList orders={user.orders} isCompact={false} />
        </div>

        {/* Informational Footer */}
        <div className="mt-12 p-8 bg-slate-900/50 border border-slate-800 rounded-[32px] text-center border-dashed">
           <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
             Semua data riwayat servis Anda tersimpan aman di sistem kami. <br />
             Gunakan data ini untuk klaim garansi atau pengecekan rutin teknisi.
           </p>
        </div>

      </div>
    </div>
  );
}
