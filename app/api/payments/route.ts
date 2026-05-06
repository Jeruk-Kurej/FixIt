import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const cookieStore = await cookies();
    const userEmail = session?.user?.email || cookieStore.get("user_email")?.value;

    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, amount, type, method, proofUrl } = await req.json();

    if (!orderId || !amount || !type) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    // 1. Create payment record
    const payment = await prisma.payment.create({
      data: {
        order_id: orderId,
        amount,
        type,
        method,
        proof_url: proofUrl,
        status: "PENDING"
      }
    });

    // 2. We don't update order status yet. 
    // It will be updated by ADMIN after verification.

    return NextResponse.json({ success: true, payment });
  } catch (err: any) {
    console.error("❌ Payment API Error Details:", {
      message: err.message,
      stack: err.stack,
      code: err.code
    });
    return NextResponse.json({ 
      error: "Gagal menyimpan ke database", 
      details: err.message 
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  // Only for ADMIN to see all pending payments
  try {
    const session = await getServerSession(authOptions);
    const cookieStore = await cookies();
    const userEmail = session?.user?.email || cookieStore.get("user_email")?.value;

    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const payments = await prisma.payment.findMany({
      where: { status: "PENDING" },
      include: {
        order: {
          include: {
            user: true,
            appliance: { include: { appliance_type: true } }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json(payments);
  } catch (err: any) {
    return NextResponse.json({ error: "Error fetching payments" }, { status: 500 });
  }
}
