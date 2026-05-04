import prisma from "@/lib/prisma";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { cookies } from "next/headers";
import ProfileEditor from "@/components/features/ProfileEditor";
import ServiceCalendar from "@/components/features/ServiceCalendar";
import ChatHub from "@/components/features/ChatHub";

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

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1600px] relative z-10">
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-50">Dashboard</h1>
            <p className="text-slate-400 mt-1">Selamat datang kembali, <span className="text-orange-400 font-bold">{user.name}</span></p>
          </div>
          <Button href="/booking" variant="primary" className="shadow-[0_10px_20px_rgba(249,115,22,0.3)] px-8 py-4 text-lg">
            Pesan Servis Baru
          </Button>
        </div>

        {/* 3-Column Main Layout */}
        <div className="flex flex-col md:flex-row gap-6 items-stretch h-auto md:h-[750px]">
          
          {/* Col 1: Profile (Narrow) */}
          <div className="md:w-[22%] flex flex-col">
            <Card className="border-slate-800/80 bg-slate-800/40 backdrop-blur-md h-full shadow-xl">
              <CardHeader className="border-b border-slate-800/60 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="p-1.5 bg-orange-500/10 rounded-lg text-orange-400">👤</span>
                  Profil
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-6 overflow-y-auto custom-scrollbar">
                <div>
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1">Email</p>
                  <p className="text-sm font-bold text-slate-100 truncate">{user.email}</p>
                </div>
                <hr className="border-slate-800/60" />
                <div>
                  <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] mb-4">Informasi Kontak</p>
                  <ProfileEditor 
                    initialPhone={user.phone || ""} 
                    initialAddress={user.address || ""}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Col 2: Calendar (Medium) */}
          <div className="md:w-[39%] flex flex-col min-h-[500px] md:min-h-0">
            <ServiceCalendar events={calendarEvents} />
          </div>

          {/* Col 3: Chat Integrated (Medium) */}
          <div className="md:w-[39%] flex flex-col min-h-[500px] md:min-h-0">
            <Card className="border-slate-800/80 bg-slate-800/40 backdrop-blur-md h-full shadow-xl overflow-hidden flex flex-col">
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

        {/* Bottom Section: Order History */}
        <div className="mt-12">
          <Card className="border-slate-800/80 bg-slate-800/40 backdrop-blur-md shadow-xl overflow-hidden">
            <CardHeader className="border-b border-slate-800 p-6 flex flex-row items-center justify-between bg-slate-800/20">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <span className="p-1.5 bg-orange-500/10 rounded-lg text-orange-400">📜</span>
                  Riwayat Pesanan
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0 max-h-[400px] overflow-y-auto custom-scrollbar">
              {user.orders.length > 0 ? (
                <div className="divide-y divide-slate-800/60">
                  {user.orders.map((order) => (
                    <div key={order.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-slate-800/20 transition-all">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-slate-900 rounded-2xl text-xl">🛠️</div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-bold text-slate-100">{order.appliance?.appliance_type?.name || "Elektronik"}</h4>
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-slate-700 bg-slate-900">
                              {order.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">{formatDate(order.createdAt)} • {order.appliance?.brand}</p>
                        </div>
                      </div>
                      <p className="text-lg font-black text-orange-500">
                        {order.estimated_cost ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(order.estimated_cost) : "-"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-10 text-center text-slate-500">Belum ada riwayat pesanan.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
