"use client";

import { useState, useEffect } from "react";
import { X, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import PaymentModalContent from "./PaymentModalContent";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
  paymentType: "DOWN_PAYMENT" | "FINAL_BALANCE";
  amount: number;
}

export default function PaymentModal({ isOpen, onClose, order, paymentType, amount }: PaymentModalProps) {
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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500 border border-orange-500/20">
               <Wallet size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-100 uppercase tracking-tight leading-none">
                {paymentType === 'DOWN_PAYMENT' ? 'Bayar DP' : 'Pelunasan'}
              </h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1.5">
                Order #{order.id.slice(0, 8)}
              </p>
            </div>
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
