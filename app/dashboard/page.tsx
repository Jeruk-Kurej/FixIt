import prisma from "@/lib/prisma";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { cookies } from "next/headers";
import ProfileEditor from "@/components/features/ProfileEditor";
import ServiceCalendar from "@/components/features/ServiceCalendar";
import ChatHub from "@/components/features/ChatHub";
import OrderHistoryList from "./OrderHistoryList";


export default async function DashboardPage() {
  const cookieStore = await cookies();
  const userEmail = cookieStore.get("user_email")?.value || "budi@example.com";

  if (!userEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-50">
        <p className="text-slate-500">Silakan login kembali.</p>
      </div>
    );
  }

  const user = await prisma.user.findFirst({
    where: { email: String(userEmail) },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        include: {
          technician: { include: { user: true } },
          appliance: { include: { appliance_type: true } },
          messages: { take: 1, orderBy: { createdAt: 'desc' } }
        }
      },
      technician: true
    }
  });


  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-50">
        <p className="text-slate-500">Data pengguna tidak ditemukan.</p>
      </div>
    );
  }

  const calendarEvents = user.orders
    .filter(o => o.scheduled_date_time)
    .map(o => ({
      id: o.id,
      date: new Date(o.scheduled_date_time!),
      applianceName: o.appliance?.appliance_type?.name || "Elektronik",
      type: o.service_type as any,
      status: o.status,
      problem: o.problem
    }));

  // Filter orders for chat (only those accepted or ongoing)
  const chatOrders = user.orders.filter(o => ['ACCEPTED', 'WORKING', 'DONE'].includes(o.status));

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 py-10 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="mx-auto px-4 sm:px-8 max-w-full relative z-10">
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-50">Dashboard</h1>
            <p className="text-slate-400 mt-1">Selamat datang kembali, <span className="text-orange-400 font-bold">{user.name}</span></p>
          </div>
          <Button href="/booking" variant="primary" className="shadow-[0_10px_20px_rgba(249,115,22,0.3)] px-8 py-4 text-lg">
            Pesan Servis Baru
          </Button>
        </div>

        {/* 3-Column Workspace Layout - Locked Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Col 1: Profile (2/12) */}
          <div className="md:col-span-2 flex flex-col self-stretch">
            <Card className="border-slate-800 bg-slate-800/40 backdrop-blur-md shadow-2xl overflow-hidden min-h-[750px]">
              <CardHeader className="border-b border-slate-800 p-6 bg-slate-800/20">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <span className="p-1 bg-blue-500/10 rounded-lg text-blue-400">👤</span>
                  Profil
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 overflow-y-auto custom-scrollbar flex-grow">
                 <div>
                   <p className="text-[8px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1">Email</p>
                   <p className="text-[11px] font-bold text-slate-100 truncate mb-6">{user.email}</p>
                   <hr className="border-slate-800 mb-6" />
                   <ProfileEditor 
                     initialPhone={user.phone || ""} 
                     initialAddress={user.address || ""}
                   />
                 </div>
              </CardContent>
            </Card>
          </div>

          {/* Col 2: Calendar & History (5/12) */}
          <div className="md:col-span-5 flex flex-col gap-8 self-stretch">
            <div className="flex-grow min-h-[450px]">
               <ServiceCalendar events={calendarEvents} />
            </div>
            
            <div className="h-[350px] shrink-0">
              <OrderHistoryList orders={user.orders} />
            </div>
          </div>

          {/* Col 3: Integrated Chat Hub (5/12) */}
          <div className="md:col-span-5 flex flex-col self-stretch">
            <Card className="border-slate-800/80 bg-slate-800/40 backdrop-blur-md min-h-[750px] shadow-xl overflow-hidden flex flex-col">
              <CardHeader className="border-b border-slate-800 p-5 bg-slate-800/20">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="p-1.5 bg-orange-500/10 rounded-lg text-orange-400">💬</span>
                  Obrolan Servis
                </CardTitle>
              </CardHeader>
              <div className="flex-grow overflow-hidden">
                <ChatHub 
                  initialOrders={JSON.parse(JSON.stringify(chatOrders))} 
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
