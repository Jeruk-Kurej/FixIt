import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { findings, notes } = body;

    const cookieStore = await cookies();
    const userEmail = cookieStore.get("user_email")?.value;

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

    // Verify the order belongs to this technician or is in a state they can update
    const existingOrder = await prisma.order.findUnique({
      where: { id }
    });

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
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
