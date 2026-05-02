import { PrismaClient } from "@prisma/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

const prisma = new PrismaClient();

// Fungsi bantuan untuk format tanggal
function formatDate(date: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

// Fungsi menghitung jadwal servis berikutnya (Smart Scheduling: per 3 bulan)
function calculateNextService(lastServiceDate: Date | null, membershipStartDate: Date) {
  const baseDate = lastServiceDate ? new Date(lastServiceDate) : new Date(membershipStartDate);
  // Tambah 3 bulan
  baseDate.setMonth(baseDate.getMonth() + 3);
  return baseDate;
}

export default async function DashboardPage() {
  // Karena belum ada sistem autentikasi (Login), 
  // kita gunakan akun Budi dari seed.ts sebagai contoh (Hardcoded Session).
  const user = await prisma.user.findUnique({
    where: { email: "budi@example.com" },
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
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
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-950">Dashboard Anda</h1>
          <p className="text-slate-600 mt-1">Selamat datang kembali, {user.name}!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kolom Kiri: Profil & Membership */}
          <div className="space-y-6 lg:col-span-1">
            <Card className="border-slate-200">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                <CardTitle className="text-lg">Profil Saya</CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-3">
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Email</p>
                  <p className="font-medium text-slate-800">{user.email}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Nomor HP</p>
                  <p className="font-medium text-slate-800">{user.phone || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Alamat Utama</p>
                  <p className="font-medium text-slate-800">{user.address || "-"}</p>
                </div>
              </CardContent>
            </Card>

            <Card className={`border-2 ${activeMembership ? 'border-orange-400 bg-orange-50/30' : 'border-slate-200'}`}>
              <CardHeader className={`${activeMembership ? 'bg-orange-50/50' : 'bg-slate-50/50'} border-b ${activeMembership ? 'border-orange-100' : 'border-slate-100'} pb-4`}>
                <CardTitle className={`text-lg ${activeMembership ? 'text-orange-900' : 'text-slate-700'}`}>
                  Status Membership
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                {activeMembership ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="font-bold text-green-700">AKTIF</span>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-semibold">Berlaku Sampai</p>
                      <p className="font-medium text-slate-800">{formatDate(activeMembership.endDate)}</p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-2 border-orange-500 text-orange-600 hover:bg-orange-100">
                      Perpanjang Langganan
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 text-center">
                    <p className="text-sm text-slate-600">Anda belum memiliki paket langganan aktif.</p>
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
              <Card className="border-blue-200 bg-blue-50/50 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <CardContent className="p-6 sm:p-8 relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                      </span>
                      Smart Scheduling
                    </div>
                    <h3 className="text-xl font-bold text-blue-950">Jadwal Servis Rutin Berikutnya</h3>
                    <p className="text-slate-600">Berdasarkan siklus perawatan 3 bulan sekali.</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100 text-center min-w-[160px]">
                    <p className="text-sm text-slate-500 font-medium mb-1">Estimasi Tanggal</p>
                    <p className="text-lg font-bold text-orange-500">{formatDate(nextServiceDate)}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Riwayat Pesanan */}
            <Card className="border-slate-200">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4 flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Riwayat Pesanan</CardTitle>
                <Button variant="ghost" size="sm" className="text-blue-600">Lihat Semua</Button>
              </CardHeader>
              <CardContent className="p-0">
                {user.orders.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {user.orders.map((order) => (
                      <div key={order.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-semibold text-slate-800">{order.appliance.type} {order.appliance.brand && `(${order.appliance.brand})`}</h4>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              order.status === 'DONE' ? 'bg-green-100 text-green-700' :
                              order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500">{order.problem}</p>
                          <p className="text-xs text-slate-400 mt-2">{formatDate(order.createdAt)} • {order.serviceType.replace('_', ' ')}</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-xs text-slate-500 mb-1">Estimasi Harga</p>
                          <p className="font-bold text-slate-800">
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
