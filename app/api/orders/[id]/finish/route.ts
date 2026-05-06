import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Get the order with payments
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payments: true }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 2. Check if there's any remaining balance
    // DP is usually 50,000. If final_cost is 50,000 or less, it's considered paid.
    const totalPaid = order.payments
      .filter(p => p.status === 'VALID')
      .reduce((sum, p) => sum + p.amount, 0);

    const balance = (order.final_cost || order.estimated_cost) - totalPaid;

    if (balance > 0) {
      return NextResponse.json({ 
        error: "Masih ada sisa pelunasan yang harus dibayar.",
        balance 
      }, { status: 400 });
    }

    // 3. Mark as DONE
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { 
        status: "DONE",
        payment_status: "FULLY_PAID"
      }
    });

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    console.error("Error finishing order:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
