"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";

import VerificationModal from "@/components/features/VerificationModal";
import PaymentModal from "@/components/features/PaymentModal";
import { History, Eye, CheckCircle2, Wrench, CalendarPlus, Wallet, ChevronLeft, ChevronRight, ClipboardCheck, X, AlertCircle, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { cn, getGoogleCalendarUrl } from "@/lib/utils";
import ReviewModal from "@/components/features/ReviewModal";


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
  const [reviewOrder, setReviewOrder] = useState<any | null>(null);
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

  // Get unique categories from ONLY the currently filtered status (Active or All)
  const categories = ["ALL", ...Array.from(new Set(filteredByStatus.map(o => o.appliance?.appliance_type?.name).filter(Boolean)))];

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
             <div 
               className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
               onClick={() => setSelectedOrder(null)}
             />
             
             <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[40px] shadow-[0_40px_120px_rgba(0,0,0,0.9)] overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header with Premium Gradient */}
                <div className="p-10 bg-gradient-to-br from-slate-800/40 via-transparent to-transparent border-b border-slate-800/50 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-16 opacity-[0.03] pointer-events-none rotate-12">
                      <ClipboardCheck size={200} />
                   </div>

                   <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-orange-500 rounded-[28px] flex items-center justify-center text-white shadow-[0_15px_40px_rgba(249,115,22,0.4)] rotate-3">
                        <ClipboardCheck size={40} />
                      </div>
                      <div>
                        <h3 className="text-3xl font-black text-white tracking-tight">Detail Analisis</h3>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mt-1">
                           Transparency Report • #{selectedOrder.id.slice(0, 8)}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedOrder(null)}
                      className="w-12 h-12 flex items-center justify-center bg-slate-800 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-all border border-slate-700/50"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>

                <div className="p-10 space-y-10 max-h-[65vh] overflow-y-auto custom-scrollbar bg-slate-900/30">
                   
                   {/* Results Grid */}
                   <div className="space-y-6">
                      <div className="flex items-center justify-between">
                         <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em]">Temuan Diagnosa</p>
                         <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[8px] font-black rounded-full border border-emerald-500/20 uppercase tracking-widest">
                            Verified by Specialist
                         </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {Array.isArray(selectedOrder.technical_findings) ? (
                           selectedOrder.technical_findings.map((item: string) => (
                             <div key={item} className="flex items-center gap-4 p-5 bg-slate-950/50 border border-slate-800 rounded-3xl">
                                <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-slate-400">
                                   <AlertCircle size={20} />
                                </div>
                                <span className="text-[13px] font-black text-slate-300 tracking-tight leading-snug">{item}</span>
                             </div>
                           ))
                         ) : (
                           <div className="col-span-full p-10 bg-slate-950/30 border border-dashed border-slate-800 rounded-3xl text-center">
                              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">Belum ada data temuan spesifik</p>
                           </div>
                         )}
                      </div>
                   </div>

                   {/* Recommendations / Notes */}
                   <div className="space-y-4">
                      <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Catatan & Rekomendasi</p>
                      <div className="p-8 bg-slate-800/30 border border-slate-800/50 rounded-[32px] relative overflow-hidden group">
                         <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Wrench size={40} />
                         </div>
                         <p className="text-base text-slate-300 font-medium leading-relaxed italic relative z-10">
                            "{selectedOrder.technical_notes || "Unit dalam pengecekan mendalam..."}"
                         </p>
                      </div>
                   </div>
                </div>

                {/* Footer with Professional Badge */}
                <div className="p-10 bg-slate-950/80 border-t border-slate-800/50 flex items-center justify-between">
                   <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-slate-800 rounded-2xl border border-slate-700 flex items-center justify-center text-slate-500 shadow-xl">
                         <Wrench size={20} />
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Diagnosed By Specialist</span>
                         <p className="text-base font-black text-white">{selectedOrder.technician?.user?.name || "Master Technician"}</p>
                      </div>
                   </div>
                   <button 
                     onClick={() => setSelectedOrder(null)}
                     className="px-12 py-4 bg-white hover:bg-slate-100 rounded-2xl text-[10px] font-black text-slate-950 uppercase tracking-[0.2em] transition-all shadow-[0_15px_30px_rgba(255,255,255,0.1)] active:scale-95"
                   >
                     Selesai & Tutup
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
                      "py-4 flex flex-col gap-3 transition-all group relative border-l-2 border-l-transparent hover:border-l-orange-500 overflow-hidden",
                      isCompact ? "px-3" : "px-6",
                      order.status === 'DONE' && "hover:border-l-emerald-500",
                      order.technician_id ? "cursor-pointer active:scale-[0.98]" : "cursor-default"
                    )}
                    onClick={() => {
                      if (order.technician_id && order.status !== 'DONE') {
                         window.location.href = `/chat?orderId=${order.id}`;
                      }
                    }}
                  >
                    {/* Hover Glow Background - pointer-events-none to let clicks pass through */}
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/0 to-orange-500/0 group-hover:from-orange-500/[0.03] group-hover:via-transparent group-hover:to-transparent transition-all duration-500 pointer-events-none" />
                    
                    {/* Item Header */}
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "rounded-xl flex items-center justify-center shrink-0 shadow-lg",
                        isCompact ? "w-9 h-9" : "w-12 h-12",
                        order.status === 'DONE' ? "bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20" : "bg-orange-500/10 text-orange-500 ring-1 ring-orange-500/20"
                      )}>
                        {order.status === 'DONE' ? <CheckCircle2 size={isCompact ? 18 : 24} /> : <Wrench size={isCompact ? 18 : 24} />}
                      </div>
                      <div className="min-w-0 flex-grow flex flex-col gap-1.5">
                        <div className="flex flex-wrap items-center gap-2 min-w-0">
                           <h4 className={cn(
                             "font-black text-slate-100 truncate leading-tight",
                             isCompact ? "text-[11px]" : "text-base"
                           )}>
                              {order.appliance?.appliance_type?.name}
                           </h4>
                           {order.payment_status === 'FULLY_PAID' && (
                             <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 text-[8px] font-black uppercase tracking-tighter shrink-0 border border-emerald-500/10">Lunas</span>
                           )}
                        </div>

                        <div className="flex flex-col gap-2">
                           {/* Technician Search Status Label (Only in Active View and if DP is Paid) */}
                           {showActiveOnly && order.status !== 'DONE' && order.payment_status !== 'UNPAID' && (
                             <div className="w-fit">
                               {!order.technician_id ? (
                                 <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-orange-500/10 text-orange-500 text-[7px] font-black uppercase tracking-tighter border border-orange-500/20 animate-pulse">
                                   <div className="w-1 h-1 rounded-full bg-orange-500" />
                                   Mencari Teknisi...
                                 </span>
                               ) : (
                                 <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[7px] font-black uppercase tracking-tighter border border-emerald-500/20">
                                   <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                   Teknisi Ditemukan
                                 </span>
                               )}
                             </div>
                           )}

                           <p className={cn(
                             "text-slate-500 font-bold uppercase tracking-widest truncate",
                             isCompact ? "text-[9px]" : "text-[10px]"
                           )}>
                             {order.status} • {formatDate(order.createdAt)}
                           </p>
                        </div>
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
                                     onClick={(e) => {
                                       e.stopPropagation();
                                       setPaymentOrder(order);
                                     }}
                                     className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 rounded-full text-[9px] font-black uppercase text-white transition-all shadow-md shadow-orange-500/20 whitespace-nowrap active:scale-95 relative z-30"
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
                                     onClick={(e) => {
                                       e.stopPropagation();
                                       setPaymentOrder(order);
                                     }}
                                     className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 rounded-full text-[9px] font-black uppercase text-white transition-all shadow-md shadow-emerald-500/20 whitespace-nowrap active:scale-95 relative z-30"
                                   >
                                      <Wallet size={12} />
                                       Lunas
                                   </button>
                                 )}
                               </>
                             )}

                             {/* 3. Review Action (If DONE and Fully Paid) */}
                             {order.status === 'DONE' && order.payment_status === 'FULLY_PAID' && (
                               <>
                                 {!order.review ? (
                                   <button 
                                     onClick={(e) => {
                                       e.stopPropagation();
                                       setReviewOrder(order);
                                     }}
                                     className="relative z-30 flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-full text-[9px] font-black uppercase text-white transition-all shadow-lg shadow-orange-500/20 active:scale-90 group/btn"
                                   >
                                      <Star size={12} className="fill-white animate-pulse" />
                                      Beri Nilai
                                   </button>
                                 ) : (
                                   <div className="flex flex-col items-end gap-1">
                                      <div className="flex items-center gap-0.5">
                                         {[...Array(5)].map((_, i) => (
                                           <Star 
                                             key={i} 
                                             size={10} 
                                             className={cn(
                                               i < order.review.rating ? "fill-orange-500 text-orange-500" : "fill-slate-800 text-slate-800"
                                             )} 
                                           />
                                         ))}
                                      </div>
                                      {order.review.comment && (
                                        <p className="text-[8px] font-bold text-slate-500 italic max-w-[150px] truncate">
                                          "{order.review.comment}"
                                        </p>
                                      )}
                                   </div>
                                 )}
                               </>
                             )}
                          </div>

                          {/* 2. Utility Icons (Only for Active Orders) */}
                          {!needsDP && order.status !== 'DONE' && (
                            <div className="flex items-center gap-1 shrink-0 ml-1">
                               {/* Analysis Eye: Only if findings exist - Put FIRST so Calendar stays at the far right */}
                               {order.technical_findings && (
                                 <button 
                                   onClick={(e) => {
                                     e.stopPropagation();
                                     setSelectedOrder(order);
                                   }}
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
                                 onClick={(e) => e.stopPropagation()}
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

      {typeof document !== "undefined" && paymentOrder && createPortal(
        <PaymentModal
          isOpen={!!paymentOrder}
          onClose={() => setPaymentOrder(null)}
          order={paymentOrder}
          paymentType={paymentOrder.payment_status === 'UNPAID' ? 'DOWN_PAYMENT' : 'FINAL_BALANCE'}
          amount={paymentOrder.payment_status === 'UNPAID' ? 50000 : (paymentOrder.final_cost ? paymentOrder.final_cost - 50000 : (paymentOrder.estimated_cost - 50000))}
        />,
        document.body
      )}

      {typeof document !== "undefined" && reviewOrder && createPortal(
        <ReviewModal
          isOpen={!!reviewOrder}
          onClose={() => setReviewOrder(null)}
          order={reviewOrder}
        />,
        document.body
      )}
    </>
  );
;
}
