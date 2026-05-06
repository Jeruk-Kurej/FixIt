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
    const { findings, notes } = await req.json();
    
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

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        technical_findings: findings,
        technical_notes: notes,
        status: "WORKING"
      }
    });

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    console.error("Error verifying order:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
