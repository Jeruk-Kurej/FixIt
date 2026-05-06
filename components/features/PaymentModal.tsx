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
           <PaymentModalContent 
             order={order} 
             amount={amount} 
             paymentType={paymentType} 
             onClose={onClose} 
           />
        </div>
      </motion.div>
    </div>
  );
}
