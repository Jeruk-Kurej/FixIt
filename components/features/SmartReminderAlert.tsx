"use client";

import { Bell, Clock, Calendar, ArrowRight, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { differenceInDays, isSameDay } from "date-fns";

interface SmartReminderAlertProps {
  orders: any[];
}

export default function SmartReminderAlert({ orders }: SmartReminderAlertProps) {
  const [activeReminder, setActiveReminder] = useState<any | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const today = new Date();
    // Find if there's any order today or tomorrow
    const urgentOrder = orders.find(o => {
      if (!o.scheduled_date_time) return false;
      const scheduledDate = new Date(o.scheduled_date_time);
      const diff = differenceInDays(scheduledDate, today);
      return (diff === 0 || diff === 1) && o.status !== 'DONE' && o.status !== 'CANCELLED';
    });

    if (urgentOrder) {
      setActiveReminder(urgentOrder);
    }
  }, [orders]);

  if (!activeReminder || !activeReminder.scheduled_date_time || !isVisible) return null;

  const isToday = isSameDay(new Date(activeReminder.scheduled_date_time), new Date());

  return (
    <div className="mb-6 animate-in slide-in-from-top duration-500">
      <div className={cn(
        "relative overflow-hidden p-6 rounded-[32px] border-2 flex items-center justify-between gap-6 shadow-2xl backdrop-blur-xl",
        isToday 
          ? "bg-orange-500/10 border-orange-500/30 text-orange-400" 
          : "bg-blue-500/10 border-blue-500/30 text-blue-400"
      )}>
        {/* Animated Background Pulse */}
        <div className={cn(
          "absolute -right-20 -top-20 w-64 h-64 blur-[100px] rounded-full opacity-20 animate-pulse",
          isToday ? "bg-orange-500" : "bg-blue-500"
        )} />

        <div className="flex items-center gap-6 relative z-10">
          <div className={cn(
            "w-16 h-16 rounded-[24px] flex items-center justify-center shadow-lg shrink-0",
            isToday ? "bg-orange-500 text-white" : "bg-blue-500 text-white"
          )}>
            {isToday ? <Bell size={32} className="animate-bounce" /> : <Clock size={32} />}
          </div>
          
          <div>
            <h3 className="text-xl font-black tracking-tight mb-1">
              {isToday ? "🔥 Ada Servis Hari Ini!" : "📅 Besok Ada Servis!"}
            </h3>
            <p className="text-sm font-medium opacity-80 max-w-lg">
              Jadwal servis <span className="font-black underline">{activeReminder.appliance?.appliance_type?.name || "Perangkat"}</span> {isToday ? 'sebentar lagi akan' : 'besok bakal'} dilaksanakan. Jangan lupa siapkan waktu ya!
            </p>
          </div>
        </div>


        <div className="flex items-center gap-3 relative z-10">
           <button 
             onClick={() => setIsVisible(false)}
             className="p-3 hover:bg-white/10 rounded-2xl transition-all"
           >
              <X size={20} />
           </button>
        </div>
      </div>
    </div>
  );
}
