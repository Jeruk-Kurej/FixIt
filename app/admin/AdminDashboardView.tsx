"use client";

import { useState } from "react";
import { Check, X, Eye, ShieldCheck, Wallet, User as UserIcon, Clock } from "lucide-react";
import { formatRupiah, formatDate } from "@/lib/utils";
import Button from "@/components/ui/Button";

interface AdminDashboardViewProps {
  initialPayments: any[];
}

export default function AdminDashboardView({ initialPayments }: AdminDashboardViewProps) {
  const [payments, setPayments] = useState(initialPayments);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleVerify = async (paymentId: string, status: "VALID" | "INVALID") => {
    setLoadingId(paymentId);
    try {
      const res = await fetch(`/api/payments/${paymentId}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, adminNotes: "Verified by Admin" })
      });

      if (res.ok) {
        setPayments(payments.filter(p => p.id !== paymentId));
      }
    } catch (err) {
      alert("Gagal memverifikasi pembayaran.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <ShieldCheck className="text-orange-500" size={32} />
              ADMIN VERIFICATION
            </h1>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-[0.2em] mt-1">Payment Escrow Management</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl px-6 py-3 text-center">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Pending</p>
              <p className="text-xl font-black text-orange-500">{payments.length}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        {payments.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-[32px] p-20 text-center">
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-700">
               <Check size={40} />
            </div>
            <h2 className="text-xl font-black text-slate-500 uppercase tracking-widest">Semua Beres!</h2>
            <p className="text-slate-600 mt-2 text-sm">Tidak ada pembayaran pending saat ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {payments.map((payment) => (
              <div key={payment.id} className="bg-slate-900 border border-slate-800 rounded-[32px] overflow-hidden flex flex-col shadow-2xl hover:border-orange-500/30 transition-all group">
                
                {/* Top Info */}
                <div className="p-6 border-b border-slate-800/50 flex items-center justify-between bg-slate-800/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                      <Wallet size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">{payment.type.replace('_', ' ')}</p>
                      <p className="text-xl font-black text-white leading-none">{formatRupiah(payment.amount)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-slate-600 uppercase">Diterima Pada</p>
                    <p className="text-xs font-bold text-slate-400">{formatDate(payment.createdAt)}</p>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-6 grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <UserIcon size={16} className="text-slate-600" />
                      <div className="min-w-0">
                        <p className="text-[9px] font-black text-slate-600 uppercase leading-none mb-1">Customer</p>
                        <p className="text-sm font-bold text-slate-200 truncate">{payment.order.user?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock size={16} className="text-slate-600" />
                      <div className="min-w-0">
                        <p className="text-[9px] font-black text-slate-600 uppercase leading-none mb-1">Order ID</p>
                        <p className="text-sm font-bold text-slate-400 truncate">#{payment.order_id.slice(0, 8)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 flex flex-col items-center justify-center gap-2 group/proof cursor-pointer">
                     <Eye size={20} className="text-slate-600 group-hover/proof:text-orange-500 transition-colors" />
                     <p className="text-[9px] font-black text-slate-600 uppercase group-hover/proof:text-slate-400">Lihat Bukti</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-6 pt-0 mt-auto grid grid-cols-2 gap-3">
                   <button 
                     onClick={() => handleVerify(payment.id, "INVALID")}
                     disabled={loadingId === payment.id}
                     className="py-3 rounded-xl border border-red-500/20 bg-red-500/5 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/10 transition-all flex items-center justify-center gap-2"
                   >
                     <X size={14} /> Tolak
                   </button>
                   <button 
                     onClick={() => handleVerify(payment.id, "VALID")}
                     disabled={loadingId === payment.id}
                     className="py-3 rounded-xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                   >
                     <Check size={14} /> Verifikasi
                   </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
