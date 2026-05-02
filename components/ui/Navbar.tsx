import Image from "next/image";
import Link from "next/link";
import Button from "./Button";

export default function Navbar() {
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
          <Link href="/layanan" className="text-sm font-medium text-slate-300 hover:text-orange-500 transition-colors">
            Layanan
          </Link>
          <Link href="/membership" className="text-sm font-medium text-slate-300 hover:text-orange-500 transition-colors">
            Membership
          </Link>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-3 shrink-0">
          <Button href="/login" variant="ghost">
            Masuk
          </Button>
          <Button href="/register" variant="primary">
            Daftar
          </Button>
        </div>
      </div>
    </nav>
  );
}
