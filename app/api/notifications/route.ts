import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const untoastedOnly = searchParams.get("untoastedOnly") === "true";
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

  // Use RAW SQL to ensure we get the isToastShown column correctly
  let query = 'SELECT * FROM Notification WHERE user_id = ?';
  const params: any[] = [user.id];

  if (unreadOnly) {
    query += ' AND isRead = 0';
  }
  if (untoastedOnly) {
    query += ' AND isToastShown = 0';
  }

  query += ' ORDER BY createdAt DESC LIMIT 20';

  const notifications = await prisma.$queryRawUnsafe(query, ...params);

  return NextResponse.json(notifications);
}

export async function PATCH(request: Request) {
  const cookieStore = await cookies();
  const userEmail = cookieStore.get("user_email")?.value;

  if (!userEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, isRead, isToastShown } = await request.json();

  if (isRead !== undefined) {
    await prisma.$executeRaw`UPDATE Notification SET isRead = ${isRead ? 1 : 0} WHERE id = ${id}`;
  }
  if (isToastShown !== undefined) {
    await prisma.$executeRaw`UPDATE Notification SET isToastShown = ${isToastShown ? 1 : 0} WHERE id = ${id}`;
  }

  return NextResponse.json({ success: true });
}
