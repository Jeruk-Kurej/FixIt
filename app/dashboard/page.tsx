import prisma from "@/lib/prisma";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { cookies } from "next/headers";
import ProfileEditor from "@/components/features/ProfileEditor";
import ServiceCalendar from "@/components/features/ServiceCalendar";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const userEmail = cookieStore.get("user_email")?.value || "budi@example.com";

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        include: {
          appliance: {
            include: {
              appliance_type: true
            }
          }
        },
      },
    },
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-50">
        <p className="text-slate-500">Data pengguna tidak ditemukan. Pastikan Anda sudah menjalankan seed data.</p>
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

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 py-10 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-50">Dashboard</h1>
            <p className="text-slate-400 mt-1">Selamat datang kembali, <span className="text-orange-400 font-bold">{user.name}</span></p>
          </div>
          <Button href="/booking" variant="primary" className="shadow-[0_10px_20px_rgba(249,115,22,0.3)] px-8 py-6 text-lg">
            Pesan Servis Baru
          </Button>
        </div>

        {/* Top Section: Profile & Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Column Profile */}
          <div className="lg:col-span-4 flex flex-col">
            <Card className="border-slate-800/80 bg-slate-800/40 backdrop-blur-md h-full shadow-xl">
              <CardHeader className="border-b border-slate-800/60 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="p-1.5 bg-orange-500/10 rounded-lg text-orange-400">👤</span>
                  Profil Saya
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1">Email Terdaftar</p>
                  <p className="text-lg font-bold text-slate-100">{user.email}</p>
                </div>
                
                <hr className="border-slate-800/60" />

                <div>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mb-4">Informasi Tambahan</p>
                  <ProfileEditor 
                    initialPhone={user.phone || ""} 
                    initialAddress={user.address || ""}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Column Calendar */}
          <div className="lg:col-span-8 flex flex-col">
            <ServiceCalendar events={calendarEvents} />
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
                <p className="text-xs text-slate-500 mt-1">Daftar semua servis yang pernah Anda ajukan.</p>
              </div>
              {user.orders.length > 0 && (
                <Button href="/booking" variant="ghost" size="sm" className="text-orange-500 hover:text-orange-400 font-bold uppercase tracking-widest text-[10px]">
                  Pesan Lagi
                </Button>
              )}
            </CardHeader>

            <CardContent className="p-0">
              {user.orders.length > 0 ? (
                <div className="divide-y divide-slate-800/60">
                  {user.orders.map((order) => (
                    <div key={order.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-slate-800/20 transition-all group">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-2xl ${
                          order.status === 'DONE' ? 'bg-green-500/10 text-green-400' :
                          order.status === 'PENDING' ? 'bg-orange-500/10 text-orange-400' :
                          'bg-blue-500/10 text-blue-400'
                        }`}>
                          <span className="text-xl">🛠️</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-bold text-slate-100 text-lg group-hover:text-orange-400 transition-colors">{order.appliance?.appliance_type?.name || "Elektronik"}</h4>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                              order.status === 'DONE' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                              order.status === 'PENDING' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                              'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <p className="text-sm text-slate-400 max-w-md">{order.problem}</p>
                          <div className="flex items-center gap-4 mt-3">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                              📅 {formatDate(order.createdAt)}
                            </p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                              🏷️ {order.appliance?.brand || "Brand N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-left sm:text-right bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
                        <p className="text-[10px] text-slate-500 mb-1 uppercase font-black tracking-widest">Estimasi Biaya</p>
                        <p className="text-xl font-black text-orange-500">
                          {order.estimated_cost ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(order.estimated_cost) : "-"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-20 text-center">
                  <div className="w-20 h-20 bg-slate-800/40 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700/50">
                    <span className="text-3xl">📭</span>
                  </div>
                  <p className="text-slate-400 font-medium">Belum ada riwayat pesanan.</p>
                  <Button href="/booking" variant="primary" className="mt-6">Pesan Servis Sekarang</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
