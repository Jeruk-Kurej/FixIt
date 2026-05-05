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

import { format } from "date-fns";

export function getGoogleCalendarUrl(order: any) {
  const title = `Servis ${order.appliance?.appliance_type?.name} - FixIt`;
  const details = `Detail Pesanan: #${order.id}\nPelanggan: ${order.user?.name}\nMasalah: ${order.problem}\n\nSync by FixIt Platform`;
  const location = order.user?.address || "Alamat Pelanggan";
  
  const start = new Date(order.scheduled_date_time || new Date());
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // Default 2 hours
  
  const formatGCalDate = (date: Date) => format(date, "yyyyMMdd'T'HHmmss'Z'");
  
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}&dates=${formatGCalDate(start)}/${formatGCalDate(end)}`;
}
