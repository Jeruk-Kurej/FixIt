import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const unreadOnly = searchParams.get("unreadOnly") === "true";

  const cookieStore = await cookies();
  const userEmail = cookieStore.get("user_email")?.value;

  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const notificationModel = (prisma as any).notification || (prisma as any).Notification;
  if (!notificationModel) {
    return NextResponse.json([]);
  }

  const where: any = { user_id: user.id };
  if (unreadOnly) {
    where.isRead = false;
  }

  const notifications = await notificationModel.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 20,
  });




  return NextResponse.json(notifications);
}

export async function PATCH(request: Request) {
  const cookieStore = await cookies();
  const userEmail = cookieStore.get("user_email")?.value;

  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await request.json();

  const notificationModel = (prisma as any).notification || (prisma as any).Notification;
  if (!notificationModel) {
    return NextResponse.json({ success: false });
  }

  await notificationModel.update({
    where: { id },
    data: { isRead: true },
  });




  return NextResponse.json({ success: true });
}
