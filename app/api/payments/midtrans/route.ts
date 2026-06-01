import { NextRequest, NextResponse } from "next/server";
import { snap } from "@/lib/midtrans";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, amount, type } = await req.json();

    if (!orderId || !amount || !type) {
      return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true, appliance: { include: { appliance_type: true } } }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Generate unique transaction id for midtrans
    const midtransOrderId = `${orderId}-${type}-${Date.now()}`;

    // Create Snap transaction
    const parameter = {
      transaction_details: {
        order_id: midtransOrderId,
        gross_amount: amount,
      },
      customer_details: {
        first_name: order.user.name || "Customer",
        email: order.user.email,
        phone: order.user.phone || "",
      },
      item_details: [
        {
          id: order.id,
          price: amount,
          quantity: 1,
          name: `Pembayaran ${type} - ${order.appliance.appliance_type.name}`
        }
      ]
    };

    const transaction = await snap.createTransaction(parameter);

    // Save payment intent in DB with status PENDING
    const payment = await prisma.payment.create({
      data: {
        order_id: orderId,
        amount,
        type,
        status: "PENDING",
        midtrans_id: midtransOrderId,
        method: "MIDTRANS"
      }
    });

    return NextResponse.json({
      success: true,
      token: transaction.token,
      redirect_url: transaction.redirect_url,
      paymentId: payment.id,
    });
  } catch (error: any) {
    console.error("Midtrans Error:", error);
    return NextResponse.json({ error: "Gagal memproses pembayaran" }, { status: 500 });
  }
}
