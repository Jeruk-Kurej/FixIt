"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

interface ProfileEditorProps {
  initialPhone: string;
  initialAddress: string;
  initialAge: number | null;
  initialGender: string | null;
}

export default function ProfileEditor({ initialPhone, initialAddress, initialAge, initialGender }: ProfileEditorProps) {
  const router = useRouter();
  const [phone, setPhone] = useState(initialPhone || "");
  const [address, setAddress] = useState(initialAddress || "");
  const [age, setAge] = useState(initialAge ? String(initialAge) : "");
  const [gender, setGender] = useState(initialGender || "");
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
        body: JSON.stringify({ 
          phone, 
          address, 
          age: age ? parseInt(age) : null, 
          gender 
        }),
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
    <form onSubmit={handleSave} className="space-y-6 pt-2">
      <div className="grid grid-cols-2 gap-3">

        <div className="space-y-1">
          <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Umur</label>
          <input 
            type="number" 
            value={age} 
            onChange={(e) => setAge(e.target.value)} 
            placeholder="Umur"
            className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-orange-500 outline-none text-xs transition-all"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Gender</label>
          <select 
            value={gender} 
            onChange={(e) => setGender(e.target.value)} 
            className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-orange-500 outline-none text-xs transition-all appearance-none"
          >
            <option value="">Pilih</option>
            <option value="MALE">Laki-laki</option>
            <option value="FEMALE">Perempuan</option>
          </select>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Nomor HP</label>
        <input 
          type="tel" 
          value={phone} 
          onChange={(e) => setPhone(e.target.value)} 
          placeholder="0812..."
          className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-orange-500 outline-none text-xs transition-all"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Alamat</label>
        <textarea 
          rows={2}
          value={address} 
          onChange={(e) => setAddress(e.target.value)} 
          placeholder="Alamat lengkap..."
          className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:border-orange-500 outline-none text-xs transition-all resize-none"
        />
      </div>

      {msg && (
        <p className={`text-[10px] font-bold ${msg.includes("berhasil") ? "text-emerald-400" : "text-red-400"}`}>
          {msg}
        </p>
      )}

      <Button type="submit" variant="primary" size="sm" className="w-full font-black uppercase text-[10px] py-3 tracking-widest" disabled={isUpdating}>
        {isUpdating ? "Processing..." : "Simpan Profil"}
      </Button>
    </form>
  );
}
