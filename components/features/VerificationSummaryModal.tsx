"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { X, CheckCircle2, AlertTriangle, ClipboardList, User } from "lucide-react";
import Button from "@/components/ui/Button";

interface VerificationSummaryModalProps {
  order: any;
  onClose: () => void;
}

export default function VerificationSummaryModal({ order, onClose }: VerificationSummaryModalProps) {
  const findings = order.technical_findings as string[] || [];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-800 bg-gradient-to-br from-orange-500/10 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-500 rounded-2xl text-white shadow-xl shadow-orange-500/20">
              <ClipboardList size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-50">Laporan Hasil Pengecekan</h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Order #{order.id.slice(0,8)}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          
          {/* Comparison Cards */}
          <div className="space-y-4">
             <div className="p-5 bg-slate-800/20 border border-slate-800 rounded-2xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2">
                   <AlertTriangle size={12} className="text-blue-500" />
                   Keluhan Anda (Awal)
                </p>
                <p className="text-sm text-slate-300 leading-relaxed italic">"{order.problem}"</p>
             </div>

             <div className="p-5 bg-orange-500/5 border border-orange-500/20 rounded-2xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-4 flex items-center gap-2">
                   <CheckCircle2 size={12} className="text-orange-500" />
                   Temuan Teknis Teknisi
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                   {findings.map((item) => (
                      <div key={item} className="flex items-center gap-3 p-3 bg-slate-900 border border-slate-800 rounded-xl">
                         <div className="w-5 h-5 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
                            <CheckCircle2 size={12} />
                         </div>
                         <span className="text-xs font-bold text-slate-200">{item}</span>
                      </div>
                   ))}
                </div>
             </div>
          </div>

          {/* Technician Notes */}
          {order.technical_notes && (
            <div className="p-6 bg-slate-950 rounded-2xl border-l-4 border-orange-500">
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                     <User size={14} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Analisis Teknisi</p>
               </div>
               <p className="text-sm text-slate-300 leading-relaxed italic">" {order.technical_notes} "</p>
            </div>
          )}

          <div className="p-4 bg-slate-800/10 rounded-xl text-center">
             <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                Status Pekerjaan: <span className="text-orange-400 ml-1">{order.status}</span>
             </p>
          </div>
        </div>

        <div className="p-8 border-t border-slate-800 bg-slate-800/20 flex justify-center">
          <Button onClick={onClose} variant="primary" className="w-full py-4 text-sm font-black shadow-xl shadow-orange-500/20">
            Saya Mengerti
          </Button>
        </div>
      </div>
    </div>
  );
}
