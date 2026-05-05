"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";

import VerificationModal from "@/components/features/VerificationModal";
import PaymentModal from "@/components/features/PaymentModal";
import { History, Eye, CheckCircle2, Wrench, CalendarPlus, Wallet, ChevronLeft, ChevronRight, ClipboardCheck, X, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { cn, getGoogleCalendarUrl } from "@/lib/utils";


interface OrderHistoryListProps {
  orders: any[];
  isCompact?: boolean;
  showActiveOnly?: boolean;
  title?: string;
  hideFooter?: boolean;
  hideFilter?: boolean;
  noCard?: boolean;
}


export default function OrderHistoryList({ 
  orders, 
  isCompact = false, 
  showActiveOnly = false, 
  title,
  hideFooter = false,
  hideFilter = false,
  noCard = false
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

  const content = (

    <>
        {!noCard && (
          <CardHeader className="p-3 border-b border-slate-800/50 bg-slate-800/20 shrink-0 flex flex-row items-center justify-between">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <History size={12} className="text-orange-500" />
              {title || (showActiveOnly ? 'Pesanan Aktif' : (isCompact ? 'Riwayat Terbaru' : 'Seluruh Riwayat Pesanan'))}
            </CardTitle>


            {!isCompact && (
               <span className="text-[10px] font-bold text-slate-600 bg-slate-800 px-2 py-0.5 rounded-full">{baseFilteredOrders.length} ITEMS</span>
            )}
          </CardHeader>
        )}

        {/* Findings Modal - Teleported to Body via Portal for True Full Screen Focus */}
        {typeof document !== "undefined" && selectedOrder && createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
             {/* Deep Focus Backdrop */}
             <div 
               className="absolute inset-0 bg-slate-950/90 backdrop-blur-md transition-all duration-500"
               onClick={() => setSelectedOrder(null)}
             />
             
             {/* Content Modal - Centered and Larger */}
             <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-[32px] shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in zoom-in duration-300">
                {/* Header with Background Gradient */}
                <div className="p-8 bg-gradient-to-b from-slate-800/50 to-transparent border-b border-slate-800/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-orange-500 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-orange-500/40 rotate-3">
                        <ClipboardCheck size={32} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-white tracking-tight">Detail Analisis</h3>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.3em]">Order ID: {selectedOrder.id.slice(0, 12)}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedOrder(null)}
                      className="w-10 h-10 flex items-center justify-center bg-slate-800 hover:bg-red-500/20 rounded-full text-slate-400 hover:text-red-400 transition-all border border-slate-700/50"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                   {/* Summary Section */}
                   <div className="space-y-3">
                      <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em]">Ringkasan Temuan</p>
                      <div className="p-6 bg-slate-800/30 border border-slate-800/80 rounded-[24px] text-lg leading-relaxed text-slate-200 font-medium italic">
                         "{selectedOrder.technical_findings?.summary || "Tidak ada ringkasan temuan..."}"
                      </div>
                   </div>
                   
                   {/* Checklist Grid */}
                   {selectedOrder.technical_findings?.checklist && (
                     <div className="space-y-4">
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Checklist Kondisi Unit</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                           {Object.entries(selectedOrder.technical_findings.checklist).map(([key, val]: any) => (
                             <div key={key} className="flex items-center justify-between p-4 bg-slate-800/20 rounded-2xl border border-slate-800/40 hover:border-slate-700 transition-colors">
                                <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">{key.replace(/_/g, ' ')}</span>
                                {val ? (
                                  <div className="flex items-center gap-2 text-emerald-400">
                                     <span className="text-[8px] font-black uppercase tracking-tighter">Normal</span>
                                     <CheckCircle2 size={16} />
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2 text-orange-400">
                                     <span className="text-[8px] font-black uppercase tracking-tighter">Bermasalah</span>
                                     <AlertCircle size={16} />
                                  </div>
                                )}
                             </div>
                           ))}
                        </div>
                     </div>
                   )}
                </div>

                {/* Footer Section */}
                <div className="p-8 bg-slate-950/50 border-t border-slate-800 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-800 rounded-full border border-slate-700 flex items-center justify-center text-slate-400">
                         <Wrench size={16} />
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Dianalisis Oleh</span>
                         <p className="text-sm font-black text-white">{selectedOrder.technician?.user?.name || "Joko Teknisi"}</p>
                      </div>
                   </div>
                   <button 
                     onClick={() => setSelectedOrder(null)}
                     className="px-10 py-3 bg-white hover:bg-slate-200 rounded-2xl text-xs font-black text-slate-950 uppercase tracking-widest transition-all shadow-xl active:scale-95"
                   >
                     Tutup Laporan
                   </button>
                </div>
             </div>
          </div>,
          document.body
        )}

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
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.05 } }
              }}
              className="divide-y divide-slate-800/40"
            >
              {paginatedOrders.map((order, index) => {
                const needsDP = order.payment_status === 'UNPAID' && order.status !== 'CANCELLED';
                const needsBalance = order.payment_status === 'DP_PAID' && order.status === 'DONE';
                
                return (
                  <motion.div 
                    key={order.id} 
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 }
                    }}
                    whileHover={{ 
                      scale: 1.02,
                      backgroundColor: "rgba(30, 41, 59, 0.8)",
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className={cn(
                      "py-4 flex flex-col gap-3 transition-all group relative border-l-2 border-l-transparent hover:border-l-orange-500 cursor-default overflow-hidden",
                      isCompact ? "px-3" : "px-6",
                      order.status === 'DONE' && "hover:border-l-emerald-500"
                    )}
                  >
                    {/* Hover Glow Background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/0 to-orange-500/0 group-hover:from-orange-500/[0.03] group-hover:via-transparent group-hover:to-transparent transition-all duration-500" />
                    
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

                    {/* Item Footer: Compact Side-by-Side for All Stages */}
                    <div className="pt-2.5 border-t border-slate-800/40 flex items-center justify-between gap-3">
                       {/* Price Block - Compact */}
                       <div className="flex items-center gap-2 shrink-0">
                          <p className={cn(
                            "font-black text-slate-100 tracking-tight",
                            isCompact ? "text-sm" : "text-base"
                          )}>
                             {order.final_cost ? `Rp ${order.final_cost.toLocaleString('id-ID')}` : (order.estimated_cost ? `Rp ${order.estimated_cost.toLocaleString('id-ID')}` : "-")}
                          </p>
                       </div>
                       
                       {/* Actions Block - Unified Horizontal */}
                       <div className="flex items-center gap-1.5 min-w-0 justify-end flex-grow">
                          {/* 1. Payment Action (DP or Balance) */}
                          <div className="flex items-center gap-1.5 min-w-0">
                             {needsDP && (
                               <>
                                 {order.payments && order.payments.some((p: any) => p.status === 'PENDING') ? (
                                   <div className="px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center gap-1.5 shrink-0">
                                      <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
                                      <span className="text-[8px] font-black uppercase text-blue-400 tracking-tighter">Verifikasi</span>
                                   </div>
                                 ) : (
                                   <button 
                                     onClick={() => setPaymentOrder(order)}
                                     className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 rounded-full text-[9px] font-black uppercase text-white transition-all shadow-md shadow-orange-500/20 whitespace-nowrap active:scale-95"
                                   >
                                      <Wallet size={12} />
                                      Bayar DP
                                   </button>
                                 )}
                               </>
                             )}

                             {needsBalance && (
                               <>
                                 {order.payments && order.payments.some((p: any) => p.status === 'PENDING') ? (
                                   <div className="px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center gap-1.5 shrink-0">
                                      <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
                                      <span className="text-[8px] font-black uppercase text-blue-400 tracking-tighter">Verifikasi</span>
                                   </div>
                                 ) : (
                                   <button 
                                     onClick={() => setPaymentOrder(order)}
                                     className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 rounded-full text-[9px] font-black uppercase text-white transition-all shadow-md shadow-emerald-500/20 whitespace-nowrap active:scale-95"
                                   >
                                      <Wallet size={12} />
                                      Lunas
                                   </button>
                                 )}
                               </>
                             )}
                          </div>

                          {/* 2. Utility Icons (Only for Paid/Active Orders) */}
                          {!needsDP && (
                            <div className="flex items-center gap-1 shrink-0 ml-1">
                               {/* Analysis Eye: Only if findings exist - Put FIRST so Calendar stays at the far right */}
                               {order.technical_findings && (
                                 <button 
                                   onClick={() => setSelectedOrder(order)}
                                   className="w-7 h-7 flex items-center justify-center bg-slate-800/50 hover:bg-emerald-500/20 rounded-full text-slate-500 hover:text-emerald-400 transition-all border border-slate-700/30"
                                   title="Analysis"
                                 >
                                    <Eye size={12} />
                                 </button>
                               )}

                               {/* Calendar: Always for active orders - Put LAST to fix position */}
                               <a 
                                 href={getGoogleCalendarUrl(order)}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="w-7 h-7 flex items-center justify-center bg-slate-800/50 hover:bg-blue-500/20 rounded-full text-slate-500 hover:text-blue-400 transition-all border border-slate-700/30"
                                 title="Calendar"
                               >
                                 <CalendarPlus size={12} />
                               </a>
                            </div>
                          )}
                       </div>
                    </div>




                  </motion.div>
                );
              })}
            </motion.div>
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
    </>
  );

  return (
    <>
      {noCard ? (
        <div className="flex flex-col h-full overflow-hidden">
          {content}
        </div>
      ) : (
        <Card className={cn(
          "border-slate-800 bg-slate-900/50 backdrop-blur-md overflow-hidden flex flex-col shadow-2xl transition-all duration-500",
          isCompact ? "h-full" : "min-h-[600px] w-full"
        )}>
          {content}
        </Card>
      )}

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
