import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | number) {

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function calculateNextService(lastServiceDate: Date | string | null, membershipStartDate: Date | string) {
  const baseDate = lastServiceDate ? new Date(lastServiceDate) : new Date(membershipStartDate);
  // Tambah 3 bulan
  baseDate.setMonth(baseDate.getMonth() + 3);
  return baseDate;
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}
