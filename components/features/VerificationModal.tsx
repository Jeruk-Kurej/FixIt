"use client";

import { useEffect } from "react";

import { X, CheckCircle2, ClipboardList, User, ShieldCheck, ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface VerificationModalProps {
  order: any;
  onClose: () => void;
  isOpen: boolean;
}

export default function VerificationModal({ order, onClose, isOpen }: VerificationModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const findings = order.technical_findings as string[] || [];


  return (
    <>
      {/* Backdrop with Heavy Blur */}
      <div 
        className={cn(
          "fixed inset-0 z-[110] bg-slate-950/80 backdrop-blur-md transition-opacity duration-500",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Centered Modal Content */}
      <div 
        className={cn(
          "fixed inset-0 z-[120] flex items-center justify-center p-6 sm:p-12 pointer-events-none transition-all duration-500",
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}
      >
        <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] rounded-[40px] pointer-events-auto overflow-hidden flex flex-col max-h-[85vh]">
          
          {/* Header - Glassmorphism style */}
          <div className="p-8 border-b border-slate-800 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent shrink-0 relative">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-orange-500 rounded-3xl text-white shadow-2xl shadow-orange-500/20">
                  <ClipboardList size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-50 tracking-tight">Analisis Teknis</h2>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-1">Order #{order.id.slice(0,8)}</p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="p-3 hover:bg-slate-800 rounded-2xl text-slate-500 transition-all hover:text-slate-100 border border-transparent hover:border-slate-700"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-grow overflow-y-auto custom-scrollbar p-8 sm:p-12 space-y-10">
            
            {/* Comparison Flow */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
               {/* Decorative Arrow for desktop */}
               <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-slate-800 border border-slate-700 items-center justify-center text-orange-500">
                  <ArrowRight size={20} />
               </div>

               <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Laporan Anda</p>
                  </div>
                  <div className="p-6 bg-slate-950/50 border border-slate-800 rounded-3xl min-h-[120px] flex items-center justify-center">
                     <p className="text-sm text-slate-400 italic text-center leading-relaxed">"{order.problem}"</p>
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                     <p className="text-[10px] font-black uppercase tracking-widest text-orange-500">Temuan Teknisi</p>
                  </div>
                  <div className="space-y-2">
                     {findings.map((item) => (
                        <div key={item} className="flex items-center gap-3 p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl">
                           <ShieldCheck size={16} className="text-orange-500 shrink-0" />
                           <span className="text-xs font-bold text-slate-200">{item}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Note Block */}
            {order.technical_notes && (
              <div className="p-8 bg-slate-800/30 rounded-[32px] border-l-4 border-orange-500 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                    <User size={60} />
                 </div>
                 <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                       <User size={14} />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Insight Teknisi</p>
                 </div>
                 <p className="text-sm text-slate-300 leading-relaxed italic relative z-10 pr-10">
                   " {order.technical_notes} "
                 </p>
              </div>
            )}
          </div>

          {/* Footer actions */}
          <div className="p-8 border-t border-slate-800 bg-slate-800/20 shrink-0 flex items-center justify-between gap-4">
            <div className="hidden sm:block">
               <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Dianalisis oleh</p>
               <p className="text-xs font-black text-slate-200">{order.technician?.user?.name || "Joko Teknisi"}</p>
            </div>
            <Button onClick={onClose} variant="primary" className="flex-grow sm:flex-initial px-10 py-4 text-sm font-black shadow-2xl shadow-orange-500/20 rounded-2xl">
              Tutup & Lanjutkan
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
