import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { paymentId, action, adminNotes } = await req.json();

    if (!paymentId) {
      return NextResponse.json({ error: "Missing paymentId" }, { status: 400 });
    }

    if (action === "REJECT") {
      // 1. Mark payment as INVALID and add notes
      await prisma.payment.update({
        where: { id: paymentId },
        data: { 
          status: "INVALID",
          admin_notes: adminNotes || "Bukti transfer tidak valid atau kurang."
        }
      });
      
      return NextResponse.json({ success: true, message: "Payment rejected" });
    }

    // --- APPROVE LOGIC ---
    
    // 1. Update the payment status to VALID
    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: { status: "VALID", admin_notes: null },
      include: { order: true }
    });

    // 2. Update the order payment status based on payment type
    let newPaymentStatus = payment.order.payment_status;
    if (payment.type === "DOWN_PAYMENT") {
      newPaymentStatus = "DP_PAID";
    } else if (payment.type === "FINAL_BALANCE") {
      newPaymentStatus = "FULLY_PAID";
    }

    await prisma.order.update({
      where: { id: payment.order_id },
      data: { 
        payment_status: newPaymentStatus as any,
        status: (payment.type === "DOWN_PAYMENT" && payment.order.status === "PENDING") ? "ACCEPTED" : payment.order.status
      }
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Process Payment Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
