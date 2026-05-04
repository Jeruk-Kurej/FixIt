import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import Button from "./Button";
import NavLinks from "./NavLinks";

export default async function Navbar() {
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get("user_email")?.value;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center shrink-0 w-[180px] justify-start">
          <Link href="/" className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo/logo-fixit.png"
              alt="FixIt Logo"
              style={{ height: '40px', width: 'auto', objectFit: 'contain' }}
              className="h-10 w-auto object-contain"
            />
          </Link>
        </div>
        
        {/* Navigation Links */}
        <NavLinks isLoggedIn={isLoggedIn} />
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-3 shrink-0 w-[180px] justify-end">
          {!isLoggedIn ? (
            <>
              <Button href="/login" variant="ghost">
                Masuk
              </Button>
              <Button href="/register" variant="primary">
                Daftar
              </Button>
            </>
          ) : (
            <a href="/api/auth/logout" className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:opacity-50 disabled:pointer-events-none h-10 px-4 py-2 text-sm border border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-slate-100">
              Keluar
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
