"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ApplianceCategory } from "@prisma/client";
import StepAppliance from "./StepAppliance";

// Tipe Data Sementara (akan dipindah ke types/index.ts nanti)
export type BookingState = {
  categoryId: string;
  categoryName: string;
  problem: string;
  serviceType: "HOME_SERVICE" | "WORKSHOP_VISIT" | null;
  scheduledDate: Date | null;
  address: string;
};

interface ServiceSelectionProps {
  categories: ApplianceCategory[];
}

export default function ServiceSelection({ categories }: ServiceSelectionProps) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 = Maju, -1 = Mundur
  const [bookingData, setBookingData] = useState<BookingState>({
    categoryId: "",
    categoryName: "",
    problem: "",
    serviceType: null,
    scheduledDate: null,
    address: "",
  });

  const nextStep = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, 5));
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  };

  const updateData = (data: Partial<BookingState>) => {
    setBookingData((prev) => ({ ...prev, ...data }));
  };

  // Konfigurasi Framer Motion untuk efek Slide-in (Vercel Style)
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 500 : -500,
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <div className="w-full max-w-3xl mx-auto min-h-[500px] relative overflow-hidden rounded-3xl bg-slate-900/50 backdrop-blur-xl border border-slate-800 shadow-2xl p-8">
      {/* Progress Indicator */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <div 
            key={i} 
            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
              i <= step ? "bg-orange-500 shadow-[0_0_10px_#F97316]" : "bg-slate-800"
            }`} 
          />
        ))}
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        {step === 1 && (
          <motion.div
            key="step1"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full"
          >
            <StepAppliance 
              categories={categories} 
              onNext={(id, name) => {
                updateData({ categoryId: id, categoryName: name });
                nextStep();
              }} 
            />
          </motion.div>
        )}
        
        {step === 2 && (
          <motion.div
            key="step2"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full flex flex-col items-center justify-center min-h-[300px]"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Langkah 2: Diagnosa Keluhan</h2>
            <p className="text-slate-400 mb-8">Anda telah memilih {bookingData.categoryName}. (Komponen ini akan segera dibangun)</p>
            <button onClick={prevStep} className="text-slate-400 hover:text-white underline">Kembali</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
