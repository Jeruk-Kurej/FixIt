import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { formatRupiah, formatDate } from "@/lib/utils";
import AcceptButton from "./AcceptButton";
import ServiceCalendar from "@/components/features/ServiceCalendar";

export default async function TechnicianDashboardPage() {
  const cookieStore = await cookies();
  const userEmail = cookieStore.get("user_email")?.value;

  if (!userEmail) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    include: { technician: true },
  });

  if (!user || user.role !== "TECHNICIAN") {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-50 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-red-400 font-bold text-lg">Akses Ditolak</p>
          <p className="text-slate-400 text-sm mt-1">Hanya teknisi yang dapat mengakses dashboard ini.</p>
        </div>
      </div>
    );
  }

  let tech = user.technician;
  if (!tech) {
    tech = await prisma.technician.create({
      data: {
        user_id: user.id,
        rating: 4.8,
        is_available: true,
      }
    });
  }

  const incomingOrders = await prisma.order.findMany({
    where: { status: "PENDING" },
    include: {
      user: true,
      appliance: {
        include: {
          appliance_type: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const myAcceptedOrders = await prisma.order.findMany({
    where: { technician_id: tech.id },
    include: {
      user: true,
      appliance: {
        include: {
          appliance_type: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const calendarEvents = myAcceptedOrders
    .filter(o => o.scheduled_date_time)
    .map(o => ({
      id: o.id,
      date: new Date(o.scheduled_date_time!),
      applianceName: o.appliance?.appliance_type?.name || "Elektronik",
      type: o.service_type as any,
      status: o.status,
      problem: o.problem
    }));

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 py-10 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 border border-orange-500/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-orange-400 mb-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              Sistem Teknisi Aktif
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-50">Dashboard Kerja</h1>
            <p className="text-slate-400 mt-1">Selamat bertugas, <span className="text-orange-400 font-bold">{user.name}</span></p>
          </div>
          
          {/* Quick Stats Header */}
          <div className="flex gap-4">
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl px-6 py-3 backdrop-blur-md">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-0.5">Rating Anda</p>
              <p className="text-xl font-black text-orange-500">⭐ {tech.rating}</p>
            </div>
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl px-6 py-3 backdrop-blur-md">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-0.5">Total Selesai</p>
              <p className="text-xl font-black text-slate-100">{myAcceptedOrders.filter(o => o.status === 'DONE').length}</p>
            </div>
          </div>
        </div>

        {/* Main Grid: Calendar & Incoming Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Column 1: Calendar (Left) */}
          <div className="lg:col-span-8 space-y-8">
            <ServiceCalendar events={calendarEvents} />
            
            {/* My Active Orders (Moved below Calendar) */}
            <Card className="border-slate-800/80 bg-slate-800/40 backdrop-blur-md shadow-xl overflow-hidden">
              <CardHeader className="border-b border-slate-800 p-6 bg-slate-800/20 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <span className="p-1.5 bg-green-500/10 rounded-lg text-green-400">🛠️</span>
                    Tugas Saya Saat Ini
                  </CardTitle>
                  <p className="text-xs text-slate-500 mt-1">Daftar pekerjaan yang sedang Anda tangani.</p>
                </div>
                <span className="text-[10px] font-black bg-slate-900/50 px-3 py-1 rounded-full border border-slate-800 text-slate-400 uppercase tracking-widest">
                  {myAcceptedOrders.length} Aktif
                </span>
              </CardHeader>
              <CardContent className="p-0">
                {myAcceptedOrders.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800/60">
                    {myAcceptedOrders.map((order) => (
                      <div key={order.id} className="p-6 hover:bg-slate-800/20 transition-all">
                        <div className="flex flex-col gap-3">
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-slate-100">{order.appliance?.appliance_type?.name || "Elektronik"}</h4>
                            <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-[9px] font-black uppercase tracking-widest">
                              {order.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-2">{order.problem}</p>
                          <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-800/50">
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">👤 {order.user?.name}</p>
                            <p className="text-[9px] font-bold text-orange-400 uppercase tracking-widest">{formatRupiah(order.estimated_cost)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center text-slate-500">
                    <p className="text-sm">Anda belum memiliki pesanan aktif.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Column 2: Incoming Orders (Right) */}
          <div className="lg:col-span-4 sticky top-10">
            <Card className="border-orange-500/30 bg-slate-800/40 backdrop-blur-md shadow-[0_20px_40px_rgba(0,0,0,0.4)] overflow-hidden ring-1 ring-orange-500/20">
              <CardHeader className="border-b border-slate-800 p-5 bg-gradient-to-r from-orange-500/10 to-transparent">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                    </span>
                    Pesanan Baru
                  </CardTitle>
                  <span className="px-2 py-0.5 rounded bg-orange-500 text-white text-[9px] font-black uppercase tracking-widest animate-pulse">
                    LIVE
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-bold">Ambil segera sebelum teknisi lain!</p>
              </CardHeader>
              <CardContent className="p-0 max-h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar">
                {incomingOrders.length > 0 ? (
                  <div className="divide-y divide-slate-800/60">
                    {incomingOrders.map((order) => (
                      <div key={order.id} className="p-5 hover:bg-orange-500/[0.03] transition-all group border-l-2 border-transparent hover:border-orange-500">
                        <div className="flex flex-col gap-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-slate-100 group-hover:text-orange-400 transition-colors">{order.appliance?.appliance_type?.name || "Elektronik"}</h4>
                              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">📍 {order.user?.name}</p>
                            </div>
                            <p className="text-lg font-black text-orange-500">{formatRupiah(order.estimated_cost)}</p>
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-2 bg-slate-900/30 p-2 rounded-lg italic">"{order.problem}"</p>
                          <div className="flex items-center justify-between mt-2 pt-2">
                            <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{formatDate(order.createdAt)}</p>
                            <AcceptButton orderId={order.id} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-20 text-center flex flex-col items-center gap-4">
                    <div className="w-12 h-12 bg-slate-900/50 rounded-full flex items-center justify-center text-slate-700 animate-pulse">
                      📥
                    </div>
                    <p className="text-xs text-slate-600 font-bold uppercase tracking-widest">Menunggu Pesanan...</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Motivation Quote */}
            <div className="mt-6 p-4 rounded-2xl bg-slate-800/20 border border-slate-700/30 text-center">
              <p className="text-[10px] text-slate-500 italic leading-relaxed">
                "Kecepatan dalam merespon adalah kunci kepuasan pelanggan."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
