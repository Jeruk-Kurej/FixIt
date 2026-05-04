"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ApplianceType } from "@prisma/client";
import { useRouter } from "next/navigation";
import StepDiagnosticsNew from "./StepDiagnosticsNew";
import StepProfileCheck from "./StepProfileCheck";
import StepSchedule from "./StepSchedule";
import StepTechnicianConfirmation from "./StepTechnicianConfirmation";

export type BookingState = {
  categoryId: string;
  categoryName: string;
  problem: string;
  serviceType: "HOME_SERVICE" | "WORKSHOP_VISIT";
  scheduledDate: Date | null;
  address: string;
  phone: string;
};

interface ServiceSelectionProps {
  categories: ApplianceType[];
  initialPhone: string;
  initialAddress: string;
}


export default function ServiceSelection({ categories, initialPhone, initialAddress }: ServiceSelectionProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 = Maju, -1 = Mundur
  const [bookingData, setBookingData] = useState<BookingState>({
    categoryId: "",
    categoryName: "",
    problem: "",
    serviceType: "HOME_SERVICE",
    scheduledDate: null,
    address: initialAddress || "",
    phone: initialPhone || "",
  });

  const nextStep = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, 4));
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  };

  const updateData = (data: Partial<BookingState>) => {
    setBookingData((prev) => ({ ...prev, ...data }));
  };

  const handleFinish = async () => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Pelanggan", // Digunakan fallback karena dibaca di api/orders via cookies/email
          email: "budi@example.com", // Ini opsional di API karena API membaca dari cookies atau session
          phone: bookingData.phone,
          address: bookingData.serviceType === "HOME_SERVICE" ? bookingData.address : null,
          appliance: bookingData.categoryName,
          brand: null,
          problem: bookingData.problem,
          serviceType: bookingData.serviceType,
          estimatedCost: 250000,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal membuat pesanan.");

      alert("Pesanan berhasil dibuat! Teknisi Supriyadi Wijaya segera berangkat.");
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    }
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
    <div className="w-full max-w-4xl mx-auto min-h-[500px] relative overflow-hidden rounded-3xl bg-slate-800/20 backdrop-blur-xl border border-slate-800/80 shadow-2xl p-6 sm:p-8">
      {/* Progress Indicator */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3, 4].map((i) => (
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
            <StepDiagnosticsNew 
              categories={categories} 
              onNext={(id, name, problem, serviceType) => {
                updateData({ categoryId: id, categoryName: name, problem, serviceType });
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
            className="w-full"
          >
            <StepProfileCheck 
              initialPhone={bookingData.phone}
              initialAddress={bookingData.address}
              serviceType={bookingData.serviceType}
              onNext={(phone, address) => {
                updateData({ phone, address });
                nextStep();
              }}
              onBack={prevStep}
            />
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full"
          >
            <StepSchedule 
              serviceType={bookingData.serviceType}
              onNext={(scheduledDate, address) => {
                updateData({ scheduledDate, address });
                nextStep();
              }}
              onBack={prevStep}
            />
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full"
          >
            <StepTechnicianConfirmation 
              categoryName={bookingData.categoryName}
              problem={bookingData.problem}
              serviceType={bookingData.serviceType}
              scheduledDate={bookingData.scheduledDate}
              address={bookingData.address}
              onBack={prevStep}
              onFinish={handleFinish}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
