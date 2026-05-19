"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Button from "@/components/ui/Button";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (urlError) {
      if (urlError === "OAuthSignin") setErrorMsg("Gagal memulai login Google.");
      else if (urlError === "OAuthCallback") setErrorMsg("Gagal saat memproses data Google.");
      else if (urlError === "OAuthCreateAccount") setErrorMsg("Gagal membuat akun otomatis.");
      else if (urlError === "EmailSignin") setErrorMsg("Email tidak valid.");
      else if (urlError === "CredentialsSignin") setErrorMsg("Email atau password salah.");
      else setErrorMsg("Terjadi kesalahan sistem: " + urlError);
    }
  }, [urlError]);

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

      // Set flag for NotificationToast
      sessionStorage.setItem("fixit_logged_in", "true");

      // Redirect to consolidated dashboard
      router.push("/dashboard");
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
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => autofillUser("budi@example.com", "password_budi")}
              className="px-2 py-2 bg-slate-900/60 hover:bg-slate-900 border border-slate-700/80 rounded-xl text-[10px] font-medium text-slate-300 hover:text-orange-400 transition-all text-center"
            >
              Customer (Budi)
            </button>
            <button
              type="button"
              onClick={() => autofillUser("joko.tech@fixit.com", "password_joko")}
              className="px-2 py-2 bg-slate-900/60 hover:bg-slate-900 border border-slate-700/80 rounded-xl text-[10px] font-medium text-slate-300 hover:text-orange-400 transition-all text-center"
            >
              Teknisi (Joko)
            </button>
            <button
              type="button"
              onClick={() => autofillUser("admin@fixit.com", "password_admin")}
              className="px-2 py-2 bg-slate-900/60 hover:bg-slate-900 border border-slate-700/80 rounded-xl text-[10px] font-medium text-slate-300 hover:text-orange-400 transition-all text-center"
            >
              Admin (FixIt)
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

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-700/50"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-800/40 px-2 text-slate-500">Atau masuk dengan</span>
          </div>
        </div>

        <button
          type="button"
          disabled={isLoading}
          onClick={async () => {
            setIsLoading(true);
            try {
              const result = await signIn("google", { 
                callbackUrl: "/dashboard",
                redirect: true // We still want redirect, but let's see if we can catch anything
              });
            } catch (err) {
              setErrorMsg("Gagal menghubungkan ke Google.");
            } finally {
              setIsLoading(false);
            }
          }}
          className="w-full py-3 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center gap-3 text-slate-900 font-bold transition-all active:scale-95 shadow-lg disabled:opacity-50"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {isLoading ? "Menghubungkan..." : "Google"}
        </button>

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

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[calc(100vh-64px)] w-full flex items-center justify-center relative overflow-hidden py-12 px-4 bg-slate-900">
        <div className="text-slate-400 text-sm animate-pulse">Memuat halaman masuk...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
