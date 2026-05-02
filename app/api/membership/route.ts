import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const userEmail = req.cookies.get("user_email")?.value;

    if (!userEmail) {
      return NextResponse.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return NextResponse.json({ error: "Pengguna tidak ditemukan." }, { status: 404 });
    }

    // Buat membership baru yang aktif selama 3 bulan
    const now = new Date();
    const endDate = new Date();
    endDate.setMonth(now.getMonth() + 3);

    const membership = await prisma.membership.create({
      data: {
        userId: user.id,
        status: "ACTIVE",
        startDate: now,
        endDate: endDate,
      },
    });

    return NextResponse.json({ success: true, membership });
  } catch (err: any) {
    return NextResponse.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}
