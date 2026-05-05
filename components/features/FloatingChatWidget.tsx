"use client";

import { useState, useEffect } from "react";
import { MessageSquare, X, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface FloatingChatWidgetProps {
  orders: any[];
  currentUserId: string;
}

export default function FloatingChatWidget({ orders, currentUserId }: FloatingChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Filter orders that have active chats
  const activeOrders = orders.filter(o => ['ACCEPTED', 'WORKING', 'DONE'].includes(o.status));

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4">
      
      {/* Mini Preview Panel */}
      {isOpen && (
        <div className="w-[320px] bg-slate-900 border border-slate-800 rounded-[32px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-300 backdrop-blur-xl">
          <div className="p-6 border-b border-slate-800 bg-gradient-to-br from-orange-500/10 to-transparent flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-100 flex items-center gap-2">
               <MessageSquare size={16} className="text-orange-500" />
               Obrolan Aktif
            </h3>
            <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-slate-100 transition-colors">
               <X size={18} />
            </button>
          </div>
          
          <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
            {activeOrders.length > 0 ? (
              <div className="divide-y divide-slate-800/50">
                {activeOrders.map((order) => {
                  const otherUser = order?.technician?.user || order?.user || { name: "User" };
                  return (
                    <Link 
                      key={order.id} 
                      href={`/chat?orderId=${order.id}`}
                      className="p-4 flex items-center gap-4 hover:bg-slate-800/30 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-orange-500 transition-all group-hover:text-white">
                         {otherUser?.name?.[0] || "?"}
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="text-xs font-bold text-slate-100 truncate">{otherUser?.name || "Pelanggan"}</p>
                        <p className="text-[10px] text-slate-500 truncate">{order?.appliance?.appliance_type?.name || "Servis"}</p>
                      </div>
                      <ArrowUpRight size={14} className="text-slate-700 group-hover:text-orange-500 transition-colors" />
                    </Link>
                  );
                })}

              </div>
            ) : (
              <div className="p-10 text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                Tidak ada obrolan.
              </div>
            )}
          </div>
          
          <div className="p-4 bg-slate-800/20 border-t border-slate-800">
             <Link 
               href="/chat" 
               className="block w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-2xl text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 transition-all"
             >
               Buka Semua Chat
             </Link>
          </div>
        </div>
      )}

      {/* Main Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 group relative",
          isOpen ? "bg-slate-800 text-slate-100" : "bg-orange-500 text-white"
        )}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={28} className="group-hover:rotate-12 transition-transform" />}
        
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-4 border-slate-900 text-[10px] font-black flex items-center justify-center">
             {unreadCount}
          </span>
        )}
        
        {!isOpen && (
          <div className="absolute inset-0 rounded-full bg-orange-500 animate-ping opacity-20 pointer-events-none" />
        )}
      </button>
    </div>
  );
}
