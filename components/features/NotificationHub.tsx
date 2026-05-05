"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, BellRing, Clock, CheckCircle2, ShieldAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "INFO" | "REMINDER" | "SYSTEM";
  isRead: boolean;
  createdAt: string;
}

export default function NotificationHub() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Refresh every 1 minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      );
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative p-2 rounded-xl transition-all duration-300",
          isOpen ? "bg-orange-500/10 text-orange-500 ring-1 ring-orange-500/20" : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
        )}
      >
        {unreadCount > 0 ? (
          <BellRing size={20} className="animate-wiggle" />
        ) : (
          <Bell size={20} />
        )}
        
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-orange-500 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-slate-900">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Content */}
      <div className={cn(
        "absolute right-0 mt-4 w-[320px] sm:w-[400px] bg-slate-900 border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-3xl overflow-hidden transition-all duration-300 z-[60] origin-top-right",
        isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
      )}>
        <div className="p-5 border-b border-slate-800 bg-slate-800/20 flex items-center justify-between">
           <h3 className="text-sm font-black uppercase tracking-widest text-slate-100">Pusat Notifikasi</h3>
           <span className="text-[10px] font-black text-slate-500 px-2 py-0.5 bg-slate-800 rounded-lg">
             {unreadCount} NEW
           </span>
        </div>

        <div className="max-h-[400px] overflow-y-auto custom-scrollbar divide-y divide-slate-800/50">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div 
                key={n.id} 
                onClick={() => !n.isRead && markAsRead(n.id)}
                className={cn(
                  "p-5 transition-all cursor-pointer group relative",
                  !n.isRead ? "bg-orange-500/5 hover:bg-orange-500/10" : "hover:bg-slate-800/50 opacity-60"
                )}
              >
                {!n.isRead && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500" />
                )}
                
                <div className="flex gap-4">
                   <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg",
                      n.type === 'REMINDER' ? "bg-orange-500/10 text-orange-500" : "bg-slate-800 text-slate-400"
                   )}>
                      {n.type === 'REMINDER' ? <Clock size={18} /> : <ShieldAlert size={18} />}
                   </div>
                   
                   <div className="min-w-0 flex-grow">
                      <div className="flex items-center justify-between gap-2 mb-1">
                         <p className={cn(
                            "text-xs font-black truncate",
                            !n.isRead ? "text-slate-100" : "text-slate-400"
                         )}>{n.title}</p>
                         <span className="text-[9px] text-slate-500 font-bold shrink-0">
                            {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: id })}
                         </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                        {n.message}
                      </p>
                   </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
               <Bell size={40} className="mx-auto text-slate-800 mb-4" />
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600">Belum ada notifikasi</p>
            </div>
          )}
        </div>
        
        {notifications.length > 0 && (
          <div className="p-3 border-t border-slate-800 bg-slate-800/20 text-center">
             <button className="text-[10px] font-black uppercase tracking-widest text-orange-500 hover:text-orange-400 transition-colors">
                Bersihkan Semua
             </button>
          </div>
        )}
      </div>
    </div>
  );
}
