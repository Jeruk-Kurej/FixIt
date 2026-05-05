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

    const { orderId, rating, comment } = await req.json();

    if (!orderId || !rating) {
      return NextResponse.json({ error: "Data review tidak lengkap." }, { status: 400 });
    }

    // 1. Verify order belongs to user and is DONE
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true, technician: true }
    });

    if (!order || order.user.email !== userEmail) {
      return NextResponse.json({ error: "Pesanan tidak ditemukan." }, { status: 404 });
    }

    if (order.status !== 'DONE') {
      return NextResponse.json({ error: "Pesanan belum selesai." }, { status: 400 });
    }

    if (!order.technician_id) {
      return NextResponse.json({ error: "Teknisi tidak ditemukan pada pesanan ini." }, { status: 400 });
    }

    // 2. Create Review
    const review = await prisma.review.create({
      data: {
        order_id: orderId,
        technician_id: order.technician_id,
        user_id: order.user_id,
        rating: parseInt(rating),
        comment: comment || "",
      }
    });

    // 3. Recalculate Technician Rating
    const allReviews = await prisma.review.findMany({
      where: { technician_id: order.technician_id },
      select: { rating: true }
    });

    const averageRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await prisma.technician.update({
      where: { id: order.technician_id },
      data: { rating: averageRating }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Terima kasih! Review Anda telah disimpan.",
      averageRating: averageRating.toFixed(1)
    });

  } catch (err: any) {
    console.error("Review Error:", err);
    return NextResponse.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}
