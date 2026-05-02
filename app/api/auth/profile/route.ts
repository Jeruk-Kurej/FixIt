import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PATCH(req: NextRequest) {
  try {
    const userEmail = req.cookies.get("user_email")?.value;

    if (!userEmail) {
      return NextResponse.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 });
    }

    const body = await req.json();
    const { phone, address } = body;

    const user = await prisma.user.update({
      where: { email: userEmail },
      data: {
        phone: phone || null,
        address: address || null,
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    return NextResponse.json({ error: "Terjadi kesalahan server saat memperbarui profil." }, { status: 500 });
  }
}
