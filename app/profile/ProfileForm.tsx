"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

interface ProfileFormProps {
  initialName: string;
  initialPhone: string;
  initialAddress: string;
  initialAge: number | null;
  initialGender: string | null;
}

export default function ProfileForm({ initialName, initialPhone, initialAddress, initialAge, initialGender }: ProfileFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName || "");
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
          name,
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
    <form onSubmit={handleSave} className="space-y-6">
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

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Nomor Telepon</label>
            <input 
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0812..."
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Umur</label>
            <input 
              type="number" 
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Umur"
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Gender</label>
          <select 
            value={gender} 
            onChange={(e) => setGender(e.target.value)} 
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all appearance-none"
          >
            <option value="">Pilih</option>
            <option value="MALE">Laki-laki</option>
            <option value="FEMALE">Perempuan</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Alamat</label>
          <textarea 
            rows={3}
            value={address} 
            onChange={(e) => setAddress(e.target.value)} 
            placeholder="Alamat lengkap..."
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all resize-none"
          />
        </div>
      </div>

      {msg && (
        <div className={msg.includes("berhasil") ? "p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl text-sm" : "p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm"}>
          {msg}
        </div>
      )}

      <div className="pt-4 border-t border-slate-800">
        <Button type="submit" variant="primary" className="w-full py-3 rounded-xl font-bold" disabled={isUpdating}>
          {isUpdating ? "Menyimpan..." : "Simpan Profil"}
        </Button>
      </div>
    </form>
  );
}
