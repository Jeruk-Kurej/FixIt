import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { iris } from "@/lib/midtrans";

export async function POST(req: NextRequest) {
  try {
    const notification = await req.json();

    // Verify signature
    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    const hash = crypto
      .createHash("sha512")
      .update(
        notification.order_id +
        notification.status_code +
        notification.gross_amount +
        serverKey
      )
      .digest("hex");

    if (hash !== notification.signature_key) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }

    const { order_id, transaction_status, fraud_status } = notification;

    const payment = await prisma.payment.findFirst({
      where: { midtrans_id: order_id }
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    let statusToUpdate = payment.status;
    let paymentVerifiedAt = payment.verifiedAt;

    if (transaction_status == 'capture') {
      if (fraud_status == 'challenge') {
        statusToUpdate = "PENDING";
      } else if (fraud_status == 'accept') {
        statusToUpdate = "VALID";
        paymentVerifiedAt = new Date();
      }
    } else if (transaction_status == 'settlement') {
      statusToUpdate = "VALID";
      paymentVerifiedAt = new Date();
    } else if (transaction_status == 'cancel' || transaction_status == 'deny' || transaction_status == 'expire') {
      statusToUpdate = "INVALID";
    } else if (transaction_status == 'pending') {
      statusToUpdate = "PENDING";
    }

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: statusToUpdate,
        verifiedAt: paymentVerifiedAt
      }
    });

    if (statusToUpdate === "VALID") {
      let orderPaymentStatus: "DP_PAID" | "FULLY_PAID" | "UNPAID" = "UNPAID";
      if (payment.type === "DOWN_PAYMENT") {
        orderPaymentStatus = "DP_PAID";
      } else if (payment.type === "FINAL_BALANCE" || payment.type === "FULL_PAYMENT") {
        orderPaymentStatus = "FULLY_PAID";
      }
      
      await prisma.order.update({
        where: { id: payment.order_id },
        data: { payment_status: orderPaymentStatus }
      });
      
      // Auto-Payout logic using IRIS if FULLY_PAID and order is DONE
      // Normally, payout happens when Order status becomes DONE (trigger from technician), 
      // but if we want to do it here for full payments directly, we can check.
      // In this system, we'll probably make a separate endpoint to trigger payout when order is completed.
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
