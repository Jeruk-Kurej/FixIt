import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email dan password wajib diisi." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "Pengguna tidak ditemukan." }, { status: 404 });
    }

    if (user.password !== password) {
      return NextResponse.json({ error: "Password salah." }, { status: 401 });
    }

    // Untuk simplicity di MVP ini, password langsung dicocokkan (plain text) 
    // atau jika Anda ingin menambahkan bcrypt nanti.
    const response = NextResponse.json({ 
      success: true, 
      message: "Login berhasil",
      user: {
        role: user.role,
        email: user.email
      }
    });
    response.cookies.set("user_email", user.email || "", { path: "/", maxAge: 60 * 60 * 24 * 7 }); // 7 hari
    response.cookies.set("user_role", user.role, { path: "/", maxAge: 60 * 60 * 24 * 7 }); // 7 hari


    return response;
  } catch (err: any) {
    return NextResponse.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}
