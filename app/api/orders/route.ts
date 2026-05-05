import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { bookingSchema } from "@/lib/validations";



export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validasi menggunakan Zod
    const validationResult = bookingSchema.safeParse(body);
    
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]?.message || "Data tidak valid.";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { name, email, phone, address, appliance, brand, problem, serviceType, estimatedCost, scheduled_date_time } = validationResult.data;

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
      include: {
        memberships: { where: { status: 'ACTIVE' } }
      }
    });

    // Check if user is a premium member
    const isMember = user.memberships && user.memberships.length > 0;

    // Cari atau buat master data ApplianceType
    let appType = await prisma.applianceType.findFirst({
      where: { name: appliance }
    });
    if (!appType) {
      appType = await prisma.applianceType.create({
        data: {
          name: appliance,
          base_service_fee: 100000,
        }
      });
    }

    // 2. Daftarkan Barang Elektronik ke akun pengguna
    const newAppliance = await prisma.appliance.create({
      data: {
        user_id: user.id,
        appliance_type_id: appType.id,
        brand: brand || "General",
        model_number: "N/A",
      },
    });

    // 3. Simpan Riwayat Pesanan
    const newOrder = await prisma.order.create({
      data: {
        user_id: user.id,
        appliance_id: newAppliance.id,
        status: "PENDING",
        payment_status: isMember ? "FULLY_PAID" : "UNPAID",
        problem: problem,
        estimated_cost: estimatedCost ? parseInt(estimatedCost.toString(), 10) : 250000,
        scheduled_date_time: new Date(scheduled_date_time),
        service_type: serviceType as any,
      },
    });



    return NextResponse.json({ success: true, orderId: newOrder.id, message: "Pesanan berhasil dibuat!" }, { status: 201 });
  } catch (error) {
    console.error("Error saving order:", error);
    return NextResponse.json({ error: "Terjadi kesalahan sistem saat menyimpan pesanan." }, { status: 500 });
  }
}
