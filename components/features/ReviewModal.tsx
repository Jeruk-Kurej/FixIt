"use client";

import { useState } from "react";
import { X, Star, MessageSquare, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

export default function ReviewModal({ isOpen, onClose, order }: ReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          rating,
          comment
        }),
      });

      if (res.ok) {
        alert("Terima kasih atas ulasannya!");
        onClose();
        window.location.reload();
      } else {
        const data = await res.json();
        alert(data.error || "Gagal mengirim ulasan.");
      }
    } catch (err) {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-[32px] shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-xl text-orange-500">
               <Star size={20} />
            </div>
            <div>
               <h3 className="text-lg font-black text-white">Beri Ulasan</h3>
               <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{order.appliance?.appliance_type?.name}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Rating Stars */}
          <div className="flex flex-col items-center gap-4">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Kualitas Layanan</p>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="transition-all duration-200 transform hover:scale-125"
                >
                  <Star 
                    size={36} 
                    className={cn(
                      "transition-all",
                      (hover || rating) >= star 
                        ? "fill-orange-500 text-orange-500" 
                        : "fill-transparent text-slate-700"
                    )} 
                  />
                </button>
              ))}
            </div>
            <p className="text-sm font-black text-white">
              {rating === 5 ? "Sangat Puas! 😍" : 
               rating === 4 ? "Puas Banget! 🙂" :
               rating === 3 ? "Biasa Saja 😐" :
               rating === 2 ? "Kurang Puas 😕" : "Kecewa 😞"}
            </p>
          </div>

          {/* Comment Area */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <MessageSquare size={12} />
              Komentar (Opsional)
            </label>
            <textarea 
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ceritakan pengalaman Anda..."
              className="w-full h-32 bg-slate-800/50 border border-slate-700 rounded-2xl p-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-orange-500/50 transition-all resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-950/50 border-t border-slate-800">
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-orange-500/20 disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send size={16} />
                Kirim Ulasan
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
