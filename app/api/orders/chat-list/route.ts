import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
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

    // Fetch same list as ChatPage
    const orders = await prisma.order.findMany({
      where: {
        OR: [
          { user_id: user.id },
          { technician_id: user.technician?.id || "" }
        ],
        status: { in: ['ACCEPTED', 'WORKING', 'DONE'] },
        technician_id: { not: null }
      },
      include: {
        user: true,
        technician: { include: { user: true } },
        appliance: { include: { appliance_type: true } },
      },
      orderBy: { createdAt: 'desc' }
    });

    const ordersWithCounts = await Promise.all(orders.map(async (order) => {
      const rawMessages: any[] = await prisma.$queryRaw`
        SELECT id, sender_id, content, isRead, createdAt 
        FROM Message 
        WHERE order_id = ${order.id} 
        ORDER BY createdAt DESC
      `;
      
      const unreadCount = rawMessages.filter(m => (m.isRead === 0 || !m.isRead) && m.sender_id !== user.id).length;
      
      return {
        ...order,
        messages: rawMessages,
        _count: { messages: unreadCount }
      };
    }));

    // Sort by latest message (WhatsApp style)
    const sortedOrders = ordersWithCounts.sort((a, b) => {
      const timeA = a.messages[0]?.createdAt ? new Date(a.messages[0].createdAt).getTime() : new Date(a.createdAt).getTime();
      const timeB = b.messages[0]?.createdAt ? new Date(b.messages[0].createdAt).getTime() : new Date(b.createdAt).getTime();
      return timeB - timeA;
    });

    return NextResponse.json(sortedOrders);
  } catch (error) {
    console.error("Error fetching chat list:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
