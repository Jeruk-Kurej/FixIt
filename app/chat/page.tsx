import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ChatHub from "@/components/features/ChatHub";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function ChatPage({ searchParams }: { searchParams: Promise<{ orderId?: string }> }) {
  const { orderId: initialOrderId } = await searchParams;
  const session = await getServerSession(authOptions);
  const cookieStore = await cookies();
  const userEmail = session?.user?.email || cookieStore.get("user_email")?.value;

  if (!userEmail) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    include: { technician: true }
  });

  if (!user) {
    redirect("/login");
  }

  // Fetch all orders where this user is involved and a technician has been assigned
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

  // Fetch messages for each order using RAW SQL to ensure we get the isRead column
  const ordersWithCounts = await Promise.all(orders.map(async (order) => {
    const rawMessages: any[] = await prisma.$queryRaw`
      SELECT id, sender_id, content, isRead, createdAt 
      FROM Message 
      WHERE order_id = ${order.id} 
      ORDER BY createdAt DESC
    `;
    
    // In MySQL, isRead comes back as 0 or 1
    const unreadCount = rawMessages.filter(m => (m.isRead === 0 || !m.isRead) && m.sender_id !== user.id).length;
    
    return {
      ...order,
      messages: rawMessages,
      _count: { messages: unreadCount }
    };
  }));

  // 2. Sort orders by the latest message createdAt (WhatsApp style)
  const sortedOrders = ordersWithCounts.sort((a, b) => {
    const timeA = a.messages[0]?.createdAt ? new Date(a.messages[0].createdAt).getTime() : new Date(a.createdAt).getTime();
    const timeB = b.messages[0]?.createdAt ? new Date(b.messages[0].createdAt).getTime() : new Date(b.createdAt).getTime();
    return timeB - timeA;
  });

  return (
    <div className="min-h-[calc(100vh-64px)] w-full max-w-full overflow-x-hidden bg-slate-900 text-slate-50">
      <ChatHub 
        initialOrders={JSON.parse(JSON.stringify(sortedOrders))} 
        currentUserId={user.id} 
        initialSelectedOrderId={initialOrderId}
      />
    </div>
  );
}
