"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useState } from "react";
import { 
  User, Zap, ShieldCheck, Star, CheckCircle, Wallet, Settings, 
  Activity, History, ExternalLink, CreditCard, CheckCircle2, X 
} from "lucide-react";
import NotificationHub from "@/components/features/NotificationHub";
import NotificationToast from "@/components/features/NotificationToast";

import { useRouter } from "next/navigation";
import { formatRupiah, cn } from "@/lib/utils";

interface AdminDashboardViewProps {
  user: any;
  pendingMemberships: any[];
  pendingPayments: any[];
  verifiedPayments: any[];
  verifiedMemberships: any[];
}

export default function AdminDashboardView({ 
  user, 
  pendingMemberships, 
  pendingPayments, 
  verifiedPayments,
  verifiedMemberships 
}: AdminDashboardViewProps) {
  const router = useRouter();
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [approvingPaymentId, setApprovingPaymentId] = useState<string | null>(null);
  const [selectedProof, setSelectedProof] = useState<string | null>(null);

  // Combine and sort verified history
  const auditTrail = [
    ...verifiedPayments.map(p => ({ ...p, auditType: 'SERVICE' })),
    ...verifiedMemberships.map(m => ({ ...m, auditType: 'MEMBERSHIP' }))
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleApproveMembership = async (id: string) => {
    setApprovingId(id);
    try {
      const res = await fetch("/api/membership/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ membershipId: id }),
      });
      if (res.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setApprovingId(null);
    }
  };

  const handleApprovePayment = async (paymentId: string) => {
    setApprovingPaymentId(paymentId);
    try {
      const res = await fetch("/api/payments/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId }),
      });
      if (res.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setApprovingPaymentId(null);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-6 sm:px-8 lg:px-10 space-y-6 py-6 relative">
      <NotificationToast />
      
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-slate-100 tracking-tighter">Halo, {user.name?.split(' ')[0]}</h1>
        
        <div className="flex gap-4">
          <Card className="border-slate-800 bg-slate-900/40 backdrop-blur-md p-3 px-5 flex items-center gap-4">
            <div className="text-right">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Pending</p>
              <p className="text-2xl font-black text-slate-100">{pendingPayments.length + pendingMemberships.length}</p>
            </div>
            <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500 border border-orange-500/20">
               <Activity size={20} />
            </div>
          </Card>
        </div>
      </div>

      {/* --- PENDING ACTIONS GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Antrean Membership Card */}
        <Card className="border-slate-800 bg-slate-900/40 backdrop-blur-md overflow-hidden min-h-[450px] flex flex-col">
          <CardHeader className="p-6 border-b border-slate-800 bg-slate-800/10 flex flex-row items-center justify-between shrink-0">
            <CardTitle className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-3">
              <ShieldCheck size={18} className="text-orange-500" />
              Antrean Membership Baru
            </CardTitle>
            <span className="px-2 py-0.5 bg-orange-500/10 text-orange-500 text-[10px] font-black rounded-full border border-orange-500/20">
              {pendingMemberships.length} Baru
            </span>
          </CardHeader>
          <CardContent className="p-6 flex-grow flex flex-col justify-center">
            <div className="space-y-4">
              {pendingMemberships.length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-700">
                     <CheckCircle size={32} />
                  </div>
                  <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">Semua membership sudah terverifikasi.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingMemberships.map((m) => (
                    <div key={m.id} className="p-5 bg-slate-950/50 border border-slate-800 rounded-[24px] flex items-center justify-between group hover:border-orange-500/30 transition-all">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
                            <User size={20} />
                         </div>
                         <div>
                           <p className="text-sm font-black text-slate-100">{m.user?.name}</p>
                           <p className="text-[10px] text-orange-500 font-black uppercase tracking-tight">Smart Care • {m.appliance_name}</p>
                         </div>
                      </div>
                      <Button 
                        onClick={() => handleApproveMembership(m.id)}
                        disabled={approvingId === m.id}
                        className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-black text-[10px] uppercase shadow-lg shadow-orange-500/20"
                      >
                        {approvingId === m.id ? "..." : "Approve"}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Verifikasi Pembayaran Card */}
        <Card className="border-slate-800 bg-slate-900/40 backdrop-blur-md overflow-hidden min-h-[450px] flex flex-col">
          <CardHeader className="p-6 border-b border-slate-800 bg-slate-800/10 flex flex-row items-center justify-between shrink-0">
            <CardTitle className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-3">
               <Wallet size={18} className="text-emerald-500" />
               Verifikasi Pembayaran Servis
            </CardTitle>
            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-black rounded-full border border-emerald-500/20">
              {pendingPayments.length} Antrean
            </span>
          </CardHeader>
          <CardContent className="p-6 flex-grow flex flex-col justify-center">
            <div className="space-y-4">
              {pendingPayments.length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-700">
                     <Zap size={32} />
                  </div>
                  <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">Tidak ada pembayaran tertunda.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingPayments.map((p) => (
                    <div key={p.id} className="p-6 bg-slate-950/50 border border-slate-800 rounded-[28px] hover:border-emerald-500/30 transition-all">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                              <CreditCard size={20} />
                           </div>
                           <div>
                             <p className="text-sm font-black text-slate-100">{p.order?.user?.name}</p>
                             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Order #{p.order?.id.slice(0, 8)}</p>
                           </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Nominal Transfer</p>
                          <p className="text-2xl font-black text-emerald-500">{formatRupiah(p.amount)}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        {p.proof_url && (
                          <button 
                            onClick={() => setSelectedProof(p.proof_url)}
                            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-slate-800 text-slate-300 text-[10px] font-black uppercase rounded-xl border border-slate-700 hover:bg-slate-700 transition-all"
                          >
                             <ExternalLink size={14} /> Bukti
                          </button>
                        )}
                        <Button 
                          onClick={() => handleApprovePayment(p.id)}
                          disabled={approvingPaymentId === p.id}
                          className="flex-1 py-3.5 bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase shadow-lg shadow-emerald-500/20"
                        >
                          {approvingPaymentId === p.id ? "..." : "Konfirmasi Lunas"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* --- AUDIT TRAIL CARD --- */}
      <Card className="border-slate-800 bg-slate-900/40 backdrop-blur-md overflow-hidden shadow-2xl mt-12">
         <CardHeader className="p-8 border-b border-slate-800 bg-slate-800/10 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-black text-slate-100 uppercase tracking-tight flex items-center gap-3">
               <History size={20} className="text-slate-400" />
               Riwayat Verifikasi (Audit Trail)
            </CardTitle>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Record of all validated actions</p>
         </CardHeader>
         <CardContent className="p-0">
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="border-b border-slate-800 bg-slate-800/5">
                        <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Waktu</th>
                        <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Produk / Layanan</th>
                        <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Kategori</th>
                        <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Jenis Bayar</th>
                        <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Customer</th>
                        <th className="p-6 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                     {auditTrail.length === 0 ? (
                        <tr>
                           <td colSpan={6} className="p-12 text-center text-[10px] text-slate-600 font-black uppercase tracking-[0.2em] italic">
                              No transaction history recorded yet
                           </td>
                        </tr>
                     ) : (
                        auditTrail.map((item: any) => (
                           <tr key={item.id} className="hover:bg-slate-800/10 transition-colors group">
                              <td className="p-6">
                                 <p className="text-[11px] font-black text-slate-300">
                                    {new Date(item.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                                 </p>
                                 <p className="text-[9px] text-slate-600 font-bold uppercase">
                                    {new Date(item.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                 </p>
                              </td>
                              <td className="p-6">
                                 <p className="text-xs font-black text-white uppercase tracking-tight">
                                    {item.auditType === 'SERVICE' 
                                       ? (item.order?.appliance?.appliance_type?.name || 'General Service')
                                       : `Smart Care ${item.appliance_name}`
                                    }
                                 </p>
                                 <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest mt-0.5">#{item.id.slice(0, 8)}</p>
                              </td>
                              <td className="p-6">
                                 <span className={cn(
                                    "px-2.5 py-1 text-[8px] font-black rounded-lg border uppercase tracking-widest",
                                    item.auditType === 'SERVICE' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                                 )}>
                                    {item.auditType}
                                 </span>
                              </td>
                              <td className="p-6">
                                 <p className="text-[10px] font-black text-slate-300 uppercase">
                                    {item.method ? `${item.method} • ` : ''}{item.type?.replace('_', ' ') || 'Membership Fee'}
                                 </p>
                              </td>
                              <td className="p-6">
                                 <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-500">
                                       {item.user?.name?.[0] || item.order?.user?.name?.[0]}
                                    </div>
                                    <div>
                                       <p className="text-[11px] font-black text-slate-200 uppercase">{item.user?.name || item.order?.user?.name}</p>
                                       <p className="text-[9px] text-slate-600 font-bold truncate max-w-[120px]">{item.user?.email || item.order?.user?.email}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="p-6 text-right">
                                 <div className="flex items-center justify-end gap-2 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
                                    {item.proof_url ? (
                                       <button 
                                          onClick={() => setSelectedProof(item.proof_url)}
                                          className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
                                       >
                                          <CheckCircle2 size={14} /> Verified <ExternalLink size={10} />
                                       </button>
                                    ) : (
                                       <div className="flex items-center gap-2">
                                          <CheckCircle2 size={14} /> Verified
                                       </div>
                                    )}
                                 </div>
                                 {item.amount && <p className="text-[11px] font-black text-slate-400 mt-1">{formatRupiah(item.amount)}</p>}
                              </td>
                           </tr>
                        ))
                     )}
                  </tbody>
               </table>
            </div>
         </CardContent>
      </Card>

      {/* --- PROOF PREVIEW MODAL --- */}
      {selectedProof && (
         <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 isolate">
            <div 
               className="absolute inset-0 bg-slate-950/80 backdrop-blur-md cursor-pointer"
               onClick={() => setSelectedProof(null)}
            />
            <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
               <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">Bukti Pembayaran</h3>
                  <button 
                     onClick={() => setSelectedProof(null)}
                     className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-full flex items-center justify-center text-slate-400 transition-all"
                  >
                     <X size={18} />
                  </button>
               </div>
               <div className="p-8 flex items-center justify-center bg-slate-950">
                  <img 
                     src={selectedProof} 
                     alt="Proof of Payment" 
                     className="max-w-full max-h-[70vh] rounded-2xl shadow-2xl object-contain border border-slate-800"
                  />
               </div>
               <div className="p-6 border-t border-slate-800 bg-slate-900/50 text-center">
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Check nominal dan keaslian struk sebelum konfirmasi</p>
               </div>
            </div>
         </div>
      )}
    </div>
  );
}
