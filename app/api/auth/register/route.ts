import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Semua kolom wajib diisi." }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email ini sudah terdaftar." }, { status: 400 });
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        role: "CUSTOMER",
      },
    });

    const response = NextResponse.json({ success: true, message: "Pendaftaran berhasil" });
    response.cookies.set("user_email", newUser.email, { path: "/", maxAge: 60 * 60 * 24 * 7 }); // 7 hari
    return response;
  } catch (err: any) {
    return NextResponse.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}
