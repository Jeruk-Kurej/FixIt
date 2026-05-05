"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinksProps {
  isLoggedIn: boolean;
}

export default function NavLinks({ isLoggedIn }: NavLinksProps) {
  const pathname = usePathname();

  const links = isLoggedIn 
    ? [
        { href: "/dashboard", label: "Dashboard" },

        { href: "/chat", label: "Chat" },
        { href: "/history", label: "History" },
        { href: "/membership", label: "Membership" },

        { href: "/how-it-works", label: "How It Works" },
        { href: "/contact", label: "Contact" },


      ]

    : [
        { href: "/about-us", label: "About Us" },
        { href: "/how-it-works", label: "How It Works" },
        { href: "/membership", label: "Membership" },
        { href: "/contact", label: "Contact" },
      ];

  return (
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
  );
}
