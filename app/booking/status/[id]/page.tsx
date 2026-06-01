"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { formatRupiah, formatDate } from "@/lib/utils";

interface OrderStatusProps {
  params: Promise<{ id: string }>;
}

export default function OrderStatusPage({ params }: OrderStatusProps) {
  const router = useRouter();
  const { id } = use(params);

  const [order, setOrder] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${id}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal mengambil data pesanan.");
      }

      setOrder(data.order);
      
      // LOGIC: If DP is not paid, searching doesn't even start. 
      // Redirect to dashboard where they can see the "Menunggu Aksi" tab.
      if (data.order?.payment_status === 'UNPAID') {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();

    // Polling interval to check if a technician accepts the order every 3 seconds
    const intervalId = setInterval(() => {
      fetchOrder();
    }, 3000);

    return () => clearInterval(intervalId);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col items-center justify-center p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4" />
        <p className="text-slate-400">Memuat status pesanan...</p>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-red-400 mb-2">Terjadi Kesalahan</h2>
        <p className="text-slate-400 max-w-md">{errorMsg}</p>
        <Button href="/dashboard" variant="primary" className="mt-6">Kembali ke Dashboard</Button>
      </div>
    );
  }

  const isPending = order?.status === "PENDING";
  const isAccepted = order?.status === "ACCEPTED" || order?.status === "WORKING" || order?.status === "DONE";

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 py-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-50">Status Pesanan Anda</h1>
          <p className="text-slate-400 mt-2">Dapatkan pembaruan real-time terkait pesanan servis Anda.</p>
        </div>

        {/* Dynamic Finding & Loaded State Card */}
        <Card className={`border-slate-800/80 bg-slate-800/40 backdrop-blur-md overflow-hidden relative ${isAccepted ? "border-green-500/30" : "border-orange-500/30"}`}>
          <div className="p-6 sm:p-8 space-y-6">
            
            {isPending && (
              <div className="flex flex-col items-center justify-center text-center space-y-4 py-8 animate-in fade-in zoom-in-95 duration-500">
                <div className="relative">
                  {/* Ping Animation */}
                  <span className="flex h-16 w-16 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-16 w-16 bg-orange-500 items-center justify-center text-white text-2xl font-bold">
                      🛠️
                    </span>
                  </span>
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-orange-400">Mencari Teknisi Terdekat...</h2>
                  <p className="text-slate-400 text-sm max-w-sm">Mohon tunggu sebentar, kami sedang mencarikan teknisi terbaik untuk Anda.</p>
                </div>
              </div>
            )}

            {isAccepted && (
              <div className="flex flex-col items-center justify-center text-center space-y-4 py-8 animate-in fade-in zoom-in-95 duration-500">
                <div className="h-16 w-16 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center text-3xl">
                  👨‍🔧
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-green-400">Teknisi Ditemukan!</h2>
                  <p className="text-slate-400 text-sm max-w-sm">Pesanan Anda telah diterima. Teknisi akan segera menangani barang Anda.</p>
                </div>

                {order.technician?.user && (
                  <div className="w-full bg-slate-900/50 border border-slate-700/60 rounded-2xl p-5 text-left mt-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Nama Teknisi</p>
                        <p className="text-lg font-bold text-slate-200">{order.technician.user.name}</p>
                      </div>
                      <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl px-3 py-1.5 text-center">
                        <p className="text-xs text-slate-500 font-medium">Reputasi</p>
                        <p className="text-sm font-bold text-orange-400">⭐ {order.technician.rating || "5.0"}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <hr className="border-slate-800" />

            {/* Order Detail Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-300">Rincian Pesanan</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-900/40 border border-slate-800/60 rounded-xl p-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Kategori Barang</p>
                  <p className="font-medium text-slate-300">{order.appliance?.appliance_type?.name || "Barang Elektronik"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Merek / Brand</p>
                  <p className="font-medium text-slate-300">{order.appliance?.brand || "General"}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Keluhan</p>
                  <p className="font-medium text-slate-300">{order.problem || "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Estimasi Biaya</p>
                  <p className="font-bold text-orange-400">{order.estimated_cost ? formatRupiah(order.estimated_cost) : "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Waktu Kunjungan</p>
                  <p className="font-medium text-slate-300">{order.scheduled_date_time ? formatDate(order.scheduled_date_time) : "-"}</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button href="/dashboard" variant="outline" className="w-full">
                Kembali ke Dashboard
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
