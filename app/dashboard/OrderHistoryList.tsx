"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";

import VerificationModal from "@/components/features/VerificationModal";
import PaymentModal from "@/components/features/PaymentModal";
import { History, Eye, CheckCircle2, Wrench, CalendarPlus, Wallet, ChevronLeft, ChevronRight } from "lucide-react";

import { cn, getGoogleCalendarUrl } from "@/lib/utils";


interface OrderHistoryListProps {
  orders: any[];
  isCompact?: boolean;
  showActiveOnly?: boolean;
  title?: string;
  hideFooter?: boolean;
  hideFilter?: boolean;
}


export default function OrderHistoryList({ 
  orders, 
  isCompact = false, 
  showActiveOnly = false, 
  title,
  hideFooter = false,
  hideFilter = false
}: OrderHistoryListProps) {



  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [paymentOrder, setPaymentOrder] = useState<any | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter by status if showActiveOnly is true
  const filteredByStatus = showActiveOnly 
    ? orders.filter(o => o.status !== 'DONE' && o.status !== 'CANCELLED')
    : orders;

  // Filter by category
  const baseFilteredOrders = filterCategory === "ALL" 
    ? filteredByStatus 
    : filteredByStatus.filter(o => o.appliance?.appliance_type?.name === filterCategory);


  const totalPages = Math.ceil(baseFilteredOrders.length / itemsPerPage);
  
  // Final list to display
  const paginatedOrders = isCompact 
    ? baseFilteredOrders.slice(0, 5) 
    : baseFilteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Get unique categories from all orders
  const categories = ["ALL", ...Array.from(new Set(orders.map(o => o.appliance?.appliance_type?.name).filter(Boolean)))];

  // Get last service info for the selected category
  const lastService = filterCategory !== "ALL" 
    ? orders.find(o => o.appliance?.appliance_type?.name === filterCategory && o.status === 'DONE')
    : null;

  return (
    <>
      <Card className={cn(
        "border-slate-800 bg-slate-900/50 backdrop-blur-md overflow-hidden flex flex-col shadow-2xl transition-all duration-500",
        isCompact ? "h-full" : "min-h-[600px] w-full"
      )}>
        <CardHeader className="p-3 border-b border-slate-800/50 bg-slate-800/20 shrink-0 flex flex-row items-center justify-between">
          <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
            <History size={12} className="text-orange-500" />
            {title || (showActiveOnly ? 'Pesanan Aktif' : (isCompact ? 'Riwayat Terbaru' : 'Seluruh Riwayat Pesanan'))}
          </CardTitle>


          {!isCompact && (
             <span className="text-[10px] font-bold text-slate-600 bg-slate-800 px-2 py-0.5 rounded-full">{baseFilteredOrders.length} ITEMS</span>
          )}
        </CardHeader>

        {/* Filter Bar */}
        {!hideFilter && (
          <div className="px-3 py-2 border-b border-slate-800/40 bg-slate-800/10 shrink-0">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {categories.map((cat: any) => (
                <button
                  key={cat}
                  onClick={() => {
                    setFilterCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={cn(
                    "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                    filterCategory === cat 
                      ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" 
                      : "bg-slate-800 text-slate-500 hover:text-slate-300"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}


        {/* Maintenance Insight Bar */}
        {lastService && (
          <div className="px-4 py-2 bg-emerald-500/5 border-b border-emerald-500/10 flex items-center gap-2 animate-in slide-in-from-top-2 duration-300">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[9px] font-bold text-slate-400">
              Terakhir {filterCategory} diservis: <span className="text-emerald-500">{formatDate(lastService.createdAt)}</span>
            </p>
          </div>
        )}

        <CardContent className="p-0 overflow-y-auto custom-scrollbar flex-grow">
          {paginatedOrders.length > 0 ? (
            <div className="divide-y divide-slate-800/40">
              {paginatedOrders.map((order) => {
                const needsDP = order.payment_status === 'UNPAID' && order.status !== 'CANCELLED';
                const needsBalance = order.payment_status === 'DP_PAID' && order.status === 'DONE';
                
                return (
                  <div key={order.id} className={cn(
                    "py-4 flex flex-col gap-3 hover:bg-slate-800/30 transition-all group relative border-l-0",
                    isCompact ? "px-3" : "px-6"
                  )}>
                    
                    {/* Premium Pill Indicator */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 group-hover:h-8 bg-emerald-500 rounded-r-full transition-all duration-300 opacity-0 group-hover:opacity-100" />
                    
                    {/* Item Header */}
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "rounded-xl flex items-center justify-center shrink-0 shadow-lg",
                        isCompact ? "w-9 h-9" : "w-12 h-12",
                        order.status === 'DONE' ? "bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20" : "bg-orange-500/10 text-orange-500 ring-1 ring-orange-500/20"
                      )}>
                        {order.status === 'DONE' ? <CheckCircle2 size={isCompact ? 18 : 24} /> : <Wrench size={isCompact ? 18 : 24} />}
                      </div>
                      <div className="min-w-0 flex-grow">
                        <div className="flex items-center gap-2">
                           <h4 className={cn(
                             "font-black text-slate-100 truncate leading-tight",
                             isCompact ? "text-[11px]" : "text-base"
                           )}>
                              {order.appliance?.appliance_type?.name}
                           </h4>
                           {order.payment_status === 'FULLY_PAID' && (
                             <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 text-[8px] font-black uppercase tracking-tighter">Lunas</span>
                           )}
                           {order.payment_status === 'DP_PAID' && (
                             <span className="px-1.5 py-0.5 rounded-full bg-orange-500/20 text-orange-500 text-[8px] font-black uppercase tracking-tighter">DP Berhasil</span>
                           )}
                        </div>
                        <p className={cn(
                          "text-slate-500 font-bold uppercase tracking-widest truncate mt-0.5",
                          isCompact ? "text-[9px]" : "text-[10px]"
                        )}>
                          {order.status} • {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Item Footer: Cost & Action */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/50">
                       <p className={cn(
                         "font-black text-slate-100",
                         isCompact ? "text-[11px]" : "text-lg"
                       )}>
                          {order.final_cost ? `Rp ${order.final_cost.toLocaleString('id-ID')}` : (order.estimated_cost ? `Rp ${order.estimated_cost.toLocaleString('id-ID')}` : "-")}
                       </p>
                       
                       <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                          {needsDP && (
                            <button 
                              onClick={() => setPaymentOrder(order)}
                              className="flex items-center gap-1 px-2 py-1 bg-orange-500 hover:bg-orange-600 rounded text-[8px] font-black uppercase text-white transition-all shadow-lg shadow-orange-500/20 whitespace-nowrap"
                            >
                               <Wallet size={10} />
                               Bayar DP
                            </button>
                          )}

                          {needsBalance && (
                            <button 
                              onClick={() => setPaymentOrder(order)}
                              className="flex items-center gap-1 px-2 py-1 bg-emerald-500 hover:bg-emerald-600 rounded text-[8px] font-black uppercase text-white transition-all shadow-lg shadow-emerald-500/20 whitespace-nowrap"
                            >
                               <Wallet size={10} />
                               Lunas
                            </button>
                          )}

                          <a 
                            href={getGoogleCalendarUrl(order)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-slate-800 hover:bg-blue-600 rounded text-slate-400 hover:text-white transition-all"
                          >
                            <CalendarPlus size={12} />
                          </a>

                          {order.technical_findings && (
                            <button 
                              onClick={() => setSelectedOrder(order)}
                              className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-emerald-500 rounded text-[8px] font-black uppercase text-slate-400 hover:text-white transition-all"
                            >
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
            <div className="p-10 text-center text-[9px] text-slate-700 font-black uppercase tracking-[0.2em] h-full flex flex-col items-center justify-center gap-3">
              <div className="w-12 h-12 bg-slate-800/50 rounded-full flex items-center justify-center text-slate-700">
                <History size={20} />
              </div>
              No {filterCategory !== 'ALL' ? filterCategory : ''} history yet
            </div>
          )}
        </CardContent>

        {/* Footer with Pagination Controls */}
        {!isCompact && totalPages > 1 && (
          <div className="p-4 border-t border-slate-800 bg-slate-800/20 flex items-center justify-between">
             <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Page {currentPage} of {totalPages}
             </div>
             <div className="flex items-center gap-2">
                <button 
                   disabled={currentPage === 1}
                   onClick={() => setCurrentPage(prev => prev - 1)}
                   className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700 transition-all"
                >
                   <ChevronLeft size={16} />
                </button>
                <button 
                   disabled={currentPage === totalPages}
                   onClick={() => setCurrentPage(prev => prev + 1)}
                   className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-700 transition-all"
                >
                   <ChevronRight size={16} />
                </button>
             </div>
          </div>
        )}

        {/* Footer for Compact Mode */}
        {isCompact && !hideFooter && (
          <div className="p-3 border-t border-slate-800 bg-slate-800/20">
            <Button 
              href="/history" 
              variant="outline" 
              className="w-full text-[9px] font-black uppercase tracking-[0.2em] py-2 border-slate-800 text-slate-500 hover:text-orange-500 hover:border-orange-500/30"
            >
              Lihat Semua Riwayat
            </Button>
          </div>
        )}

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
