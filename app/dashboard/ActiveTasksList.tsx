"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { ChevronLeft, ChevronRight, CheckCircle2, Clock, ArrowUpRight, CalendarPlus } from "lucide-react";
import Link from "next/link";
import { cn, getGoogleCalendarUrl } from "@/lib/utils";


interface ActiveTasksListProps {
  orders: any[];
}

export default function ActiveTasksList({ orders }: ActiveTasksListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const activeOrders = orders.filter(o => ['ACCEPTED', 'WORKING'].includes(o.status));
  
  const totalPages = Math.ceil(activeOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = activeOrders.slice(startIndex, startIndex + itemsPerPage);

  const nextPage = () => setCurrentPage(p => Math.min(p + 1, totalPages));
  const prevPage = () => setCurrentPage(p => Math.max(p - 1, 1));

  return (
    <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-md shadow-2xl h-full flex flex-col overflow-hidden">
      <CardHeader className="p-3 border-b border-slate-800/50 bg-slate-800/20 flex flex-row items-center justify-between shrink-0">
        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
          🛠️ Tugas ({activeOrders.length})
        </CardTitle>
        
        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <button 
              onClick={prevPage} 
              disabled={currentPage === 1}
              className="p-1 hover:bg-slate-700 rounded disabled:opacity-30 transition-all text-slate-400"
            >
              <ChevronLeft size={12} />
            </button>
            <span className="text-[9px] font-black text-slate-600 w-6 text-center">
              {currentPage}
            </span>
            <button 
              onClick={nextPage} 
              disabled={currentPage === totalPages}
              className="p-1 hover:bg-slate-700 rounded disabled:opacity-30 transition-all text-slate-400"
            >
              <ChevronRight size={12} />
            </button>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-0 overflow-y-auto custom-scrollbar flex-grow">
        {currentOrders.length > 0 ? (
          <div className="divide-y divide-slate-800/40">
            {currentOrders.map((order) => (
              <div key={order.id} className="px-1.5 py-4 flex flex-col gap-3 hover:bg-slate-800/30 transition-all group relative">
                
                {/* Premium Pill Indicator */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 group-hover:h-8 bg-orange-500 rounded-r-full transition-all duration-300 opacity-0 group-hover:opacity-100" />
                
                {/* Header: User Info */}
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all shadow-lg",
                    order.status === 'WORKING' ? "bg-orange-500/10 text-orange-500 ring-1 ring-orange-500/20" : "bg-slate-800 text-slate-500"
                  )}>
                    {order.status === 'WORKING' ? <Clock size={18} className="animate-spin-slow" /> : <CheckCircle2 size={18} />}
                  </div>
                  <div className="min-w-0 flex-grow">
                    <h4 className="font-bold text-slate-100 text-[11px] truncate leading-tight">{order.user?.name}</h4>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest truncate mt-0.5">
                      {order.appliance?.appliance_type?.name}
                    </p>
                  </div>
                </div>
                
                {/* Footer: Status & Action */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/50">
                   <div className="flex flex-col gap-1">
                      {order.status !== 'ACCEPTED' && (
                        <div className={cn(
                          "text-[8px] font-black uppercase px-2 py-0.5 rounded border tracking-widest w-fit",
                          order.status === 'WORKING' ? "border-orange-500/20 bg-orange-500/10 text-orange-500" : "border-slate-700 bg-slate-800 text-slate-400"
                        )}>
                          {order.status}
                        </div>
                      )}
                   </div>

                   
                   <div className="flex items-center gap-2">
                     <a 
                       href={getGoogleCalendarUrl(order)}
                       target="_blank"
                       rel="noopener noreferrer"
                       title="Sync to Google Calendar"
                       className="p-1.5 bg-slate-800 hover:bg-blue-600 rounded-lg text-slate-400 hover:text-white transition-all"
                     >
                       <CalendarPlus size={14} />
                     </a>
                     
                     <Link 
                       href={`/technician/verify/${order.id}`}
                       className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-orange-500 rounded-lg text-[9px] font-black uppercase text-slate-400 hover:text-white transition-all group/btn"
                     >
                       Update
                       <ArrowUpRight size={10} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                     </Link>
                   </div>

                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center text-[9px] text-slate-700 font-black uppercase tracking-[0.2em] h-full flex flex-col items-center justify-center gap-2">
             🏝️ No tasks
          </div>
        )}
      </CardContent>
    </Card>
  );
}
