import prisma from "@/lib/prisma";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import SmartReminderAlert from "@/components/features/SmartReminderAlert";

import { formatRupiah } from "@/lib/utils";
import ServiceCalendar from "@/components/features/ServiceCalendar";
import AcceptButton from "./AcceptButton";
import ActiveTasksList from "./ActiveTasksList";
import FloatingChatWidget from "@/components/features/FloatingChatWidget";
import { TrendingUp, Clock, Star, CheckCircle2 } from "lucide-react";

interface TechnicianDashboardViewProps {
  user: any;
  tech: any;
}

export default async function TechnicianDashboardView({ user, tech }: TechnicianDashboardViewProps) {
  // 1. Get Incoming Orders (Only those that have been paid/verified)
  const incomingOrders = await prisma.order.findMany({
    where: { 
      status: 'PENDING',
      payment_status: { in: ['DP_PAID', 'FULLY_PAID'] }
    },
    include: {
      user: true,
      appliance: { include: { appliance_type: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  // 2. Get My Accepted/Working Orders
  const myAcceptedOrders = await prisma.order.findMany({
    where: { 
      technician_id: tech.id,
      status: { in: ['ACCEPTED', 'WORKING', 'DONE'] }
    },
    include: {
      user: true,
      appliance: { include: { appliance_type: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  // 3. Calculate Stats
  const finishedOrders = myAcceptedOrders.filter(o => o.status === 'DONE');
  const totalEarnings = finishedOrders.reduce((sum, o) => sum + (o.final_cost || o.estimated_cost || 0), 0);
  const totalUnits = finishedOrders.length;

  const calendarEvents = myAcceptedOrders
    .filter(o => o.scheduled_date_time)
    .map(o => ({
      id: o.id,
      date: new Date(o.scheduled_date_time!),
      applianceName: `${o.user?.name} - ${o.appliance?.appliance_type?.name}`,
      type: o.service_type as any,
      status: o.status,
      problem: o.problem || "Cek Berkala"
    }));

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col overflow-hidden bg-slate-950/20">
      <div className="w-full px-4 flex flex-col h-full relative z-10 pt-4 pb-4">
        
        {/* Very Slim Header */}
        <div className="mb-4 flex items-center justify-between gap-4 shrink-0 px-2">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-black tracking-tight text-slate-50 flex items-center gap-3">
              Halo, {user.name}
            </h1>
          </div>
          
          <div className="flex gap-4">
             <div className="flex items-center gap-2">
                <Star size={10} className="text-orange-500 fill-orange-500" />
                <span className="text-[10px] font-black text-slate-300">RATING {tech.rating.toFixed(1)}</span>
             </div>
             <div className="flex items-center gap-2">
                <CheckCircle2 size={10} className="text-emerald-500" />
                <span className="text-[10px] font-black text-slate-300">TOTAL {totalUnits} SELESAI</span>
             </div>
          </div>
        </div>

        {/* Unified Layout: Sidebar + Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-grow overflow-hidden min-h-0">

          
          {/* Sidebar (3/12) */}
          <div className="md:col-span-3 flex flex-col gap-4 h-full min-h-0">
            
            {/* Shortened Incoming Feed */}
            <Card className="border-slate-800 bg-slate-900/40 backdrop-blur-md shadow-2xl overflow-hidden flex flex-col h-[45%] shrink-0">
              <CardHeader className="border-b border-slate-800 p-3 bg-slate-800/20 shrink-0">
                <CardTitle className="text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                   🔥 Pesanan Baru
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 overflow-y-auto custom-scrollbar flex-grow">
                {incomingOrders.length > 0 ? (
                  <div className="divide-y divide-slate-800/60">
                    {incomingOrders.map((order) => (
                      <div key={order.id} className="p-4 hover:bg-orange-500/[0.05] transition-all group">
                        <h4 className="font-bold text-[10px] text-slate-100 truncate mb-1">{order.appliance?.appliance_type?.name}</h4>
                        <div className="flex items-center justify-between">
                           <span className="text-[9px] font-black text-orange-500">{formatRupiah(order.estimated_cost)}</span>
                           <AcceptButton orderId={order.id} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-700 uppercase text-[8px] font-black tracking-widest h-full flex items-center justify-center">
                    Kosong...
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Vertical Stats Card */}
            <Card className="border-slate-800 bg-slate-900/60 backdrop-blur-md flex-grow overflow-hidden flex flex-col p-4 gap-3">
               <div className="p-4 bg-slate-800/30 border border-slate-700/30 rounded-2xl flex items-center gap-4 group hover:border-emerald-500/50 transition-all duration-500">
                  <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500 group-hover:scale-110 transition-transform">
                     <TrendingUp size={18} />
                  </div>
                  <div>
                     <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Omzet Bulan Ini</p>
                     <p className="text-sm font-black text-slate-100">{formatRupiah(totalEarnings)}</p>
                  </div>
               </div>

               <div className="p-4 bg-slate-800/30 border border-slate-800/50 rounded-2xl flex items-center gap-4 group hover:border-blue-500/50 transition-all duration-500">
                  <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500 group-hover:scale-110 transition-transform">
                     <CheckCircle2 size={18} />
                  </div>
                  <div>
                     <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Unit Ditangani</p>
                     <p className="text-sm font-black text-slate-100">{totalUnits} Pesanan Beres</p>
                  </div>
               </div>

               <div className="p-4 bg-slate-800/30 border border-slate-800/50 rounded-2xl flex items-center gap-4 group hover:border-orange-500/50 transition-all duration-500">
                  <div className="p-3 bg-orange-500/10 rounded-xl text-orange-500 group-hover:scale-110 transition-transform">
                     <Star size={18} />
                  </div>
                  <div>
                     <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Score Kepuasan</p>
                     <p className="text-sm font-black text-slate-100">{tech.rating.toFixed(1)} / 5.0</p>
                  </div>
               </div>

               <div className="mt-auto">
                  <div className="w-full p-4 bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 rounded-2xl relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 blur-2xl rounded-full -mr-12 -mt-12" />
                     <p className="text-[9px] font-black text-orange-500 uppercase tracking-[0.25em] text-center mb-1">
                        Professional Tier
                     </p>
                     <h3 className="text-xs font-black text-white text-center uppercase tracking-widest group-hover:text-orange-400 transition-colors">
                        Master Technician
                     </h3>
                  </div>
               </div>
            </Card>
          </div>

          {/* Main Content Area (9/12) */}
          <div className="md:col-span-9 flex flex-col gap-4 h-full min-h-0">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full min-h-0">
                <div className="lg:col-span-9 h-full">
                  <ServiceCalendar events={calendarEvents} />
                </div>
                <div className="lg:col-span-3 h-full">
                  <ActiveTasksList orders={myAcceptedOrders} />
                </div>


             </div>
          </div>

        </div>
      </div>

      <FloatingChatWidget orders={myAcceptedOrders} currentUserId={user.id} />
    </div>
  );
}
