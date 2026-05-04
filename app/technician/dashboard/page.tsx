import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { formatRupiah, formatDate } from "@/lib/utils";
import AcceptButton from "./AcceptButton";

const prisma = new PrismaClient();

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

  // Get tech's technician ID
  let tech = user.technician;
  if (!tech) {
    tech = await prisma.technician.create({
      data: {
        userId: user.id,
        trustScore: 4.8,
        isAvailable: true,
      }
    });
  }

  // 1. Pending Orders that any technician can pick up
  const incomingOrders = await prisma.order.findMany({
    where: { status: "PENDING" },
    include: {
      user: true,
      appliance: {
        include: {
          applianceType: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // 2. Orders accepted by THIS technician
  const myAcceptedOrders = await prisma.order.findMany({
    where: { technicianId: tech.id },
    include: {
      user: true,
      appliance: {
        include: {
          applianceType: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 py-10 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl relative z-10">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 border border-orange-500/20 px-3 py-1 text-xs font-semibold text-orange-400 mb-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              Mode Teknisi
            </div>
            <h1 className="text-3xl font-bold text-slate-50">Dashboard Teknisi</h1>
            <p className="text-slate-400 mt-1">Selamat datang kembali, <span className="text-orange-400 font-semibold">{user.name}</span></p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Kolom Kiri: Pesanan Masuk (PENDING) */}
          <div className="space-y-6">
            <Card className="border-slate-800/80 bg-slate-800/40 backdrop-blur-md">
              <CardHeader className="border-b border-slate-800 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span>📥</span> Pesanan Masuk (Pending)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {incomingOrders.length > 0 ? (
                  <div className="divide-y divide-slate-800/60">
                    {incomingOrders.map((order) => (
                      <div key={order.id} className="p-5 flex flex-col justify-between gap-4 hover:bg-slate-800/20 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <h4 className="font-semibold text-slate-200">{order.appliance?.applianceType?.name || "Barang Elektronik"} ({order.appliance?.brand || "General"})</h4>
                            <p className="text-xs text-slate-500 mt-0.5">Pemesan: {order.user?.name || "N/A"}</p>
                          </div>
                          <p className="text-lg font-bold text-orange-400">{formatRupiah(order.estimatedCost)}</p>
                        </div>
                        <p className="text-sm text-slate-400">{order.problemDescription}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
                          <p className="text-xs text-slate-500">{formatDate(order.createdAt)}</p>
                          <AcceptButton orderId={order.id} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-10 text-center text-slate-500 animate-in fade-in">
                    <p>Belum ada pesanan masuk saat ini.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Kolom Kanan: Pesanan Diterima oleh Saya */}
          <div className="space-y-6">
            <Card className="border-slate-800/80 bg-slate-800/40 backdrop-blur-md">
              <CardHeader className="border-b border-slate-800 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span>🛠️</span> Pesanan Saya (Accepted)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {myAcceptedOrders.length > 0 ? (
                  <div className="divide-y divide-slate-800/60">
                    {myAcceptedOrders.map((order) => (
                      <div key={order.id} className="p-5 hover:bg-slate-800/20 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-slate-200">{order.appliance?.applianceType?.name || "Barang Elektronik"}</h4>
                              <span className="px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-medium">
                                {order.status}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">Pemesan: {order.user?.name || "N/A"}</p>
                          </div>
                          <p className="text-lg font-bold text-orange-400">{formatRupiah(order.estimatedCost)}</p>
                        </div>
                        <p className="text-sm text-slate-400 mt-2">{order.problemDescription}</p>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800">
                          <p className="text-xs text-slate-500">{formatDate(order.createdAt)}</p>
                          <span className="text-xs text-green-400 font-medium">Pesanan Anda Tangani</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-10 text-center text-slate-500 animate-in fade-in">
                    <p>Anda belum memiliki pesanan yang ditangani.</p>
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
