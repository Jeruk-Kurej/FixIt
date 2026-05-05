import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: paymentId } = await params;
    const cookieStore = await cookies();

    const userEmail = cookieStore.get("user_email")?.value;

    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    if (admin?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { status, adminNotes } = await req.json();


    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { order: true }
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // 1. Update Payment Status
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status,
        admin_notes: adminNotes,
        verifiedAt: new Date()
      }
    });

    // 2. If valid, update Order status
    if (status === "VALID") {
      let newPaymentStatus = payment.order.payment_status;
      let newOrderStatus = payment.order.status;

      if (payment.type === "DOWN_PAYMENT") {
        newPaymentStatus = "DP_PAID";
        // If it was PENDING/ACCEPTED, it's now officially confirmed
        if (newOrderStatus === "PENDING") newOrderStatus = "ACCEPTED";
      } else if (payment.type === "FINAL_BALANCE" || payment.type === "FULL_PAYMENT") {
        newPaymentStatus = "FULLY_PAID";
      }

      await prisma.order.update({
        where: { id: payment.order_id },
        data: {
          payment_status: newPaymentStatus,
          status: newOrderStatus
        }
      });

      // 3. Create notification for user/technician
      await prisma.notification.create({
        data: {
          user_id: payment.order.user_id,
          title: "Pembayaran Diverifikasi",
          message: `Pembayaran ${payment.type.replace("_", " ")} Anda telah diverifikasi oleh Admin. Terima kasih!`,
          type: "SYSTEM"
        }
      });
    }

    return NextResponse.json({ success: true, updatedPayment });
  } catch (err: any) {
    console.error("Verification Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
