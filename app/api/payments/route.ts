import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userEmail = cookieStore.get("user_email")?.value;

    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, amount, type, proofUrl } = await req.json();

    if (!orderId || !amount || !type) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    // 1. Create payment record
    const payment = await prisma.payment.create({
      data: {
        order_id: orderId,
        amount,
        type,
        proof_url: proofUrl,
        status: "PENDING"
      }
    });

    // 2. We don't update order status yet. 
    // It will be updated by ADMIN after verification.

    return NextResponse.json({ success: true, payment });
  } catch (err: any) {
    console.error("Payment API Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  // Only for ADMIN to see all pending payments
  try {
    const cookieStore = await cookies();
    const userEmail = cookieStore.get("user_email")?.value;

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
