import { z } from "zod";

export const bookingSchema = z.object({
  name: z.string().min(3, "Nama lengkap minimal 3 karakter."),
  email: z.string().email("Format email tidak valid."),
  phone: z.string().min(10, "Nomor HP minimal 10 digit.").max(15, "Nomor HP maksimal 15 digit."),
  serviceType: z.enum(["HOME_SERVICE", "WORKSHOP_VISIT"], {
    message: "Pilih metode layanan yang valid."
  }),
  address: z.string().optional().nullable(),
  appliance: z.string().min(1, "Jenis barang elektronik wajib diisi."),
  brand: z.string().optional().nullable(),
  problem: z.string().min(1, "Keluhan utama wajib diisi."),
  estimatedCost: z.string().optional().nullable(),
  scheduled_date_time: z.string().min(1, "Jadwal servis wajib dipilih."),
}).refine((data) => {
  // Jika Home Service, alamat WAJIB diisi
  if (data.serviceType === "HOME_SERVICE" && (!data.address || data.address.trim() === "")) {
    return false;
  }
  return true;
}, {
  message: "Alamat lengkap wajib diisi untuk layanan panggilan (Home Service).",
  path: ["address"]
});
