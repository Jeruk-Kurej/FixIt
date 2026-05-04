import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { bookingSchema } from "@/lib/validations";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validasi menggunakan Zod
    const validationResult = bookingSchema.safeParse(body);
    
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]?.message || "Data tidak valid.";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { name, email, phone, address, appliance, brand, problem, serviceType, estimatedCost } = validationResult.data;

    // 1. Cari atau Buat Akun Pengguna (berdasarkan Email)
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name,
        phone: phone || "",
        address: address || "",
      },
      create: {
        name,
        email,
        password: "password123", // fallback password
        phone: phone || "",
        address: address || "",
      },
    });

    // Cari atau buat master data ApplianceType
    let appType = await prisma.applianceType.findFirst({
      where: { name: appliance }
    });
    if (!appType) {
      appType = await prisma.applianceType.create({
        data: {
          name: appliance,
          baseServiceFee: 100000,
          iconUrl: "https://assets3.lottiefiles.com/packages/lf20_Q895iE.json"
        }
      });
    }

    // 2. Daftarkan Barang Elektronik ke akun pengguna
    const newAppliance = await prisma.appliance.create({
      data: {
        userId: user.id,
        applianceTypeId: appType.id,
        brand: brand || "General",
        modelNumber: "N/A",
      },
    });

    // 3. Simpan Riwayat Pesanan
    const newOrder = await prisma.order.create({
      data: {
        userId: user.id,
        applianceId: newAppliance.id,
        status: "PENDING",
        problemDescription: problem,
        estimatedCost: estimatedCost ? parseInt(estimatedCost.toString(), 10) : 250000,
        scheduledDateTime: new Date(),
      },
    });

    return NextResponse.json({ success: true, orderId: newOrder.id, message: "Pesanan berhasil dibuat!" }, { status: 201 });
  } catch (error) {
    console.error("Error saving order:", error);
    return NextResponse.json({ error: "Terjadi kesalahan sistem saat menyimpan pesanan." }, { status: 500 });
  }
}
