import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import Button from "./Button";

export default async function Navbar() {
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get("user_email")?.value;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center shrink-0">
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
        <div className="hidden md:flex items-center justify-center space-x-8 flex-1 px-8">
          <Link href="/" className="text-sm font-medium text-slate-300 hover:text-orange-500 transition-colors">
            Beranda
          </Link>
          <Link href="/book" className="text-sm font-medium text-slate-300 hover:text-orange-500 transition-colors">
            Booking
          </Link>
          <Link href="/membership" className="text-sm font-medium text-slate-300 hover:text-orange-500 transition-colors">
            Membership
          </Link>
          {isLoggedIn && (
            <Link href="/dashboard" className="text-sm font-medium text-slate-300 hover:text-orange-500 transition-colors">
              Dashboard
            </Link>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-3 shrink-0">
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
            <Button href="/api/auth/logout" variant="outline" className="border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-slate-100">
              Keluar
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
