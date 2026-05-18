"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";

import SmartReminderAlert from "@/components/features/SmartReminderAlert";

import Button from "@/components/ui/Button";
import ServiceCalendar from "@/components/features/ServiceCalendar";
import OrderHistoryList from "./OrderHistoryList";
import FloatingChatWidget from "@/components/features/FloatingChatWidget";
import { useState } from "react";
import { User, Zap, ShieldCheck, Star, AlertCircle, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";


interface CustomerDashboardViewProps {
  user: any;
  calendarEvents: any[];
  pendingMemberships?: any[];
  pendingPayments?: any[];
}

export default function CustomerDashboardView({ user, calendarEvents, pendingMemberships = [], pendingPayments = [] }: CustomerDashboardViewProps) {
  const router = useRouter();
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [approvingPaymentId, setApprovingPaymentId] = useState<string | null>(null);

  const handleApprovePayment = async (paymentId: string) => {
    setApprovingPaymentId(paymentId);
    try {
      const res = await fetch("/api/payments/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId }),
      });
      if (res.ok) {
        alert("Pembayaran Sah! Status pesanan telah diperbarui.");
        router.refresh();
      }
    } catch (err) {
      alert("Gagal mengaktifkan.");
    } finally {
      setApprovingPaymentId(null);
    }
  };


  const handleApprove = async (id: string) => {
    setApprovingId(id);
    try {
      const res = await fetch("/api/membership/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ membershipId: id }),
      });
      if (res.ok) {
        alert("Membership Aktif! Jadwal otomatis telah dibuat di kalender.");
        router.refresh();
      }
    } catch (err) {
      alert("Gagal mengaktifkan.");
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col overflow-hidden bg-slate-950/20 relative">
      
      {/* Premium Ambient Glow - The "Sultan" Touch */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="w-full px-4 flex flex-col h-full relative z-10 pt-4 pb-4">
        
        {/* Header Section */}
        <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 px-2">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-black tracking-tight text-slate-50 flex items-center gap-3">
              Halo, {user.name}
            </h1>
            <a href="/profile" className="px-3 py-1.5 rounded-full bg-slate-800/60 border border-slate-700/50 hover:bg-orange-500/10 hover:border-orange-500/30 text-slate-300 hover:text-orange-400 text-[10px] font-bold uppercase tracking-widest transition-all">
              Edit Profil
            </a>
          </div>
          
          <Button href="/booking" variant="primary" className="shadow-[0_10px_20px_rgba(249,115,22,0.15)] px-6 py-2 text-[10px] font-black uppercase tracking-wider shrink-0 w-full md:w-auto text-center justify-center">
            Pesan Servis Baru
          </Button>
        </div>

        {/* Slim & Compact Membership Banner - Moved to top */}
        <div className="mb-4 px-2">
          <Card className="border-orange-500/20 bg-gradient-to-r from-slate-900 to-slate-950 p-4 relative overflow-hidden group">
             <div className="absolute top-1/2 -right-4 -translate-y-1/2 opacity-5 group-hover:opacity-10 transition-opacity">
                <Zap size={60} className="text-orange-500" />
             </div>
             
             <div className="relative z-10 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500 shrink-0">
                      <ShieldCheck size={16} />
                   </div>
                   <div>
                      <h4 className="text-[11px] font-black text-slate-100 uppercase tracking-wider">Premium</h4>
                      <p className="text-[8px] text-slate-500 font-bold">Gratis Kunjungan & Garansi</p>
                   </div>
                </div>
                <Button variant="outline" href="/membership" className="border-orange-500/30 text-orange-500 hover:bg-orange-500/10 text-[8px] font-black uppercase px-4 py-1.5 rounded-lg shrink-0">
                   Buka
                </Button>
             </div>
          </Card>
        </div>



        <div className="flex-grow overflow-hidden min-h-0 px-2">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full min-h-0 pb-4">
                <div className="lg:col-span-8 h-full">
                  <ServiceCalendar events={calendarEvents} />
                </div>
                <div className="lg:col-span-4 h-full flex flex-col min-h-0">
                  {(() => {
                    const pendingOrders = user.orders.filter((o: any) => 
                      (o.payment_status === 'UNPAID' && o.status !== 'CANCELLED') || 
                      (o.payments && o.payments.some((p: any) => 
                        (p.type === 'DOWN_PAYMENT' && p.status === 'PENDING') || 
                        (p.status === 'INVALID' && !o.payments.some((p2: any) => p2.type === p.type && (p2.status === 'VALID' || p2.status === 'PENDING')))
                      ))
                    );
                    const activeOrders = user.orders.filter((o: any) => 
                      o.status !== 'DONE' && o.status !== 'CANCELLED' &&
                      !((o.payment_status === 'UNPAID') || (o.payments && o.payments.some((p: any) => p.type === 'DOWN_PAYMENT' && p.status === 'PENDING')))
                    );
                    const hasPending = pendingOrders.length > 0;

                    return (
                      <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-md overflow-hidden flex flex-col h-full shadow-2xl">
                        {hasPending ? (
                          <SidebarTabbedOrders 
                            pendingOrders={pendingOrders} 
                            activeOrders={activeOrders} 
                          />
                        ) : (
                          <OrderHistoryList 
                            orders={activeOrders} 
                            isCompact={true} 
                            title="Pesanan Aktif"
                            showActiveOnly={true} 
                          />
                        )}
                      </Card>
                    );
                  })()}
                </div>
            </div>
        </div>

      </div>

      <FloatingChatWidget orders={user.orders} currentUserId={user.id} />
    </div>
  );
}

function SidebarTabbedOrders({ pendingOrders, activeOrders }: { pendingOrders: any[], activeOrders: any[] }) {

  const [activeTab, setActiveTab] = useState<'PENDING' | 'ACTIVE'>('PENDING');

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Tab Switcher */}
      <div className="flex p-1 bg-slate-950/50 border-b border-slate-800 shrink-0">
        <button 
          onClick={() => setActiveTab('PENDING')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 text-[9px] font-black uppercase tracking-widest transition-all rounded-lg relative overflow-hidden group",
            activeTab === 'PENDING' ? "text-orange-500" : "text-slate-500 hover:text-slate-300"
          )}
        >
          {activeTab === 'PENDING' && <div className="absolute inset-0 bg-orange-500/5 animate-pulse" />}
          Menunggu Aksi
          {pendingOrders.length > 0 && (
            <span className={cn(
              "px-1.5 py-0.5 rounded-full text-[8px] font-black",
              activeTab === 'PENDING' ? "bg-orange-500 text-white" : "bg-slate-800 text-slate-500"
            )}>
              {pendingOrders.length}
            </span>
          )}
        </button>
        <button 
          onClick={() => setActiveTab('ACTIVE')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2 text-[9px] font-black uppercase tracking-widest transition-all rounded-lg",
            activeTab === 'ACTIVE' ? "text-emerald-500" : "text-slate-500 hover:text-slate-300"
          )}
        >
          Pesanan Aktif
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-grow min-h-0 overflow-hidden">
        {activeTab === 'PENDING' ? (
          <OrderHistoryList 
            orders={pendingOrders} 
            isCompact={true} 
            title="" 
            showActiveOnly={true} 
            hideFooter={true} 
            hideFilter={true}
            noCard={true}
          />
        ) : (
          <OrderHistoryList 
            orders={activeOrders} 
            isCompact={true} 
            title="" 
            showActiveOnly={true}
            noCard={true}
          />
        )}
      </div>
    </div>
  );
}

