import React from "react";
import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  href,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const baseClass = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:opacity-50 disabled:pointer-events-none";
  
  const variantClasses = {
    primary: "bg-orange-600 text-white hover:bg-orange-500 shadow-sm",
    secondary: "bg-slate-700 text-slate-100 hover:bg-slate-600 shadow-sm",
    outline: "border border-slate-600 text-slate-300 hover:bg-slate-800",
    ghost: "text-slate-300 hover:text-orange-500 hover:bg-slate-800/50",
  };
  
  const sizeClasses = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 py-2 text-sm",
    lg: "h-12 px-8 text-base",
  };

  const combinedClasses = `${baseClass} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
}
