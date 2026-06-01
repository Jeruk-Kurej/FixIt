import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import Button from "./Button";
import NavLinks from "./NavLinks";
import NotificationHub from "../features/NotificationHub";


import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import LogoutButton from "./LogoutButton";

export default async function Navbar() {
  const session = await getServerSession(authOptions);
  const cookieStore = await cookies();
  
  const manualEmail = cookieStore.get("user_email")?.value;
  const manualRole = cookieStore.get("user_role")?.value;

  const isLoggedIn = !!session || !!manualEmail;
  const userRole = (session?.user as any)?.role || manualRole;


  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center shrink-0 lg:w-[180px] justify-start">
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
        
        {/* Mobile Notification Hub */}
        {isLoggedIn && (
          <div className="md:hidden flex items-center shrink-0 mr-1">
            <NotificationHub />
          </div>
        )}

        {/* Navigation Links */}
        <NavLinks isLoggedIn={isLoggedIn} role={userRole} />

        {/* Action Buttons (Desktop Only) */}
        <div className="hidden md:flex items-center space-x-3 shrink-0 lg:w-[180px] justify-end">
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
            <>
              <NotificationHub />
              <LogoutButton />
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
