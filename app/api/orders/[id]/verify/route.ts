import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;
    const { findings, notes, additionalCost } = await req.json();
    
    const session = await getServerSession(authOptions);
    const cookieStore = await cookies();
    const userEmail = session?.user?.email || cookieStore.get("user_email")?.value;

    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: { technician: true }
    });

    if (!user || user.role !== "TECHNICIAN" || !user.technician) {
      return NextResponse.json({ error: "Forbidden - Technician only" }, { status: 403 });
    }

    // Verify the order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const finalTotal = (existingOrder.estimated_cost || 0) + (Number(additionalCost) || 0);

    // LOGIC: If there is additional cost, the order is no longer "FULLY_PAID" 
    // (even if it was before due to initial full payment).
    // We must reset it to DP_PAID so the user can pay the remaining balance.
    const newPaymentStatus = Number(additionalCost) > 0 ? "DP_PAID" : existingOrder.payment_status;

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        technical_findings: findings,
        technical_notes: notes,
        final_cost: finalTotal,
        payment_status: newPaymentStatus as any,
        status: "WORKING"
      }
    });

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    console.error("Error verifying order:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
