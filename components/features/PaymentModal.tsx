"use client";

import { useState, useEffect } from "react";
import { X, Upload, CheckCircle2, AlertCircle, Copy, ExternalLink, CreditCard, QrCode, Check } from "lucide-react";
import Button from "@/components/ui/Button";
import { formatRupiah, cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  paymentType: "DOWN_PAYMENT" | "FINAL_BALANCE";
  amount: number;
}

export default function PaymentModal({ isOpen, onClose, order, paymentType, amount }: PaymentModalProps) {
  const [activeTab, setActiveTab] = useState<"BANK" | "QRIS">("BANK");
  const [isCopied, setIsCopied] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [proofUrl, setProofUrl] = useState("");
  const [status, setStatus] = useState<"IDLE" | "SUCCESS" | "ERROR">("IDLE");
  const [errorMessage, setErrorMessage] = useState("");

  // Body Scroll Lock
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

  // Handle Copy to Clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText("80102938812");
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setProofUrl(URL.createObjectURL(selectedFile)); // Show preview
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setProofUrl("");
    const input = document.getElementById('proof-upload-input') as HTMLInputElement;
    if (input) input.value = '';
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

      // Local File Upload Logic
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
      console.error("Payment Error:", err);
      setErrorMessage(err.message || "Terjadi kesalahan sistem. Coba lagi nanti.");
      setStatus("ERROR");
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 isolate">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md cursor-pointer"
        onClick={onClose}
      />

      {/* Modal Content */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-[32px] shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-100 uppercase tracking-tight">
              {paymentType === 'DOWN_PAYMENT' ? 'Bayar Komitmen (DP)' : 'Pelunasan Servis'}
            </h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
              Order #{order.id.slice(0, 8)}
            </p>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-slate-800/50 hover:bg-slate-800 rounded-full border border-slate-800 transition-all">
            <X size={18} className="text-slate-400" />
          </button>
        </div>

        <div className="p-8">
          {status === 'SUCCESS' ? (
            <div className="text-center py-10 animate-in zoom-in duration-500">
              <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500 ring-4 ring-emerald-500/10">
                <CheckCircle2 size={56} />
              </div>
              <h4 className="text-2xl font-black text-slate-100 mb-2">Berhasil!</h4>
              <p className="text-sm text-slate-400 font-medium">
                {activeTab === 'QRIS' ? 'Pembayaran QRIS sedang divalidasi.' : 'Bukti transfer terkirim. Admin akan memverifikasi secepatnya.'}
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Amount Display */}
              <div className="bg-slate-950/50 rounded-3xl p-6 border border-slate-800 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <CreditCard size={60} />
                 </div>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Total Harus Dibayar</p>
                 <p className="text-4xl font-black text-orange-500 tracking-tight">{formatRupiah(amount)}</p>
              </div>

              {/* Payment Method Tabs */}
              <div className="space-y-4">
                 <div className="flex p-1 bg-slate-950 border border-slate-800 rounded-2xl">
                    <button 
                       onClick={() => setActiveTab("BANK")}
                       className={cn(
                          "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                          activeTab === 'BANK' ? "bg-slate-800 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
                       )}
                    >
                       <CreditCard size={14} />
                       Transfer Bank
                    </button>
                    <button 
                       onClick={() => setActiveTab("QRIS")}
                       className={cn(
                          "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                          activeTab === 'QRIS' ? "bg-slate-800 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"
                       )}
                    >
                       <QrCode size={14} />
                       Scan QRIS
                    </button>
                 </div>

                 {/* Content Area */}
                 <div className="relative">
                    <AnimatePresence mode="wait">
                        <motion.div 
                          key={activeTab}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                        >
                          {activeTab === 'BANK' ? (
                              <div className="p-4 bg-slate-800/20 border border-slate-800 rounded-2xl flex items-center justify-between group">
                                <div>
                                    <p className="text-[9px] font-black text-slate-600 uppercase mb-1">Bank BCA (Admin FixIt)</p>
                                    <p className="text-base font-black text-slate-100 tracking-tight">801 0293 8812</p>
                                </div>
                                <button 
                                    onClick={handleCopy}
                                    className={cn(
                                      "p-2.5 rounded-xl transition-all border flex items-center gap-2",
                                      isCopied ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
                                    )}
                                >
                                    {isCopied ? <Check size={14} /> : <Copy size={14} />}
                                    {isCopied && <span className="text-[9px] font-black uppercase">Copied!</span>}
                                </button>
                              </div>
                          ) : (
                              <div className="flex flex-col items-center gap-3 py-4 p-4 bg-white rounded-[24px] border border-slate-800 shadow-xl">
                                <div className="w-32 h-32 bg-slate-100 rounded-xl flex items-center justify-center border-2 border-slate-200">
                                    <QrCode size={100} className="text-slate-900" />
                                </div>
                                <div className="text-center">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">FixIt Payment Gateway</p>
                                    <p className="text-[11px] font-black text-slate-900">Scan QR Code untuk bayar instan</p>
                                </div>
                              </div>
                          )}
                        </motion.div>
                    </AnimatePresence>
                 </div>
              </div>

              {/* Upload Section - ONLY FOR BANK */}
              <AnimatePresence>
                {activeTab === 'BANK' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center justify-between px-1">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Upload Bukti Transfer</p>
                        {proofUrl && (
                          <button 
                            onClick={handleRemoveFile} 
                            className="text-[9px] font-black text-red-400 hover:text-red-500 transition-colors uppercase cursor-pointer"
                          >
                            Hapus
                          </button>
                        )}
                    </div>
                    <label className="relative border-2 border-dashed border-slate-800 rounded-[24px] p-6 flex flex-col items-center justify-center gap-3 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all cursor-pointer group overflow-hidden bg-slate-950/20">
                        <input 
                          id="proof-upload-input"
                          type="file" 
                          className="hidden" 
                          onChange={handleFileChange}
                          accept="image/*"
                        />
                        
                        {proofUrl ? (
                          <div className="w-full h-32 relative rounded-xl overflow-hidden">
                            <img src={proofUrl} alt="Proof" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                <p className="text-[10px] font-black text-white uppercase tracking-widest bg-slate-800 px-4 py-2 rounded-full border border-slate-700">Ganti File</p>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 group-hover:bg-orange-500 group-hover:text-white transition-all shadow-xl group-hover:shadow-orange-500/20">
                              <Upload size={24} />
                            </div>
                            <div className="text-center">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-300 mb-1">Klik untuk memilih file</p>
                              <p className="text-[8px] text-slate-600 font-bold uppercase tracking-tight">JPG, PNG atau PDF (Max 5MB)</p>
                            </div>
                          </>
                        )}
                    </label>
                  </motion.div>
                )}
              </AnimatePresence>

              {status === 'ERROR' && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-[10px] font-bold">
                  <AlertCircle size={16} />
                  {errorMessage}
                </div>
              )}

              <Button 
                onClick={handleUpload}
                disabled={isUploading || (activeTab === 'BANK' && !file)}
                className={cn(
                  "w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-[0.98]",
                  activeTab === 'QRIS' ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20" : "bg-orange-500 hover:bg-orange-600 shadow-orange-500/20"
                )}
                variant="primary"
              >
                {isUploading ? (
                   <div className="flex items-center gap-3">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Memproses...</span>
                   </div>
                ) : (
                  activeTab === 'QRIS' ? 'Konfirmasi Sudah Bayar' : 'Kirim Bukti Pembayaran'
                )}
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
