"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";
import VerificationModal from "@/components/features/VerificationModal";
import PaymentModal from "@/components/features/PaymentModal";
import { History, Eye, CheckCircle2, Wrench, CalendarPlus, Wallet } from "lucide-react";
import { cn, getGoogleCalendarUrl } from "@/lib/utils";


interface OrderHistoryListProps {
  orders: any[];
}

export default function OrderHistoryList({ orders }: OrderHistoryListProps) {
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [paymentOrder, setPaymentOrder] = useState<any | null>(null);

  return (
    <>
      <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-md h-full overflow-hidden flex flex-col shadow-2xl">
        <CardHeader className="p-3 border-b border-slate-800/50 bg-slate-800/20 shrink-0">
          <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
            <History size={12} className="text-orange-500" />
            Riwayat Pesanan
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-y-auto custom-scrollbar flex-grow">
          {orders.length > 0 ? (
            <div className="divide-y divide-slate-800/40">
              {orders.map((order) => {
                const needsDP = order.payment_status === 'UNPAID' && order.status !== 'CANCELLED';
                const needsBalance = order.payment_status === 'DP_PAID' && order.status === 'DONE';
                
                return (
                  <div key={order.id} className="px-1.5 py-4 flex flex-col gap-3 hover:bg-slate-800/30 transition-all group relative border-l-0">
                    
                    {/* Premium Pill Indicator */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 group-hover:h-8 bg-emerald-500 rounded-r-full transition-all duration-300 opacity-0 group-hover:opacity-100" />
                    
                    {/* Item Header */}
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-lg",
                        order.status === 'DONE' ? "bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20" : "bg-orange-500/10 text-orange-500 ring-1 ring-orange-500/20"
                      )}>
                        {order.status === 'DONE' ? <CheckCircle2 size={18} /> : <Wrench size={18} />}
                      </div>
                      <div className="min-w-0 flex-grow">
                        <div className="flex items-center gap-2">
                           <h4 className="font-bold text-slate-100 text-[11px] truncate leading-tight">
                              {order.appliance?.appliance_type?.name}
                           </h4>
                           {order.payment_status === 'FULLY_PAID' && (
                             <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 text-[8px] font-black uppercase tracking-tighter">Lunas</span>
                           )}
                           {order.payment_status === 'DP_PAID' && (
                             <span className="px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-500 text-[8px] font-black uppercase tracking-tighter">DP Berhasil</span>
                           )}
                        </div>
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest truncate mt-0.5">
                          {order.status} • {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Item Footer: Cost & Action */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/50">
                       <p className="text-[11px] font-black text-slate-100">
                          {order.final_cost ? `Rp ${order.final_cost.toLocaleString('id-ID')}` : (order.estimated_cost ? `Rp ${order.estimated_cost.toLocaleString('id-ID')}` : "-")}
                       </p>
                       
                       <div className="flex items-center gap-2">
                          {needsDP && (
                            <button 
                              onClick={() => setPaymentOrder(order)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 rounded-lg text-[9px] font-black uppercase text-white transition-all shadow-lg shadow-orange-500/20"
                            >
                               <Wallet size={12} />
                               Bayar DP
                            </button>
                          )}

                          {needsBalance && (
                            <button 
                              onClick={() => setPaymentOrder(order)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-[9px] font-black uppercase text-white transition-all shadow-lg shadow-emerald-500/20"
                            >
                               <Wallet size={12} />
                               Pelunasan
                            </button>
                          )}

                          <a 
                            href={getGoogleCalendarUrl(order)}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Sync to Google Calendar"
                            className="p-1.5 bg-slate-800 hover:bg-blue-600 rounded-lg text-slate-400 hover:text-white transition-all"
                          >
                            <CalendarPlus size={14} />
                          </a>

                          {order.technical_findings && (
                            <button 
                              onClick={() => setSelectedOrder(order)}
                              className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-emerald-500 rounded-lg text-[9px] font-black uppercase text-slate-400 hover:text-white transition-all group/btn"
                            >
                               Analisis
                               <Eye size={10} />
                            </button>
                          )}
                       </div>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-10 text-center text-[9px] text-slate-700 font-black uppercase tracking-[0.2em] h-full flex items-center justify-center">
              No history yet
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Components */}
      {selectedOrder && (
        <VerificationModal 
          order={selectedOrder} 
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)} 
        />
      )}

      {paymentOrder && (
        <PaymentModal
          isOpen={!!paymentOrder}
          onClose={() => setPaymentOrder(null)}
          order={paymentOrder}
          paymentType={paymentOrder.payment_status === 'UNPAID' ? 'DOWN_PAYMENT' : 'FINAL_BALANCE'}
          amount={paymentOrder.payment_status === 'UNPAID' ? 50000 : (paymentOrder.final_cost ? paymentOrder.final_cost - 50000 : (paymentOrder.estimated_cost - 50000))}
        />
      )}
    </>
  );
}

