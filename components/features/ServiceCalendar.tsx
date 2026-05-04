"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Wrench, Clock, Calendar as CalendarIcon } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CalendarEvent {
  id: string;
  date: Date;
  applianceName: string;
  type: "HOME_SERVICE" | "WORKSHOP_VISIT";
  status: string;
  problem: string;
}

interface ServiceCalendarProps {
  events: CalendarEvent[];
}

export default function ServiceCalendar({ events }: ServiceCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const days = Array.from({ length: daysInMonth(year, month) }, (_, i) => i + 1);
  const offset = firstDayOfMonth(year, month);

  const getEventsForDate = (day: number) => {
    return events.filter(e => 
      e.date.getFullYear() === year && 
      e.date.getMonth() === month && 
      e.date.getDate() === day
    );
  };

  const selectedDateEvents = selectedDate 
    ? events.filter(e => 
        e.date.getFullYear() === selectedDate.getFullYear() && 
        e.date.getMonth() === selectedDate.getMonth() && 
        e.date.getDate() === selectedDate.getDate()
      )
    : [];

  return (
    <div className="flex flex-col h-full">
      <div className="bg-slate-800/40 backdrop-blur-md rounded-3xl border border-slate-700/50 overflow-hidden flex flex-col h-full shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-xl text-orange-500">
              <CalendarIcon size={18} />
            </div>
            <h3 className="text-lg font-bold text-slate-100">
              {monthNames[month]} <span className="text-slate-500 font-medium">{year}</span>
            </h3>
          </div>
          <div className="flex gap-1">
            <button onClick={prevMonth} className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400">
              <ChevronLeft size={16} />
            </button>
            <button onClick={nextMonth} className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="p-5 flex flex-col lg:flex-row gap-6 flex-grow">
          {/* Calendar Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-7 mb-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
              {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map(d => (
                <div key={d} className="text-center text-[9px] font-black uppercase tracking-widest text-slate-500 pb-2">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
              {Array.from({ length: offset }).map((_, i) => (
                <div key={`offset-${i}`} className="h-10 sm:h-12" />
              ))}
              {days.map(day => {
                const dateEvents = getEventsForDate(day);
                const isSelected = selectedDate?.getDate() === day && 
                                 selectedDate?.getMonth() === month && 
                                 selectedDate?.getFullYear() === year;
                const isToday = new Date().getDate() === day && 
                              new Date().getMonth() === month && 
                              new Date().getFullYear() === year;

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(new Date(year, month, day))}
                    className={cn(
                      "relative h-10 sm:h-12 flex flex-col items-center justify-center rounded-xl transition-all duration-300 group",
                      isSelected 
                        ? "bg-orange-500 text-white shadow-[0_8px_16px_rgba(249,115,22,0.3)] z-10" 
                        : "hover:bg-slate-700/50 text-slate-300",
                      isToday && !isSelected && "border border-orange-500/50"
                    )}
                  >
                    <span className={cn("text-xs font-bold", isSelected ? "text-white" : "group-hover:text-orange-400")}>
                      {day}
                    </span>
                    {dateEvents.length > 0 && (
                      <div className="flex gap-0.5 mt-1">
                        {dateEvents.map((e, idx) => (
                          <div 
                            key={e.id} 
                            className={cn(
                              "w-1 h-1 rounded-full",
                              isSelected ? "bg-white" : e.type === "HOME_SERVICE" ? "bg-orange-400" : "bg-blue-400"
                            )} 
                          />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-4 pt-4 border-t border-slate-700/30 flex justify-start gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Kunjungan</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Bengkel</span>
              </div>
            </div>
          </div>

          {/* Details Sidebar (Desktop) / Bottom (Mobile) */}
          <div className="lg:w-56 border-t lg:border-t-0 lg:border-l border-slate-700/50 lg:pl-6 pt-4 lg:pt-0">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">Jadwal</h4>
              <span className="text-[9px] bg-slate-900/50 px-2 py-0.5 rounded text-orange-400 font-bold border border-orange-500/20">
                {selectedDate?.getDate()} {monthNames[month].slice(0,3)}
              </span>
            </div>

            <div className="space-y-3 max-h-[180px] lg:max-h-none overflow-y-auto pr-1 custom-scrollbar">
              {selectedDateEvents.length > 0 ? (
                selectedDateEvents.map(event => (
                  <div key={event.id} className="relative bg-slate-900/50 border border-slate-800 rounded-xl p-3 hover:border-orange-500/30 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <div className={cn(
                        "p-1 rounded-md",
                        event.type === "HOME_SERVICE" ? "bg-orange-500/10 text-orange-400" : "bg-blue-500/10 text-blue-400"
                      )}>
                        {event.type === "HOME_SERVICE" ? <MapPin size={10} /> : <Wrench size={10} />}
                      </div>
                      <span className="text-[9px] font-bold text-slate-500">{event.date.getHours()}:00</span>
                    </div>
                    <h5 className="text-[11px] font-bold text-slate-200 truncate">{event.applianceName}</h5>
                    <p className="text-[9px] text-slate-500 mt-0.5 line-clamp-1">{event.problem}</p>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center bg-slate-900/20 rounded-xl border border-dashed border-slate-800">
                  <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Kosong</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
