"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { signOut } from "next-auth/react";

interface NavLinksProps {
  isLoggedIn: boolean;
  role?: string;
}

export default function NavLinks({ isLoggedIn, role }: NavLinksProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  let links = isLoggedIn 
    ? [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/chat", label: "Chat" },
        { href: "/history", label: "History" },
        ...(role !== 'TECHNICIAN' ? [{ href: "/membership", label: "Membership" }] : []),
        { href: "/how-it-works", label: "How It Works" },
        { href: "/contact", label: "Contact" },
      ]
    : [
        { href: "/about-us", label: "About Us" },
        { href: "/how-it-works", label: "How It Works" },
        { href: "/membership", label: "Membership" },
        { href: "/contact", label: "Contact" },
      ];

  if (role === 'ADMIN') {
    links = [
      { href: "/dashboard", label: "Dashboard" }
    ];
  }

  return (
    <>
      {/* Desktop Navigation Links */}
      <div className="hidden md:flex items-center justify-center gap-x-8 gap-8 flex-1">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-all ${
                isActive
                  ? "text-orange-500 border-b-2 border-orange-500 pb-1"
                  : "text-slate-300 hover:text-orange-400"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* Mobile Hamburger Button */}
      <div className="md:hidden flex items-center justify-end flex-1 px-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-slate-300 hover:text-orange-500 p-2 focus:outline-none transition-colors rounded-lg bg-slate-800/40 border border-slate-700/50"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-slate-900 border-b border-slate-800 shadow-xl z-50 animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col p-4 space-y-3">
            {links.map((link) => {
              const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-sm font-semibold py-2 px-3 rounded-lg transition-all ${
                    isActive
                      ? "text-orange-500 bg-orange-500/10"
                      : "text-slate-300 hover:text-orange-400 hover:bg-slate-800/50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Divider */}
            <div className="h-px bg-slate-800/85 my-2" />

            {/* Mobile Auth Buttons */}
            {!isLoggedIn ? (
              <div className="flex flex-col gap-2 pt-1">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl text-xs font-bold border border-slate-700 bg-slate-800/40 text-slate-300 hover:bg-slate-800 transition-all"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl text-xs font-bold bg-orange-500 text-white hover:bg-orange-600 shadow-md shadow-orange-500/10 transition-all"
                >
                  Daftar
                </Link>
              </div>
            ) : (
              <div className="pt-1">
                <button
                  onClick={async () => {
                    setIsOpen(false);
                    await signOut({ redirect: false });
                    window.location.href = "/api/auth/logout?redirect=/?logout=true";
                  }}
                  className="w-full text-center py-2.5 rounded-xl text-xs font-bold border border-red-500/30 bg-red-500/5 text-red-400 hover:bg-red-500/10 transition-all"
                >
                  Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
