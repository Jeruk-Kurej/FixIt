import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { ClipboardCheck, AlertCircle, CheckCircle2, ChevronLeft } from "lucide-react";
import VerificationForm from "./VerificationForm";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function VerificationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const cookieStore = await cookies();
  const userEmail = session?.user?.email || cookieStore.get("user_email")?.value;

  if (!userEmail) redirect("/login");

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: true,
      appliance: {
        include: {
          appliance_type: true,
        },
      },
    },
  });

  if (!order) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 py-12 relative">
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        
        {/* Header with Back Button */}
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Button href="/dashboard" variant="secondary" className="p-3 rounded-2xl">

              <ChevronLeft size={24} />
            </Button>
            <div>
              <h1 className="text-3xl font-black tracking-tight">Workspace Verifikasi</h1>
              <p className="text-slate-400 mt-1">
                Lakukan pengecekan detail untuk pesanan <span className="text-orange-400 font-bold">#{order.id.slice(0, 8)}</span>
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-3 bg-slate-800/40 border border-slate-700/50 px-6 py-3 rounded-2xl backdrop-blur-md">
            <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500">
              <ClipboardCheck size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Barang</p>
              <p className="text-sm font-bold text-slate-100">{order.appliance?.appliance_type?.name}</p>
            </div>
          </div>
        </div>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Reference & Complaint */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border-slate-800 bg-slate-800/40 backdrop-blur-md shadow-xl overflow-hidden">
              <CardHeader className="border-b border-slate-800 p-6 bg-slate-800/20">
                <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <AlertCircle size={14} className="text-blue-500" />
                  Keluhan Awal Customer
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800/50 italic text-slate-300 leading-relaxed">
                  "{order.problem}"
                </div>
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Pelanggan</span>
                    <span className="font-bold text-slate-200">{order.user?.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Merk Barang</span>
                    <span className="font-bold text-slate-200">{order.appliance?.brand}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="p-6 bg-orange-500/5 border border-orange-500/10 rounded-3xl">
              <h4 className="text-xs font-black text-orange-400 uppercase tracking-widest mb-3">Tips Teknisi</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed italic">
                "Pastikan mengecek kabel kelistrikan sebelum membongkar komponen utama. Seringkali masalah sepele menjadi penyebab utama."
              </p>
            </div>
          </div>

          {/* Right Panel: The Verification Form (Interactive) */}
          <div className="lg:col-span-8">
            <VerificationForm order={JSON.parse(JSON.stringify(order))} />
          </div>

        </div>
      </div>
    </div>
  );
}
