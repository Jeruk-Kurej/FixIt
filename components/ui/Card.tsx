import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`rounded-2xl border border-slate-700/50 bg-slate-800/40 backdrop-blur-md shadow-sm overflow-hidden transition-all hover:shadow-md ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }: CardProps) {
  return (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "" }: CardProps) {
  return (
    <h3 className={`font-semibold leading-none tracking-tight text-slate-100 ${className}`}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className = "" }: CardProps) {
  return (
    <div className={`p-6 pt-0 text-slate-400 ${className}`}>
      {children}
    </div>
  );
}
