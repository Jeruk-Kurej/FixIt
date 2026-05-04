"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { useRouter } from "next/navigation";

interface ActiveTasksListProps {
  orders: any[];
}

export default function ActiveTasksList({ orders }: ActiveTasksListProps) {
  const router = useRouter();


  return (
    <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-md h-[250px] overflow-hidden flex flex-col">
      <CardHeader className="p-4 border-b border-slate-800/50 bg-slate-800/20">
        <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">
          Tugas Aktif ({orders.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 overflow-y-auto custom-scrollbar flex-grow">
        {orders.length > 0 ? (
          orders.map(order => (
            <div key={order.id} className="p-4 border-b border-slate-800/50 flex items-center justify-between group hover:bg-slate-800/20">
              <div>
                <p className="text-xs font-bold text-slate-200">{order.appliance?.appliance_type?.name}</p>
                <p className="text-[9px] text-slate-500">{order.user?.name}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[9px] px-2 py-0.5 rounded font-black uppercase border ${
                  order.status === 'DONE' 
                    ? "bg-blue-500/10 text-blue-400 border-blue-500/20" 
                    : "bg-green-500/10 text-green-400 border-green-500/20"
                }`}>
                  {order.status}
                </span>
                
                {order.status !== 'DONE' && (
                  <button 
                    onClick={() => router.push(`/technician/verify/${order.id}`)}
                    className="text-[10px] font-black text-orange-500 hover:text-orange-400 underline decoration-orange-500/30 underline-offset-4 transition-all"
                  >
                    {order.technical_findings ? "Update Verifikasi" : "Verifikasi"}
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-10 text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest">
            Belum ada tugas aktif.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

