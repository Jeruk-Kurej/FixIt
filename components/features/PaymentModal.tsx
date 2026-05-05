"use client";

import { useState } from "react";
import { X, Upload, CheckCircle2, AlertCircle, Copy, ExternalLink } from "lucide-react";
import Button from "@/components/ui/Button";
import { formatRupiah } from "@/lib/utils";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  paymentType: "DOWN_PAYMENT" | "FINAL_BALANCE";
  amount: number;
}

export default function PaymentModal({ isOpen, onClose, order, paymentType, amount }: PaymentModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [proofUrl, setProofUrl] = useState("");
  const [status, setStatus] = useState<"IDLE" | "SUCCESS" | "ERROR">("IDLE");

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofUrl(URL.createObjectURL(file)); // Show preview
    }
  };

  const handleUpload = async () => {
    if (!proofUrl) {
      alert("Pilih bukti transfer dulu bro!");
      return;
    }

    setIsUploading(true);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          amount,
          type: paymentType,
          proofUrl: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg" // Simulated URL for MVP
        })
      });

      if (!res.ok) throw new Error("Gagal mengirim bukti.");
      
      setStatus("SUCCESS");
      setTimeout(() => {
        onClose();
        window.location.href = '/dashboard'; // Force refresh
      }, 2000);
    } catch (err) {
      setStatus("ERROR");
    } finally {
      setIsUploading(false);
    }
  };


  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-gradient-to-br from-orange-500/10 to-transparent flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-100 uppercase tracking-tight">
              {paymentType === 'DOWN_PAYMENT' ? 'Bayar Komitmen (DP)' : 'Pelunasan Servis'}
            </h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
              Order #{order.id.slice(0, 8)}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-xl transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="p-8">
          {status === 'SUCCESS' ? (
            <div className="text-center py-10 animate-in zoom-in duration-500">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500">
                <CheckCircle2 size={48} />
              </div>
              <h4 className="text-xl font-black text-slate-100 mb-2">Berhasil Terkirim!</h4>
              <p className="text-sm text-slate-400">Bukti pembayaran Anda sedang diverifikasi oleh Admin. Mohon tunggu sebentar.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Payment Info */}
              <div className="bg-slate-800/40 rounded-2xl p-5 border border-slate-800/50">
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Harus Dibayar</p>
                 <p className="text-3xl font-black text-orange-500">{formatRupiah(amount)}</p>
              </div>

              {/* Bank Details */}
              <div className="space-y-3">
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-1">Tujuan Transfer</p>
                 <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800 flex items-center justify-between group">
                    <div>
                       <p className="text-[9px] font-black text-slate-600 uppercase">Bank BCA (Admin FixIt)</p>
                       <p className="text-sm font-black text-slate-100">801 0293 8812</p>
                    </div>
                    <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 transition-all">
                       <Copy size={16} />
                    </button>
                 </div>
                 <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800 flex items-center justify-between">
                    <div>
                       <p className="text-[9px] font-black text-slate-600 uppercase">E-Wallet QRIS</p>
                       <p className="text-sm font-black text-slate-100 italic">Scan QR on Site</p>
                    </div>
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-slate-500">
                       <ExternalLink size={16} />
                    </div>
                 </div>
              </div>

              {/* Upload Section */}
              <div className="space-y-3 pt-4">
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-1">Upload Bukti Transfer</p>
                 <label className="relative border-2 border-dashed border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all cursor-pointer group overflow-hidden">
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                    
                    {proofUrl ? (
                      <div className="w-full h-32 relative rounded-xl overflow-hidden">
                         <img src={proofUrl} alt="Proof" className="w-full h-full object-cover" />
                         <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-[10px] font-black text-white uppercase">Ganti File</p>
                         </div>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-slate-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
                           <Upload size={24} />
                        </div>
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest group-hover:text-slate-400">Klik untuk memilih file</p>
                      </>
                    )}
                 </label>
              </div>


              {status === 'ERROR' && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-xs">
                  <AlertCircle size={14} />
                  Gagal mengirim. Coba lagi.
                </div>
              )}

              <Button 
                onClick={handleUpload}
                disabled={isUploading}
                className="w-full py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-orange-500/10"
                variant="primary"
              >
                {isUploading ? 'Sedang Mengirim...' : 'Kirim Bukti Pembayaran'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
