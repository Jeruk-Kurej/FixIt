"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { useState } from "react";
import { User, Zap, ShieldCheck, Star, CheckCircle, Wallet, Settings, Activity, History } from "lucide-react";

import { useRouter } from "next/navigation";

interface AdminDashboardViewProps {
  user: any;
  pendingMemberships: any[];
  pendingPayments: any[];
  verifiedMemberships?: any[];
  verifiedPayments?: any[];
}

export default function AdminDashboardView({ 
  user, 
  pendingMemberships, 
  pendingPayments,
  verifiedMemberships = [],
  verifiedPayments = []
}: AdminDashboardViewProps) {

  const router = useRouter();
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [approvingPaymentId, setApprovingPaymentId] = useState<string | null>(null);

  const handleApproveMembership = async (id: string) => {
    setApprovingId(id);
    try {
      const res = await fetch("/api/membership/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ membershipId: id }),
      });
      if (res.ok) {
        alert("Membership Berhasil Disahkan!");
        router.refresh();
      }
    } catch (err) {
      alert("Gagal mengaktifkan.");
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
        alert("Pembayaran Berhasil Diverifikasi!");
        router.refresh();
      }
    } catch (err) {
      alert("Gagal verifikasi.");
    } finally {
      setApprovingPaymentId(null);
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col overflow-hidden bg-slate-950">
      <div className="w-full px-8 flex flex-col h-full py-8">
        
        {/* Admin Header */}
        <div className="mb-8 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-orange-500 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-orange-500/40">
              <Settings size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-4">
                Pusat Kendali Admin
                <span className="px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-lg text-[10px] font-black text-orange-500 uppercase tracking-[0.2em]">
                  System Active
                </span>
              </h1>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-1">
                Selamat Datang, <span className="text-slate-300">{user.name}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="px-6 py-3 bg-slate-900/50 border border-slate-800 rounded-2xl flex items-center gap-4">
                <div className="text-right">
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Total Pending</p>
                   <p className="text-xl font-black text-white">{pendingMemberships.length + pendingPayments.length}</p>
                </div>
                <Activity className="text-orange-500" size={24} />
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow min-h-0">
          
          {/* Left: Pending Memberships */}
          <Card className="border-slate-800 bg-slate-900/40 backdrop-blur-md flex flex-col min-h-0 overflow-hidden">
            <CardHeader className="p-6 border-b border-slate-800 bg-slate-800/20 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-3">
                <ShieldCheck size={18} className="text-orange-500" />
                Antrean Membership Baru
              </CardTitle>
              <span className="px-2 py-0.5 bg-orange-500 text-[10px] font-black rounded-full text-white">
                {pendingMemberships.length}
              </span>
            </CardHeader>
            <CardContent className="p-6 overflow-y-auto custom-scrollbar flex-grow">
               {pendingMemberships.length > 0 ? (
                 <div className="space-y-4">
                    {pendingMemberships.map((m: any) => (
                      <div key={m.id} className="p-6 bg-slate-950/50 border border-slate-800 rounded-[24px] flex items-center justify-between group hover:border-orange-500/40 transition-all">
                         <div className="flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                               <User size={24} />
                            </div>
                            <div>
                               <h4 className="text-base font-black text-white uppercase tracking-tight">{m.user?.name}</h4>
                               <p className="text-xs text-orange-500 font-bold uppercase tracking-widest">Plan: Smart Care {m.appliance_name}</p>
                               <p className="text-[10px] text-slate-500 mt-1">{m.user?.email}</p>
                            </div>
                         </div>
                         <Button 
                           disabled={approvingId === m.id}
                           onClick={() => handleApproveMembership(m.id)}
                           variant="primary" 
                           className="px-6 py-2 shadow-lg shadow-orange-500/20"
                         >
                            {approvingId === m.id ? "..." : "Sahkan Member"}
                         </Button>
                      </div>
                    ))}
                 </div>
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-4 opacity-30">
                    <CheckCircle size={60} />
                    <p className="text-sm font-black uppercase tracking-widest">Semua Membership Terverifikasi</p>
                 </div>
               )}
            </CardContent>
          </Card>

          {/* Right: Pending Payments */}
          <Card className="border-slate-800 bg-slate-900/40 backdrop-blur-md flex flex-col min-h-0 overflow-hidden">
            <CardHeader className="p-6 border-b border-slate-800 bg-slate-800/20 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-3">
                <Wallet size={18} className="text-emerald-500" />
                Verifikasi Pembayaran Servis
              </CardTitle>
              <span className="px-2 py-0.5 bg-emerald-500 text-[10px] font-black rounded-full text-white">
                {pendingPayments.length}
              </span>
            </CardHeader>
            <CardContent className="p-6 overflow-y-auto custom-scrollbar flex-grow">
               {pendingPayments.length > 0 ? (
                 <div className="space-y-4">
                    {pendingPayments.map((p: any) => (
                      <div key={p.id} className="p-6 bg-slate-950/50 border border-slate-800 rounded-[24px] flex flex-col gap-4 group hover:border-emerald-500/40 transition-all">
                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                  <CheckCircle size={20} />
                               </div>
                               <div>
                                  <h4 className="text-sm font-black text-white uppercase tracking-tight">{p.order?.user?.name}</h4>
                                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Order #{p.order_id.slice(0,8)}</p>
                               </div>
                            </div>
                            <div className="text-right">
                               <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Nominal Transfer</p>
                               <p className="text-lg font-black text-emerald-500">Rp {p.amount.toLocaleString('id-ID')}</p>
                            </div>
                         </div>

                         <div className="h-px bg-slate-800 w-full" />

                         <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                               <span className="px-2 py-1 bg-slate-800 rounded text-[8px] font-black text-slate-400 uppercase tracking-widest">
                                  Type: {p.type}
                               </span>
                               <a 
                                 href={p.proof_url} 
                                 target="_blank" 
                                 className="text-[9px] font-black text-blue-500 hover:underline uppercase tracking-widest flex items-center gap-1"
                               >
                                  Lihat Bukti <Activity size={10} />
                               </a>
                            </div>
                            <Button 
                              disabled={approvingPaymentId === p.id}
                              onClick={() => handleApprovePayment(p.id)}
                              variant="primary" 
                              className="bg-emerald-500 hover:bg-emerald-600 px-6 py-2 shadow-lg shadow-emerald-500/20 border-none"
                            >
                               {approvingPaymentId === p.id ? "..." : "Sahkan Pembayaran"}
                            </Button>
                         </div>
                      </div>
                    ))}
                 </div>
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-4 opacity-30">
                    <CheckCircle size={60} />
                    <p className="text-sm font-black uppercase tracking-widest">Semua Pembayaran Beres</p>
                 </div>
               )}
            </CardContent>
          </Card>

        </div>

        {/* Audit History Section */}
        <div className="mt-8 pb-8">
           <Card className="border-slate-800 bg-slate-900/40 backdrop-blur-md overflow-hidden">
              <CardHeader className="p-6 border-b border-slate-800 bg-slate-800/20 flex flex-row items-center justify-between">
                 <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-3">
                    <History size={18} className="text-blue-500" />
                    Riwayat Verifikasi (Audit Trail)
                 </CardTitle>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                    Showing last 20 actions
                 </p>
              </CardHeader>
              <CardContent className="p-0">
                 <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                       <thead>
                          <tr className="border-b border-slate-800/50 bg-slate-800/10">
                             <th className="p-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">Waktu</th>
                             <th className="p-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">Tipe</th>
                             <th className="p-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">User</th>
                             <th className="p-4 text-[9px] font-black text-slate-500 uppercase tracking-widest">Detail</th>
                             <th className="p-4 text-[9px] font-black text-slate-500 uppercase tracking-widest text-right">Status</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-800/30">
                          {/* Verified Payments */}
                          {verifiedPayments.map((p: any) => (
                             <tr key={p.id} className="hover:bg-slate-800/20 transition-colors group">
                                <td className="p-4 text-[10px] text-slate-500 font-medium">
                                   {new Date(p.createdAt).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                </td>
                                <td className="p-4">
                                   <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[8px] font-black rounded uppercase tracking-tighter">
                                      {p.type === 'DOWN_PAYMENT' ? 'DP Payment' : 'Final Balance'}
                                   </span>
                                </td>
                                <td className="p-4">
                                   <p className="text-[10px] font-black text-slate-200 uppercase">{p.order?.user?.name}</p>
                                   <p className="text-[8px] text-slate-600 truncate max-w-[150px]">{p.order?.user?.email}</p>
                                </td>
                                <td className="p-4">
                                   <div className="flex items-center gap-3">
                                      <p className="text-[10px] font-black text-slate-300">Rp {p.amount.toLocaleString('id-ID')}</p>
                                      <a href={p.proof_url} target="_blank" className="text-[8px] text-blue-500 hover:underline font-black uppercase">View Proof</a>
                                   </div>
                                </td>
                                <td className="p-4 text-right">
                                   <div className="flex items-center justify-end gap-1 text-emerald-500 font-black text-[9px] uppercase">
                                      <CheckCircle size={10} />
                                      Verified
                                   </div>
                                </td>
                             </tr>
                          ))}

                          {/* Verified Memberships */}
                          {verifiedMemberships.map((m: any) => (
                             <tr key={m.id} className="hover:bg-slate-800/20 transition-colors">
                                <td className="p-4 text-[10px] text-slate-500 font-medium">
                                   {new Date(m.createdAt).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                </td>
                                <td className="p-4">
                                   <span className="px-2 py-0.5 bg-orange-500/10 text-orange-500 text-[8px] font-black rounded uppercase tracking-tighter">
                                      Membership
                                   </span>
                                </td>
                                <td className="p-4">
                                   <p className="text-[10px] font-black text-slate-200 uppercase">{m.user?.name}</p>
                                   <p className="text-[8px] text-slate-600 truncate max-w-[150px]">{m.user?.email}</p>
                                </td>
                                <td className="p-4 text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                                   Smart Care {m.appliance_name}
                                </td>
                                <td className="p-4 text-right">
                                   <div className="flex items-center justify-end gap-1 text-emerald-500 font-black text-[9px] uppercase">
                                      <CheckCircle size={10} />
                                      Verified
                                   </div>
                                </td>
                             </tr>
                          ))}

                          {verifiedPayments.length === 0 && verifiedMemberships.length === 0 && (
                            <tr>
                               <td colSpan={5} className="p-10 text-center text-[10px] text-slate-600 font-black uppercase tracking-[0.2em]">
                                  No transaction history recorded yet
                               </td>
                            </tr>
                          )}
                       </tbody>
                    </table>
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>

  );
}
