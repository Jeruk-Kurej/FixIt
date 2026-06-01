"use client";

import { useState } from "react";
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  isBefore, 
  startOfToday 
} from "date-fns";
import { id } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PremiumCalendarProps {
  selectedDate: string; // ISO format or YYYY-MM-DD
  onChange: (date: string) => void;
  hasError?: boolean;
}

export default function PremiumCalendar({ selectedDate, onChange, hasError }: PremiumCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = startOfToday();
  const selected = selectedDate ? new Date(selectedDate) : null;

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between px-4 py-4 border-b border-slate-800 bg-slate-800/20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
            <CalendarIcon size={18} />
          </div>
          <span className="text-sm font-black text-slate-100 uppercase tracking-widest">
            {format(currentMonth, "MMMM yyyy", { locale: id })}
          </span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 hover:bg-slate-800 rounded-xl transition-all text-slate-500 hover:text-white"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-slate-800 rounded-xl transition-all text-slate-500 hover:text-white"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    return (
      <div className="grid grid-cols-7 mb-2 border-b border-slate-800/50 bg-slate-800/10">
        {days.map((day, i) => (
          <div key={i} className="py-3 text-center text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "yyyy-MM-dd");
        const cloneDay = day;
        const isPast = isBefore(day, today);
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isSelected = selected && isSameDay(day, selected);
        const isTodayDay = isSameDay(day, today);

        days.push(
          <div
            key={day.toString()}
            className={cn(
              "relative aspect-square flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group",
              !isCurrentMonth && "opacity-20",
              isPast && "cursor-not-allowed opacity-20 pointer-events-none grayscale",
              isSelected && "scale-110 z-10"
            )}
            onClick={() => !isPast && onChange(format(cloneDay, "yyyy-MM-dd"))}
          >
            {/* Selection Background */}
            <div className={cn(
               "absolute inset-1.5 rounded-2xl transition-all duration-300",
               isSelected ? "bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.4)]" : "group-hover:bg-slate-800"
            )} />

            {/* Date Number */}
            <span className={cn(
              "relative text-sm font-bold tracking-tight",
              isSelected ? "text-white" : isCurrentMonth ? "text-slate-300 group-hover:text-white" : "text-slate-600"
            )}>
              {format(day, "d")}
            </span>

            {/* Today Indicator */}
            {isTodayDay && !isSelected && (
              <div className="absolute bottom-2 w-1 h-1 rounded-full bg-orange-500 animate-pulse" />
            )}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="p-2">{rows}</div>;
  };

  return (
    <div className={cn(
      "w-full bg-slate-900/80 border rounded-[32px] shadow-2xl overflow-hidden backdrop-blur-xl transition-colors",
      hasError ? "border-red-500 bg-red-500/5" : "border-slate-800"
    )}>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      
      <div className="p-4 border-t border-slate-800/50 bg-slate-800/10 flex items-center justify-between">
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Kunjungan</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Bengkel</span>
         </div>
      </div>
    </div>
  );
}
