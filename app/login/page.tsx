"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal masuk.");

      // Check if logged in user is a technician
      if (email.includes("tech")) {
        router.push("/technician/dashboard");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const autofillUser = (e: string, p: string) => {
    setEmail(e);
    setPassword(p);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] w-full flex items-center justify-center relative overflow-hidden py-12 px-4">
      {/* Background Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-md bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-2xl p-8 relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-50 mb-2">Selamat Datang</h1>
          <p className="text-slate-400 text-sm">Masuk untuk mengelola jadwal servis Anda</p>
        </div>

        <div className="mb-6 p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex flex-col gap-2">
          <p className="text-xs font-semibold text-orange-400 uppercase tracking-wider">Quick Login Dummy (Demo)</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => autofillUser("budi@example.com", "password_budi")}
              className="px-3 py-2 bg-slate-900/60 hover:bg-slate-900 border border-slate-700/80 rounded-xl text-xs font-medium text-slate-300 hover:text-orange-400 transition-all text-center"
            >
              Customer (Budi)
            </button>
            <button
              type="button"
              onClick={() => autofillUser("joko.tech@fixit.com", "password_joko")}
              className="px-3 py-2 bg-slate-900/60 hover:bg-slate-900 border border-slate-700/80 rounded-xl text-xs font-medium text-slate-300 hover:text-orange-400 transition-all text-center"
            >
              Teknisi (Joko)
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="budi@example.com" 
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-300">Password</label>
              <Link href="#" className="text-xs text-orange-500 hover:text-orange-400 transition-colors">
                Lupa password?
              </Link>
            </div>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
            />
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm">
              {errorMsg}
            </div>
          )}

          <Button type="submit" variant="primary" className="w-full py-3 rounded-xl font-semibold mt-4" disabled={isLoading}>
            {isLoading ? "Memproses..." : "Masuk ke FixIt"}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-400">
          Belum punya akun?{" "}
          <Link href="/register" className="text-orange-500 hover:text-orange-400 font-medium transition-colors">
            Daftar Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
}
