import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { formatRupiah, formatDate } from "@/lib/utils";
import AcceptButton from "./AcceptButton";
import ServiceCalendar from "@/components/features/ServiceCalendar";
import ChatButton from "@/components/features/ChatButton";
import ChatHub from "@/components/features/ChatHub";


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
      technician: true,
      appliance: {
        include: {
          appliance_type: true,
        },
      },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1
      }
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

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] relative z-10">
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
          
          <div className="flex gap-4">
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl px-6 py-3 backdrop-blur-md">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-0.5">Rating</p>
              <p className="text-xl font-black text-orange-500">⭐ {tech.rating}</p>
            </div>
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl px-6 py-3 backdrop-blur-md text-right">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-0.5">Selesai</p>
              <p className="text-xl font-black text-slate-100">{myAcceptedOrders.filter(o => o.status === 'DONE').length}</p>
            </div>
          </div>
        </div>

        {/* 3-Column Workspace Layout */}
        <div className="flex flex-col md:flex-row gap-6 items-stretch h-auto md:h-[750px]">
          
          {/* Col 1: Incoming Orders (Narrow) */}
          <div className="md:w-[25%] flex flex-col">
            <Card className="border-orange-500/30 bg-slate-800/40 backdrop-blur-md shadow-2xl overflow-hidden flex flex-col h-full ring-1 ring-orange-500/20">
              <CardHeader className="border-b border-slate-800 p-5 bg-gradient-to-r from-orange-500/10 to-transparent">
                <CardTitle className="text-lg flex items-center gap-2">
                   🔥 Pesanan Baru
                </CardTitle>
                <p className="text-[9px] text-slate-500 mt-1 font-bold uppercase tracking-widest">Ambil segera!</p>
              </CardHeader>
              <CardContent className="p-0 overflow-y-auto custom-scrollbar flex-grow">
                {incomingOrders.length > 0 ? (
                  <div className="divide-y divide-slate-800/60">
                    {incomingOrders.map((order) => (
                      <div key={order.id} className="p-4 hover:bg-orange-500/[0.03] transition-all group border-l-2 border-transparent hover:border-orange-500">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-sm text-slate-100">{order.appliance?.appliance_type?.name}</h4>
                          <p className="text-xs font-black text-orange-500">{formatRupiah(order.estimated_cost)}</p>
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-2 bg-slate-900/40 p-2 rounded mb-3 italic">"{order.problem}"</p>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-bold text-slate-600">👤 {order.user?.name.split(' ')[0]}</span>
                          <AcceptButton orderId={order.id} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-10 text-center text-slate-600 uppercase text-[9px] font-black tracking-widest">
                    Menunggu pesanan baru...
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Col 2: Calendar & Active Tasks (Medium) */}
          <div className="md:w-[40%] flex flex-col gap-6 overflow-hidden">
            <div className="flex-grow">
               <ServiceCalendar events={calendarEvents} />
            </div>
            
            {/* Active Tasks Mini List */}
            <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-md h-[250px] overflow-hidden flex flex-col">
              <CardHeader className="p-4 border-b border-slate-800/50 bg-slate-800/20">
                 <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Tugas Aktif ({myAcceptedOrders.filter(o => o.status !== 'DONE').length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0 overflow-y-auto custom-scrollbar flex-grow">
                 {myAcceptedOrders.filter(o => o.status !== 'DONE').map(order => (
                    <div key={order.id} className="p-4 border-b border-slate-800/50 flex items-center justify-between group hover:bg-slate-800/20">
                        <div>
                          <p className="text-xs font-bold text-slate-200">{order.appliance?.appliance_type?.name}</p>
                          <p className="text-[9px] text-slate-500">{order.user?.name}</p>
                        </div>
                        <span className="text-[9px] px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20 font-black uppercase">
                          {order.status}
                        </span>
                    </div>
                 ))}
              </CardContent>
            </Card>
          </div>

          {/* Col 3: Integrated Chat Hub (Medium) */}
          <div className="md:w-[35%] flex flex-col">
            <Card className="border-slate-800/80 bg-slate-800/40 backdrop-blur-md h-full shadow-xl overflow-hidden flex flex-col">
              <CardHeader className="border-b border-slate-800 p-5 bg-slate-800/20">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="p-1.5 bg-orange-500/10 rounded-lg text-orange-400">💬</span>
                  Obrolan Kerja
                </CardTitle>
              </CardHeader>
              <div className="flex-grow overflow-hidden">
                <ChatHub 
                  initialOrders={JSON.parse(JSON.stringify(myAcceptedOrders.filter(o => ['ACCEPTED', 'WORKING', 'DONE'].includes(o.status))))} 
                  currentUserId={user.id}
                  compact={true}
                />
              </div>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}

