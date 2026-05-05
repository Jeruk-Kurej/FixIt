import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { order_id, content } = body;
    
    const cookieStore = await cookies();
    const userEmail = cookieStore.get("user_email")?.value;

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

    // SECURITY CHECK: Verify if the sender is the owner or the assigned technician
    const order = await prisma.order.findUnique({
      where: { id: order_id }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const isOwner = order.user_id === user.id;
    const isAssignedTech = order.technician_id === user.technician?.id;

    if (!isOwner && !isAssignedTech) {
      return NextResponse.json({ error: "Unauthorized: You don't have access to this chat." }, { status: 403 });
    }

    const newMessage = await prisma.message.create({
      data: {
        order_id,
        sender_id: user.id,
        content,
      }
    });

    // NOTIFICATION LOGIC: Notify the other party
    let recipientId = "";
    if (isOwner) {
      // Sender is owner, recipient is technician
      const tech = await prisma.technician.findUnique({
        where: { id: order.technician_id as string }
      });
      recipientId = tech?.user_id as string;
    } else {
      // Sender is technician, recipient is owner
      recipientId = order.user_id;
    }

    if (recipientId) {
      try {
        await prisma.notification.create({
          data: {
            user_id: recipientId,
            title: `Pesan baru dari ${user.name}`,
            message: content.length > 50 ? content.slice(0, 50) + "..." : content,
            link: `/chat?orderId=${order_id}`,
            type: "CHAT"
          }
        });
      } catch (notifError) {
        console.error("Failed to create notification for chat:", notifError);
        // We don't throw here so the chat message itself still succeeds
      }
    }


    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
