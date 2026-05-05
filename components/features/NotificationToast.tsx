"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Bell, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NotificationToast() {
  const [activeToast, setActiveToast] = useState<any | null>(null);
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());
  const pathname = usePathname();

  const markAsToasted = async (id: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isToastShown: true }),
      });
    } catch (err) {
      console.error("Failed to mark as toasted:", err);
    }
  };

  // Track previous pathname to only clear toast on actual navigation
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      setActiveToast(null);
      prevPathname.current = pathname;
    }
  }, [pathname]);

  useEffect(() => {
    // 1. Check for Auth Notifications (Login/Logout)
    const checkAuthNotifs = () => {
      // Check login flag
      const hasLoggedIn = sessionStorage.getItem("fixit_logged_in");
      if (hasLoggedIn) {
        setActiveToast({
          id: "login-success",
          title: "Selamat Datang! 🚀",
          message: "Anda telah berhasil masuk ke dashboard FixIt.",
          type: "SYSTEM"
        });
        sessionStorage.removeItem("fixit_logged_in");
        return;
      }

      // Check for logout query param
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has("logout")) {
        setActiveToast({
          id: "logout-success",
          title: "Sampai Jumpa! 👋",
          message: "Anda telah berhasil keluar. Sampai bertemu lagi!",
          type: "SYSTEM"
        });
        // Clear param without refresh
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };

    checkAuthNotifs();

    // 2. Poll for real notifications
    const fetchNotifs = async () => {
      try {
        const res = await fetch("/api/notifications?untoastedOnly=true");
        if (res.ok) {
          const data = await res.json();
          if (data.length > 0) {
            const latest = data[0];
            
            if (!seenIds.has(latest.id)) {
               // SMART CHECK: Don't show toast if we are already on that specific chat page
               if (latest.link && pathname + window.location.search === latest.link) {
                  // Mark as toasted (but not read) silently
                  markAsToasted(latest.id);
                  setSeenIds(prev => new Set(prev).add(latest.id));
                  return;
               }

               setActiveToast(latest);
               setSeenIds(prev => new Set(prev).add(latest.id));
               
               // Delay marking as toasted slightly to ensure it shows up correctly
               setTimeout(() => markAsToasted(latest.id), 2000);
               setTimeout(() => setActiveToast(null), 8000);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };

    // Turbo poll (2s) for better real-time feel
    const interval = setInterval(fetchNotifs, 2000);
    fetchNotifs();

    return () => clearInterval(interval);
  }, [seenIds, pathname]);

  return (
    <AnimatePresence>
      {activeToast && (
        <motion.div
          initial={{ opacity: 0, x: 100, y: -20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 100, scale: 0.9 }}
          className="fixed top-20 right-6 z-[100] max-w-[340px] w-full"
        >
          <div className="relative group">
            <Link 
              href={activeToast.link || "#"} 
              prefetch={true}
              className="block bg-slate-900/80 border border-white/10 rounded-[22px] shadow-[0_20px_40px_rgba(0,0,0,0.4)] p-3 backdrop-blur-2xl overflow-hidden ring-1 ring-white/5 cursor-pointer hover:bg-slate-800/90 transition-all active:scale-[0.98]"
            >
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-transparent to-transparent pointer-events-none" />
              
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center justify-center text-orange-500 shrink-0 group-hover:scale-110 transition-transform">
                  {activeToast.type === 'CHAT' ? <MessageSquare size={18} /> : <Bell size={18} />}
                </div>
                
                <div className="flex-grow min-w-0 pr-6">
                  <h4 className="text-[10px] font-black text-slate-100 truncate uppercase tracking-widest">{activeToast.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1 font-medium leading-tight">
                    {activeToast.message}
                  </p>
                </div>
              </div>
            </Link>

            {/* Close button outside the link for safety */}
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveToast(null);
              }}
              className="absolute top-1/2 -translate-y-1/2 right-4 z-20 text-slate-500 hover:text-slate-200 transition-colors p-1"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
