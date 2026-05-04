import { PrismaClient } from "@prisma/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { cookies } from "next/headers";
import ProfileEditor from "@/components/features/ProfileEditor";

const prisma = new PrismaClient();

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
           <Button href="/booking" variant="primary" className="shadow-[0_0_15px_rgba(249,115,22,0.3)]">
            Pesan Servis Baru
          </Button>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kolom Kiri: Profil */}
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
          </div>

          {/* Kolom Kanan: Riwayat Pesanan */}
          <div className="space-y-6 lg:col-span-2">
            {/* Riwayat Pesanan */}
            <Card className="border-slate-800/80 bg-slate-800/40 backdrop-blur-md">
              <CardHeader className="border-b border-slate-800 pb-4 flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Riwayat Pesanan</CardTitle>
                {user.orders.length > 0 && (
                  <Button href="/booking" variant="ghost" size="sm" className="text-orange-500 hover:text-orange-400">Pesan Lagi</Button>
                )}

              </CardHeader>

              <CardContent className="p-0">
                {user.orders.length > 0 ? (
                  <div className="divide-y divide-slate-800/60">
                    {user.orders.map((order) => (
                      <div key={order.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/20 transition-colors">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-semibold text-slate-200">{order.appliance?.appliance_type?.name || "Barang Elektronik"}</h4>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              order.status === 'DONE' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                              order.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                              'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <p className="text-sm text-slate-400">{order.problem}</p>
                          <p className="text-xs text-slate-500 mt-2">{formatDate(order.createdAt)} • {order.appliance?.brand || "Brand N/A"}</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-xs text-slate-500 mb-1">Estimasi Harga</p>
                          <p className="font-bold text-slate-200">
                            {order.estimated_cost ? new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(order.estimated_cost) : "-"}
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
