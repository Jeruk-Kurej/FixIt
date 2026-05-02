"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

interface ProfileEditorProps {
  initialPhone: string;
  initialAddress: string;
}

export default function ProfileEditor({ initialPhone, initialAddress }: ProfileEditorProps) {
  const router = useRouter();
  const [phone, setPhone] = useState(initialPhone || "");
  const [address, setAddress] = useState(initialAddress || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setMsg("");

    try {
      const res = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, address }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal memperbarui profil.");

      setMsg("Profil Anda berhasil diperbarui!");
      router.refresh();
    } catch (err: any) {
      setMsg(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-4 pt-2">
      <div className="space-y-1">
        <label className="text-xs text-slate-400 font-semibold uppercase">Nomor HP</label>
        <input 
          type="tel" 
          value={phone} 
          onChange={(e) => setPhone(e.target.value)} 
          placeholder="Contoh: 081234567890"
          className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-orange-500 outline-none text-sm transition-all"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs text-slate-400 font-semibold uppercase">Alamat Utama</label>
        <textarea 
          rows={2}
          value={address} 
          onChange={(e) => setAddress(e.target.value)} 
          placeholder="Jalan, RT/RW, Komplek perumahan, No rumah..."
          className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-orange-500 outline-none text-sm transition-all"
        />
      </div>

      {msg && (
        <p className={`text-xs ${msg.includes("berhasil") ? "text-emerald-400" : "text-red-400"}`}>
          {msg}
        </p>
      )}

      <Button type="submit" variant="primary" size="sm" className="w-full font-semibold" disabled={isUpdating}>
        {isUpdating ? "Menyimpan..." : "Simpan Perubahan"}
      </Button>
    </form>
  );
}
