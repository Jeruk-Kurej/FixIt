import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ChatHub from "@/components/features/ChatHub";

export default async function ChatPage() {
  const cookieStore = await cookies();
  const userEmail = cookieStore.get("user_email")?.value;

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

  // Fetch all orders where this user is involved (as Customer or Technician)
  const orders = await prisma.order.findMany({
    where: {
      OR: [
        { user_id: user.id },
        { technician_id: user.technician?.id }
      ],
      status: { in: ['ACCEPTED', 'WORKING', 'DONE'] }
    },
    include: {
      user: true,
      technician: { include: { user: true } },
      appliance: { include: { appliance_type: true } },
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1
      }

    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-900 text-slate-50">
      <ChatHub 
        initialOrders={JSON.parse(JSON.stringify(orders))} 
        currentUserId={user.id} 
      />
    </div>
  );
}
