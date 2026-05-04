"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";
import VerificationModal from "@/components/features/VerificationModal";


interface OrderHistoryListProps {
  orders: any[];
}

export default function OrderHistoryList({ orders }: OrderHistoryListProps) {
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  return (
    <>
      <Card className="border-slate-800 bg-slate-900/50 backdrop-blur-md h-[300px] overflow-hidden flex flex-col">
        <CardHeader className="p-4 border-b border-slate-800/50 bg-slate-800/20">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <span className="p-1 bg-orange-500/10 rounded-lg text-orange-400">📜</span>
            Riwayat Pesanan
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-y-auto custom-scrollbar flex-grow">
          {orders.length > 0 ? (
            <div className="divide-y divide-slate-800/50">
              {orders.map((order) => (
                <div key={order.id} className="p-4 flex items-center justify-between hover:bg-slate-800/20 transition-all group">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="p-2 bg-slate-800 rounded-xl text-lg shrink-0">
                      {order.status === 'DONE' ? "✅" : "🛠️"}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="font-bold text-slate-100 text-xs truncate">{order.appliance?.appliance_type?.name}</h4>
                        {order.technical_findings && (
                          <span className="flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-1.5 w-1.5 rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange-500"></span>
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">{formatDate(order.createdAt)} • {order.appliance?.brand}</p>
                      
                      {order.technical_findings && (
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="mt-1 text-[9px] font-black text-orange-500 hover:text-orange-400 underline decoration-orange-500/30 underline-offset-4 transition-all"
                        >
                           Lihat Analisis Teknis
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="text-xs font-black text-slate-100">
                      {order.estimated_cost ? `Rp ${order.estimated_cost.toLocaleString('id-ID')}` : "-"}
                    </p>
                    <span className={`text-[8px] font-black uppercase tracking-tighter ${
                      order.status === 'DONE' ? "text-green-500" : "text-orange-500"
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center text-[10px] text-slate-600 font-bold uppercase tracking-widest">
              Belum ada riwayat.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Component */}
      {selectedOrder && (
        <VerificationModal 
          order={selectedOrder} 
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)} 
        />
      )}

    </>
  );
}
