import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email || req.cookies.get("user_email")?.value;

    if (!userEmail) {
      return NextResponse.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 });
    }

    const { appliance, frequency, price } = await req.json();

    if (!appliance || !frequency) {
      return NextResponse.json({ error: "Data paket tidak lengkap." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan." }, { status: 404 });
    }

    // Create a membership record (status is PENDING until admin verifies payment)
    const membership = await prisma.membership.create({
      data: {
        user_id: user.id,
        appliance_name: appliance,
        frequency_months: frequency,
        status: "PENDING"
      }
    });

    // In a real escrow system, we'd wait for admin verification.
    // For this demo, let's also create a manual notification for the admin.
    await prisma.notification.create({
      data: {
        user_id: user.id,
        title: "Pendaftaran Membership",
        message: `Pendaftaran membership Smart Care ${appliance} berhasil diajukan. Silakan lakukan pembayaran Rp ${price.toLocaleString('id-ID')} agar layanan aktif.`,
        type: "INFO"
      }
    });

    return NextResponse.json({ 
      success: true, 
      membershipId: membership.id,
      message: "Membership diajukan. Menunggu verifikasi pembayaran." 
    });

  } catch (err: any) {
    console.error("Membership Error:", err);
    return NextResponse.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}
