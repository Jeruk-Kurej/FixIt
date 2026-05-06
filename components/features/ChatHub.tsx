"use client";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, User as UserIcon, Search, ChevronRight, Clock, Send } from "lucide-react";
import ChatUI from "./ChatUI";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useSearchParams } from "next/navigation";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ChatHubProps {
  initialOrders: any[];
  currentUserId: string;
  compact?: boolean;
  initialSelectedOrderId?: string;
}

export default function ChatHub({ initialOrders, currentUserId, compact = false, initialSelectedOrderId }: ChatHubProps) {
  const searchParams = useSearchParams();
  const urlOrderId = searchParams.get("orderId");
  
  const [orders, setOrders] = useState<any[]>(initialOrders);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(
    initialSelectedOrderId || (initialOrders.length > 0 ? initialOrders[0].id : null)
  );

  // URL LISTENER: Switch chat if URL orderId changes (e.g. from notification)
  useEffect(() => {
    if (urlOrderId && urlOrderId !== selectedOrderId) {
      setSelectedOrderId(urlOrderId);
    }
  }, [urlOrderId]);

  const selectedOrder = orders.find(o => o.id === selectedOrderId);

  // INSTANT CLEAR: Clear unread badge locally as soon as a chat is selected
  useEffect(() => {
    if (selectedOrderId) {
      setOrders(prev => prev.map(order => {
        if (order.id === selectedOrderId) {
          return {
            ...order,
            _count: { ...order._count, messages: 0 }
          };
        }
        return order;
      }));
    }
  }, [selectedOrderId]);

  // PERIODIC REFRESH: Keep order list and unread counts fresh
  useEffect(() => {
    const refreshOrders = async () => {
      try {
        const res = await fetch("/api/orders/chat-list"); // We'll create this helper endpoint
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {}
    };

    const interval = setInterval(refreshOrders, 10000); // Check for new chats every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cn(
      "h-full flex",
      !compact && "container mx-auto px-4 py-8 h-[calc(100vh-120px)]"
    )}>
      <div className={cn(
        "flex-grow flex overflow-hidden",
        !compact ? "bg-slate-800/40 border border-slate-700/50 rounded-3xl shadow-2xl backdrop-blur-md" : "bg-transparent"
      )}>
        
        {/* Left Sidebar: Conversation List */}
        <div className={cn(
          "border-r border-slate-700/50 flex flex-col bg-slate-900/50 transition-all duration-300",
          compact ? "w-[60px] sm:w-[70px]" : "w-full sm:w-[350px]"
        )}>
          <div className={cn("p-4 border-b border-slate-700/50", compact && "p-3 flex justify-center")}>
            {!compact ? (
              <>
                <h2 className="text-xl font-black tracking-tight text-slate-100 flex items-center gap-2">
                  <MessageSquare className="text-orange-500" size={20} />
                  Chat Saya
                </h2>
                <div className="mt-4 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={14} />
                  <input 
                    type="text" 
                    placeholder="Cari..." 
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-300 outline-none focus:border-orange-500 transition-all"
                  />
                </div>
              </>
            ) : (
              <MessageSquare className="text-orange-500" size={18} />
            )}
          </div>


          <div className="flex-grow overflow-y-auto custom-scrollbar">
            {orders.length > 0 ? (
              <div className="divide-y divide-slate-800/50">
                {orders.map((order) => {
                  const isTechnician = order.technician?.user_id === currentUserId;
                  const otherUser = isTechnician ? order.user : (order.technician?.user || { name: "Teknisi FixIt" });
                  const isActive = selectedOrderId === order.id;
                  const unreadCount = order._count?.messages || 0;

                  return (
                    <button
                      key={order.id}
                      onClick={() => setSelectedOrderId(order.id)}
                      className={cn(
                        "w-full p-4 flex items-center gap-3 transition-all hover:bg-slate-800/50 group text-left relative",
                        isActive ? "bg-orange-500/10 border-l-4 border-orange-500" : "border-l-4 border-transparent",
                        compact && "px-2"
                      )}
                    >
                      <div className="relative shrink-0">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-700 group-hover:border-orange-500/30 transition-all shadow-lg",
                          isActive ? "bg-orange-500/20 text-orange-400 border-orange-500/30" : "bg-slate-800",
                          compact && "w-8 h-8 rounded-lg"
                        )}>
                          <UserIcon size={compact ? 14 : 22} />
                        </div>
                        
                        {/* Unread Badge - Floating on Avatar */}
                        {!isActive && unreadCount > 0 && (
                          <div className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-orange-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1.5 ring-4 ring-slate-900 animate-bounce">
                            {unreadCount}
                          </div>
                        )}
                      </div>

                      <div className={cn("flex-grow min-w-0", compact ? "hidden" : "block")}>
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={cn("text-xs font-black truncate", isActive ? "text-orange-400" : "text-slate-100")}>
                            {otherUser.name}
                          </h4>
                          {isActive && unreadCount > 0 && (
                            <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.6)]" />
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest truncate">
                          {order.appliance?.appliance_type?.name}
                        </p>
                      </div>

                      {!compact && !isActive && unreadCount > 0 && (
                        <div className="shrink-0 flex flex-col items-end gap-1">
                          <div className="text-[8px] font-black text-orange-500 uppercase tracking-tighter">Baru</div>
                        </div>
                      )}

                      <ChevronRight size={14} className={cn("text-slate-700 transition-all group-hover:translate-x-1 group-hover:text-slate-400", compact && "hidden")} />
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 text-center">
                <p className="text-sm text-slate-600 italic">Belum ada percakapan aktif.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Area: Chat Content */}
        <div className="flex-grow flex flex-col relative bg-slate-900/30">
          {selectedOrder ? (
            <div className="h-full flex flex-col">
              {/* Specialized Header for Hub */}
              <div className={cn(
                "p-6 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/20 backdrop-blur-md",
                compact && "p-4"
              )}>
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500 border border-orange-500/10",
                    compact ? "w-8 h-8" : "w-12 h-12"
                  )}>
                    <MessageSquare size={compact ? 16 : 24} />
                  </div>
                  <div className="min-w-0">
                    <h3 className={cn("font-black text-slate-100 truncate", compact ? "text-sm" : "text-lg")}>
                      {selectedOrder.technician?.user_id === currentUserId ? selectedOrder.user?.name : (selectedOrder.technician?.user?.name || "Teknisi FixIt")}
                    </h3>
                    <p className={cn("text-slate-500 font-bold uppercase tracking-[0.1em] truncate", compact ? "text-[8px]" : "text-xs")}>
                      {selectedOrder.appliance?.appliance_type?.name} • {selectedOrder.status}
                    </p>
                  </div>
                </div>
              </div>

              {/* Integrated ChatUI (Modified for Hub use or wrapped) */}
              {/* Note: We use fixed version of ChatUI but here we want it integrated. 
                  Let's create a specialized 'IntegratedChat' or reuse ChatUI with 'integrated' prop. 
              */}
              <div className="flex-grow overflow-hidden">
                <ChatContent 
                  orderId={selectedOrder.id} 
                  currentUserId={currentUserId} 
                  title={selectedOrder.user?.name} 
                  compact={compact}
                />
              </div>
            </div>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-12">
              <div className="w-24 h-24 bg-slate-800/40 rounded-full flex items-center justify-center mb-6 border border-slate-700/50 text-slate-700 animate-pulse">
                <MessageSquare size={40} />
              </div>
              <h3 className="text-xl font-black text-slate-400">Pilih Percakapan</h3>
              <p className="text-sm text-slate-600 mt-2 max-w-xs mx-auto leading-relaxed">
                Pilih salah satu pelanggan atau teknisi di samping untuk mulai berkoordinasi.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Sub-component for the actual message area in the hub
function ChatContent({ orderId, currentUserId, title, compact = false }: { orderId: string, currentUserId: string, title: string, compact?: boolean }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch(`/api/chat/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {}
  };

  useEffect(() => {
    fetchMessages();
    
    // Explicitly trigger a fetch to mark as read immediately on mount/change
    const markRead = async () => {
      try { 
        const res = await fetch(`/api/chat/${orderId}`); 
        if (res.ok) {
           // Signal notification hub to update because auto-read might have happened
           window.dispatchEvent(new CustomEvent("fixit-notif-update"));
        }
      } catch(e) {}
    };
    markRead();

    const interval = setInterval(() => {
      fetchMessages();
      // Periodically signal hub too in case of background updates
      window.dispatchEvent(new CustomEvent("fixit-notif-update"));
    }, 3000);
    return () => clearInterval(interval);
  }, [orderId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const content = input.trim();
    setInput("");
    try {
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId, content }),
      });
      fetchMessages();
    } catch (err) {}
  };


  return (
    <div className="flex flex-col h-full">
      <div ref={scrollRef} className={cn("flex-grow overflow-y-auto p-6 space-y-4 custom-scrollbar", compact && "p-4 space-y-3")}>
        {messages.map((msg, idx) => {
          const isMe = msg.sender_id === currentUserId;
          return (
            <div key={msg.id} className={cn("flex flex-col", isMe ? "items-end" : "items-start")}>
              <div className={cn(
                "max-w-[85%] px-4 py-3 rounded-2xl text-[13px] shadow-lg",
                isMe ? "bg-orange-500 text-white rounded-tr-none" : "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700",
                compact && "px-3 py-2 text-xs"
              )}>
                {msg.content}
              </div>
              <span className="text-[9px] text-slate-600 font-bold mt-1 uppercase px-1">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })}
      </div>
      <div className={cn("p-4 border-t border-slate-700/50 bg-slate-800/20", compact && "p-3")}>
        <form onSubmit={handleSend} className="relative flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tulis pesan..."
            className="flex-grow bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-slate-100 focus:border-orange-500 outline-none transition-all"
          />
          <button type="submit" className="shrink-0 w-10 h-10 bg-orange-500 hover:bg-orange-600 rounded-xl text-white shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center justify-center">
            <Send size={16} />
          </button>
        </form>
      </div>

    </div>
  );
}



