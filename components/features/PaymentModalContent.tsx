"use client";

import { useState } from "react";
import { Upload, CheckCircle2, AlertCircle, Copy, CreditCard, QrCode, Check } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState<"BANK" | "QRIS">("BANK");
  const [isCopied, setIsCopied] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [proofUrl, setProofUrl] = useState("");
  const [status, setStatus] = useState<"IDLE" | "SUCCESS" | "ERROR">("IDLE");
  const [errorMessage, setErrorMessage] = useState("");

  const handleCopy = () => {
    navigator.clipboard.writeText("80102938812");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setProofUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setProofUrl("");
  };

  const handleUpload = async () => {
    if (activeTab === 'BANK' && !file) {
      alert("Harap upload bukti transfer bank Anda bro!");
      return;
    }

    setIsUploading(true);
    setStatus("IDLE");
    setErrorMessage("");

    try {
      let uploadedUrl = null;

      if (activeTab === 'BANK' && file) {
        const formData = new FormData();
        formData.append("file", file);
        
        const uploadRes = await fetch(`/api/upload`, {
          method: "POST",
          body: formData
        });

        if (!uploadRes.ok) throw new Error("Gagal mengunggah file ke server lokal.");
        const uploadData = await uploadRes.json();
        uploadedUrl = uploadData.url;
      }

      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          amount: Number(amount),
          type: paymentType,
          method: activeTab,
          proofUrl: uploadedUrl
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.details || errorData.error || "Gagal menyimpan data pembayaran.");
      }
      
      setStatus("SUCCESS");
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 2000);
    } catch (err: any) {
      setErrorMessage(err.message || "Terjadi kesalahan sistem.");
      setStatus("ERROR");
    } finally {
      setIsUploading(false);
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
            {activeTab === 'QRIS' ? 'Pembayaran QRIS sedang divalidasi.' : 'Bukti transfer terkirim. Admin akan memverifikasi.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Amount Display */}
          <div className="bg-slate-950/50 rounded-2xl p-5 border border-slate-800 relative overflow-hidden group">
             <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Harus Dibayar</p>
             <p className="text-3xl font-black text-orange-500 tracking-tight">{formatRupiah(amount)}</p>
          </div>

          {/* Payment Method Tabs */}
          <div className="space-y-4">
             <div className="flex p-1 bg-slate-950 border border-slate-800 rounded-2xl">
                <button 
                   onClick={() => setActiveTab("BANK")}
                   className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                      activeTab === 'BANK' ? "bg-slate-800 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
                   )}
                >
                   <CreditCard size={12} />
                   Transfer Bank
                </button>
                <button 
                   onClick={() => setActiveTab("QRIS")}
                   className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                      activeTab === 'QRIS' ? "bg-slate-800 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
                   )}
                >
                   <QrCode size={12} />
                   Scan QRIS
                </button>
             </div>

             <div className="relative">
                <AnimatePresence mode="wait">
                    <motion.div 
                      key={activeTab}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.15 }}
                    >
                      {activeTab === 'BANK' ? (
                          <div className="p-4 bg-slate-800/20 border border-slate-800 rounded-2xl flex items-center justify-between">
                            <div>
                                <p className="text-[8px] font-black text-slate-600 uppercase mb-0.5">Bank BCA (Admin FixIt)</p>
                                <p className="text-sm font-black text-slate-100 tracking-tight">801 0293 8812</p>
                            </div>
                            <button 
                                onClick={handleCopy}
                                className={cn(
                                  "p-2 rounded-xl border flex items-center gap-2 transition-all",
                                  isCopied ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-slate-800 border-slate-700 text-slate-400"
                                )}
                            >
                                {isCopied ? <Check size={12} /> : <Copy size={12} />}
                            </button>
                          </div>
                      ) : (
                          <div className="flex flex-col items-center gap-2 py-4 p-4 bg-white rounded-2xl border border-slate-800">
                            <div className="w-24 h-24 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200">
                                <QrCode size={80} className="text-slate-900" />
                            </div>
                            <p className="text-[10px] font-black text-slate-900">Scan QR Code untuk bayar</p>
                          </div>
                      )}
                    </motion.div>
                </AnimatePresence>
             </div>
          </div>

          {activeTab === 'BANK' && (
            <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Upload Bukti Transfer</p>
                    {proofUrl && (
                      <button onClick={handleRemoveFile} className="text-[8px] font-black text-red-400 uppercase">Hapus</button>
                    )}
                </div>
                <label className="border-2 border-dashed border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all cursor-pointer bg-slate-950/20">
                    <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                    {proofUrl ? (
                      <img src={proofUrl} alt="Proof" className="w-full h-24 object-cover rounded-lg" />
                    ) : (
                      <>
                        <Upload size={16} className="text-slate-500" />
                        <p className="text-[8px] font-black text-slate-500 uppercase">Klik untuk upload bukti</p>
                      </>
                    )}
                </label>
            </div>
          )}

          {status === 'ERROR' && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-[9px] font-bold">
              <AlertCircle size={14} />
              {errorMessage}
            </div>
          )}

          <Button 
            onClick={handleUpload}
            disabled={isUploading || (activeTab === 'BANK' && !file)}
            className="w-full py-3.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em]"
            variant="primary"
          >
            {isUploading ? "Memproses..." : "Kirim Pembayaran"}
          </Button>
        </div>
      )}
    </div>
  );
}
