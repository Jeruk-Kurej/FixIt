import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";


export async function POST(req: NextRequest) {
  try {
    const userEmail = req.cookies.get("user_email")?.value;

    if (!userEmail) {
      return NextResponse.json({ error: "Silakan login terlebih dahulu." }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: { technician: true },
    });

    if (!user || user.role !== "TECHNICIAN") {
      return NextResponse.json({ error: "Hanya teknisi yang dapat menerima pesanan." }, { status: 403 });
    }

    // Get the corresponding technician record
    let tech = user.technician;
    if (!tech) {
      tech = await prisma.technician.create({
        data: {
          user_id: user.id,
          rating: 4.8,
          is_available: true,
        },
      });
    }

    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "ID pesanan wajib disertakan." }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: "Pesanan tidak ditemukan." }, { status: 404 });
    }

    if (order.status !== "PENDING") {
      return NextResponse.json({ error: "Pesanan ini sudah diproses atau dibatalkan." }, { status: 400 });
    }

    // SECURITY CHECK: Only allow acceptance if payment is verified (DP or Full)
    if (order.payment_status !== "DP_PAID" && order.payment_status !== "FULLY_PAID") {
      return NextResponse.json({ error: "Pesanan belum divalidasi pembayarannya oleh Admin." }, { status: 403 });
    }

    // Update the order to ACCEPTED
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "ACCEPTED",
        technician_id: tech.id,
      },
    });

    return NextResponse.json({ success: true, message: "Pesanan berhasil diterima!", order: updatedOrder });
  } catch (err: any) {
    console.error("Accept order error:", err);
    return NextResponse.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}
