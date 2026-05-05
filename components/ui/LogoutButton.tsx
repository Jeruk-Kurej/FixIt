"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  const handleLogout = async () => {
    // 1. Sign out from NextAuth (Google)
    await signOut({ redirect: false });
    
    // 2. The manual logout route will be called to clear cookies and redirect
    window.location.href = "/api/auth/logout?redirect=/?logout=true";
  };

  return (
    <button 
      onClick={handleLogout}
      className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:opacity-50 disabled:pointer-events-none h-10 px-4 py-2 text-sm border border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-slate-100"
    >
      Keluar
    </button>
  );
}
