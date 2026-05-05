import prisma from "@/lib/prisma";

async function check() {
  console.log("Models in Prisma:", Object.keys(prisma));
  try {
    const count = await (prisma as any).notification.count();
    console.log("Notification count:", count);
  } catch (e) {
    console.log("Notification model NOT FOUND in prisma object");
  }
}

check();
