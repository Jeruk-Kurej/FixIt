"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ApplianceType {
  id: string;
  name: string;
}

interface ProfileFormProps {
  initialData: {
    name: string;
    phone: string;
    specialties: string[]; // array of IDs
  };
  applianceTypes: ApplianceType[];
}

export default function ProfileForm({ initialData, applianceTypes }: ProfileFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialData.name || "");
  const [phone, setPhone] = useState(initialData.phone || "");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(initialData.specialties || []);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const toggleSpecialty = (id: string) => {
    setSelectedSpecialties(prev => 
      prev.includes(id) ? prev.filter(sId => sId !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/technician/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, specialties: selectedSpecialties }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan profil.");

      window.dispatchEvent(new CustomEvent("show-local-toast", {
        detail: {
          id: Date.now().toString(),
          title: "Berhasil! 🎉",
          message: "Profil Anda telah berhasil diperbarui.",
          type: "SYSTEM"
        }
      }));
      
      router.refresh();
    } catch (err: any) {
      window.dispatchEvent(new CustomEvent("show-local-toast", {
        detail: {
          id: Date.now().toString(),
          title: "Gagal Menyimpan",
          message: err.message,
          type: "SYSTEM"
        }
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Nama Lengkap</label>
          <input 
            type="text" 
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Nomor Telepon</label>
          <input 
            type="tel" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
          />
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t border-slate-800">
        <div>
          <h3 className="text-sm font-medium text-slate-300">Spesialisasi Servis</h3>
          <p className="text-xs text-slate-500 mt-1">Pilih keahlian Anda. Anda hanya akan menerima pesanan sesuai kategori ini.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {applianceTypes.map((appliance) => {
            const isSelected = selectedSpecialties.includes(appliance.id);
            return (
              <button
                key={appliance.id}
                type="button"
                onClick={() => toggleSpecialty(appliance.id)}
                className={cn(
                  "flex items-center gap-2 p-3 rounded-xl border text-left transition-all duration-200 active:scale-95",
                  isSelected 
                    ? "bg-orange-500/10 border-orange-500/50 text-orange-400" 
                    : "bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700"
                )}
              >
                <div className={cn(
                  "w-5 h-5 rounded-full flex items-center justify-center shrink-0 border",
                  isSelected ? "bg-orange-500 border-orange-500 text-white" : "border-slate-600 bg-slate-800"
                )}>
                  {isSelected && <Check size={12} strokeWidth={3} />}
                </div>
                <span className="text-[11px] font-bold uppercase tracking-widest">{appliance.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-4">
        <Button type="submit" variant="primary" className="w-full py-3 rounded-xl font-bold" disabled={isLoading}>
          {isLoading ? "Menyimpan..." : "Simpan Profil"}
        </Button>
      </div>
    </form>
  );
}
