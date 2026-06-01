"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, AlertCircle, CreditCard, ShieldCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import { formatRupiah, cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface PaymentModalContentProps {
  order: any;
  paymentType: "DOWN_PAYMENT" | "FINAL_BALANCE";
  amount: number;
  onClose: () => void;
}

export default function PaymentModalContent({ order, paymentType, amount, onClose }: PaymentModalContentProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<"IDLE" | "SUCCESS" | "ERROR">("IDLE");
  const [errorMessage, setErrorMessage] = useState("");

  // Check if there's already a valid payment for this type
  const existingPayment = order.payments?.find((p: any) => p.type === paymentType && p.status === 'VALID');
  const isPaid = !!existingPayment;

  useEffect(() => {
    // Load Midtrans Snap script
    const scriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    // We can hardcode client key for sandbox or use NEXT_PUBLIC env
    const clientKey = "Mid-client-MC1FOZsd50Hr5ENi"; 

    if (document.getElementById("midtrans-script")) return;
    const script = document.createElement("script");
    script.id = "midtrans-script";
    script.src = scriptUrl;
    script.setAttribute("data-client-key", clientKey);
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayment = async () => {
    setIsProcessing(true);
    setStatus("IDLE");
    setErrorMessage("");

    try {
      const res = await fetch("/api/payments/midtrans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          amount: Number(amount),
          type: paymentType,
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.details || errorData.error || "Gagal membuat transaksi.");
      }
      
      const data = await res.json();
      
      if (!(window as any).snap) {
        throw new Error("Sistem pembayaran belum siap, coba sesaat lagi.");
      }

      // Trigger Snap popup
      (window as any).snap.pay(data.token, {
        onSuccess: function (result: any) {
          setStatus("SUCCESS");
          setTimeout(() => {
            onClose();
            window.location.reload();
          }, 2000);
        },
        onPending: function (result: any) {
          alert("Pembayaran berhasil dibuat. Menunggu Anda menyelesaikan pembayaran.");
          onClose();
          window.location.reload();
        },
        onError: function (result: any) {
          setErrorMessage("Pembayaran gagal.");
          setStatus("ERROR");
          setIsProcessing(false);
        },
        onClose: function () {
          // User closed popup
          setIsProcessing(false);
        }
      });
      
    } catch (err: any) {
      setErrorMessage(err.message || "Terjadi kesalahan sistem.");
      setStatus("ERROR");
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {status === 'SUCCESS' ? (
        <div className="text-center py-10 animate-in zoom-in duration-500">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500 ring-4 ring-emerald-500/10">
            <CheckCircle2 size={48} />
          </div>
          <h4 className="text-xl font-black text-slate-100 mb-2">Berhasil!</h4>
          <p className="text-xs text-slate-400 font-medium">
            Pembayaran Anda telah diterima.
          </p>
        </div>
      ) : isPaid ? (
        /* READ-ONLY VIEW FOR ALREADY PAID */
        <div className="space-y-6 animate-in fade-in duration-500">
           <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 flex items-center justify-between">
              <div>
                 <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Status Pembayaran</p>
                 <p className="text-lg font-black text-slate-100 uppercase tracking-tight">Telah Diverifikasi</p>
              </div>
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                 <CheckCircle2 size={24} />
              </div>
           </div>

           <div className="bg-slate-950/50 rounded-2xl p-5 border border-slate-800">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Terbayar</p>
              <p className="text-3xl font-black text-white tracking-tight">{formatRupiah(amount)}</p>
           </div>

           <button 
             onClick={onClose}
             className="w-full py-4 mt-4 bg-slate-800 hover:bg-slate-700 rounded-2xl text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] transition-all"
           >
             Tutup Detail
           </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Amount Display */}
          <div className="bg-slate-950/50 rounded-2xl p-5 border border-slate-800 relative overflow-hidden group">
             <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Harus Dibayar</p>
             <p className="text-3xl font-black text-orange-500 tracking-tight">{formatRupiah(amount)}</p>
          </div>

          <div className="bg-slate-800/20 border border-slate-800 rounded-2xl p-6 text-center space-y-4">
             <div className="w-16 h-16 bg-slate-800/50 rounded-2xl mx-auto flex items-center justify-center text-slate-400">
                <ShieldCheck size={32} />
             </div>
             <div>
                 <h4 className="text-sm font-black text-slate-100 uppercase tracking-widest">Pembayaran Aman</h4>
                 <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                   Bayar dengan aman menggunakan Midtrans. Tersedia berbagai metode pembayaran (GoPay, Virtual Account, QRIS, dll).
                 </p>
             </div>
          </div>

          {status === 'ERROR' && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-[9px] font-bold">
              <AlertCircle size={14} />
              {errorMessage}
            </div>
          )}

          <Button 
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2"
            variant="primary"
          >
            {isProcessing ? "Memproses..." : (
              <>
                <CreditCard size={14} />
                Bayar dengan Midtrans
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
