import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";


import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email || req.cookies.get("user_email")?.value;

    if (!userEmail) {
      return NextResponse.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        age: true,
        gender: true,
        role: true,
        appliances: {
          include: {
            appliance_type: true,
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "Pengguna tidak ditemukan." }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    return NextResponse.json({ error: "Terjadi kesalahan server saat mengambil profil." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email || req.cookies.get("user_email")?.value;

    if (!userEmail) {
      return NextResponse.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 });
    }

    const body = await req.json();
    const { name, phone, address, age, gender } = body;

    const user = await prisma.user.update({
      where: { email: userEmail },
      data: {
        name: name || undefined,
        phone: phone || null,
        address: address || null,
        age: age ? parseInt(age) : null,
        gender: gender || null,
      },
    });


    return NextResponse.json({ success: true, user });
  } catch (err: any) {
    return NextResponse.json({ error: "Terjadi kesalahan server saat memperbarui profil." }, { status: 500 });
  }
}
