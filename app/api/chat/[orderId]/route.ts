import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;

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

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // SECURITY CHECK: Verify access
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const isOwner = order.user_id === user.id;
    const isAssignedTech = order.technician_id === user.technician?.id;

    if (!isOwner && !isAssignedTech) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    // AUTO-READ: Mark all messages AND notifications FROM the other party as read
    // Using RAW SQL Template Literals for maximum reliability
    try {
      // 1. Mark Messages as read
      const affectedMessages = await prisma.$executeRaw`
        UPDATE Message 
        SET isRead = 1 
        WHERE order_id = ${orderId} 
        AND sender_id != ${user.id} 
        AND isRead = 0
      `;
      
      // 2. Mark associated Notifications as read
      const affectedNotifs = await prisma.$executeRaw`
        UPDATE Notification
        SET isRead = 1
        WHERE user_id = ${user.id}
        AND type = 'CHAT'
        AND link LIKE ${`%/chat?orderId=${orderId}%`}
        AND isRead = 0
      `;

      if (affectedMessages > 0 || affectedNotifs > 0) {
        console.log(`[CHAT-API] Auto-read: ${affectedMessages} msgs, ${affectedNotifs} notifs marked read`);
      }
    } catch (e) {
      console.error("Raw SQL Auto-read failed:", e);
    }

    const messages: any[] = await prisma.$queryRaw`
      SELECT id, order_id, sender_id, content, isRead, createdAt 
      FROM Message 
      WHERE order_id = ${orderId} 
      ORDER BY createdAt ASC
    `;

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
