import { PrismaClient } from "@prisma/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { formatDate, calculateNextService } from "@/lib/utils";
import { cookies } from "next/headers";
import ProfileEditor from "@/components/features/ProfileEditor";

const prisma = new PrismaClient();

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const userEmail = cookieStore.get("user_email")?.value || "budi@example.com";

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    include: {
      memberships: {
        orderBy: { endDate: "desc" },
        take: 1, // Ambil membership terbaru
      },
      orders: {
        orderBy: { createdAt: "desc" },
        include: { appliance: true }, // Sertakan detail barang
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

  const activeMembership = user.memberships.find((m) => m.status === "ACTIVE" && new Date(m.endDate) > new Date());
  
  // Mencari pesanan terakhir untuk menentukan jadwal servis rutin berikutnya
  const lastOrder = user.orders.length > 0 ? user.orders[0] : null;
  
  let nextServiceDate: Date | null = null;
  if (activeMembership) {
    nextServiceDate = calculateNextService(lastOrder?.createdAt || null, activeMembership.startDate);
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 py-10 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-50">Dashboard Anda</h1>
            <p className="text-slate-400 mt-1">Selamat datang kembali, <span className="text-orange-400 font-semibold">{user.name}</span></p>
          </div>
          <Button href="/book" variant="primary" className="shadow-[0_0_15px_rgba(249,115,22,0.3)]">
            Pesan Servis Baru
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kolom Kiri: Profil & Membership */}
          <div className="space-y-6 lg:col-span-1">
            <Card className="border-slate-800/80 bg-slate-800/40 backdrop-blur-md">
              <CardHeader className="border-b border-slate-800/60 pb-4">
                <CardTitle className="text-lg">Profil Saya</CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Email</p>
                  <p className="font-medium text-slate-300">{user.email}</p>
                </div>
                
                <hr className="border-slate-800/60" />

                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">Lengkapi Data</p>
                  <ProfileEditor 
                    initialPhone={user.phone || ""} 
                    initialAddress={user.address || ""}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className={`border-2 ${activeMembership ? 'border-orange-500 bg-orange-500/5 backdrop-blur-md' : 'border-slate-800 bg-slate-800/40 backdrop-blur-md'}`}>
              <CardHeader className={`border-b ${activeMembership ? 'border-orange-500/20' : 'border-slate-800'} pb-4`}>
                <CardTitle className={`text-lg ${activeMembership ? 'text-orange-400' : 'text-slate-300'}`}>
                  Status Membership
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                {activeMembership ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="font-bold text-green-400">AKTIF</span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-semibold">Berlaku Sampai</p>
                      <p className="font-medium text-slate-300">{formatDate(activeMembership.endDate)}</p>
                    </div>
                    <Button href="/membership" variant="outline" size="sm" className="w-full mt-2 border-orange-500 text-orange-400 hover:bg-orange-500/10">
                      Perpanjang Langganan
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 text-center">
                    <p className="text-sm text-slate-400">Anda belum memiliki paket langganan aktif.</p>
                    <Button href="/membership" variant="primary" size="sm" className="w-full">
                      Daftar Membership
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Kolom Kanan: Smart Scheduling & Riwayat */}
          <div className="space-y-6 lg:col-span-2">
            
            {/* Smart Scheduling Panel */}
            {activeMembership && nextServiceDate && (
              <Card className="border-orange-500/30 bg-slate-800/40 backdrop-blur-md relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <CardContent className="p-6 sm:p-8 relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 border border-orange-500/20 px-3 py-1 text-xs font-semibold text-orange-400">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                      </span>
                      Smart Scheduling
                    </div>
                    <h3 className="text-xl font-bold text-slate-50">Jadwal Servis Rutin Berikutnya</h3>
                    <p className="text-slate-400 text-sm">Berdasarkan siklus perawatan 3 bulan sekali.</p>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm text-center min-w-[160px]">
                    <p className="text-sm text-slate-500 font-medium mb-1">Estimasi Tanggal</p>
                    <p className="text-lg font-bold text-orange-500">{formatDate(nextServiceDate)}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Riwayat Pesanan */}
            <Card className="border-slate-800/80 bg-slate-800/40 backdrop-blur-md">
              <CardHeader className="border-b border-slate-800 pb-4 flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Riwayat Pesanan</CardTitle>
                <Button href="/book" variant="ghost" size="sm" className="text-orange-500 hover:text-orange-400">Pesan Lagi</Button>
              </CardHeader>
              <CardContent className="p-0">
                {user.orders.length > 0 ? (
                  <div className="divide-y divide-slate-800/60">
                    {user.orders.map((order) => (
                      <div key={order.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/20 transition-colors">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-semibold text-slate-200">{order.appliance?.type || "Barang Elektronik"}</h4>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              order.status === 'DONE' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                              order.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                              'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <p className="text-sm text-slate-400">{order.problem}</p>
                          <p className="text-xs text-slate-500 mt-2">{formatDate(order.createdAt)} • {order.serviceType.replace('_', ' ')}</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-xs text-slate-500 mb-1">Estimasi Harga</p>
                          <p className="font-bold text-slate-200">
                            {order.estimatedCost ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(order.estimatedCost) : "-"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-10 text-center text-slate-500">
                    <p>Belum ada riwayat pesanan.</p>
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
