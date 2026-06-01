import prisma from "@/lib/prisma";
import { addDays, isSameDay, format, differenceInDays } from "date-fns";

export async function processSmartReminders(userId: string) {
  // 1. Get user's upcoming orders
  const orders = await prisma.order.findMany({
    where: {
      OR: [
        { user_id: userId },
        { technician: { user_id: userId } }
      ],
      // Only remind for orders that are confirmed (payment verified)
      payment_status: { in: ["DP_PAID", "FULLY_PAID"] },
      status: { in: ["ACCEPTED", "WORKING"] },
      technician_id: { not: null }
    },
    include: {
      appliance: { include: { appliance_type: true } },
      user: true,
      technician: { include: { user: true } }
    }
  });

  // 2. Proactive Membership Maintenance Reminders
  const activeMemberships = await prisma.membership.findMany({
    where: { user_id: userId, status: 'ACTIVE' }
  });

  const today = new Date();

  for (const membership of activeMemberships) {
    // Check for the latest DONE order of this appliance type
    const latestOrder = await prisma.order.findFirst({
      where: {
        user_id: userId,
        status: 'DONE',
        appliance: {
          appliance_type: {
            name: { contains: membership.appliance_name }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const lastServiceDate = latestOrder ? new Date(latestOrder.createdAt) : new Date(membership.createdAt);
    const monthsSinceLastService = (today.getTime() - lastServiceDate.getTime()) / (1000 * 60 * 60 * 24 * 30);

    if (monthsSinceLastService >= membership.frequency_months) {
      const title = "Jadwal Servis Rutin";
      const msg = `Saatnya servis rutin ${membership.appliance_name} Anda! Berdasarkan paket membership, unit ini butuh perawatan setiap ${membership.frequency_months} bulan.`;

      const notificationModel = (prisma as any).notification || (prisma as any).Notification;
      const exists = await notificationModel.findFirst({
        where: {
          user_id: userId,
          title: title,
          message: { contains: membership.appliance_name }
        }
      });

      if (!exists) {
        await notificationModel.create({
          data: {
            user_id: userId,
            title: title,
            message: msg,
            type: "INFO"
          }
        });
      }
    }
  }
  
  for (const order of orders) {
    if (!order.scheduled_date_time) continue;
    
    const scheduledDate = new Date(order.scheduled_date_time);

    const diff = differenceInDays(scheduledDate, today);

    // Logic: H-7, H-1, Day of
    let reminderTitle = "";
    let reminderMsg = "";
    let type = "REMINDER";

    if (diff === 7) {
      reminderTitle = "Reminder: 1 Minggu Lagi";
      reminderMsg = `Jadwal servis ${order.appliance?.appliance_type?.name} Anda akan dilaksanakan dalam 7 hari lagi.`;
    } else if (diff === 1) {
      reminderTitle = "Persiapan: Besok Jadwal Servis!";
      reminderMsg = `Siapkan waktu Anda! Besok adalah jadwal servis ${order.appliance?.appliance_type?.name}.`;
    } else if (diff === 0 || isSameDay(scheduledDate, today)) {
      reminderTitle = "Hari Ini: Ada Servis!";
      reminderMsg = `Jangan lupa, hari ini Anda memiliki jadwal servis ${order.appliance?.appliance_type?.name}.`;
    }


    if (reminderTitle) {
      // Check if notification already exists for this order and title to avoid duplicates
      // Extremely safe dynamic access for Turbopack compatibility
      const notificationModel = (prisma as any).notification || (prisma as any).Notification;
      
      if (!notificationModel) {
        console.warn("Prisma Notification model not yet available in runtime. Skipping sync...");
        continue;
      }

      const exists = await notificationModel.findFirst({
        where: {
          user_id: userId,
          title: reminderTitle,
          message: { contains: order.id.slice(0, 8) }
        }
      });

      if (!exists) {
        await notificationModel.create({
          data: {
            user_id: userId,
            title: reminderTitle,
            message: `${reminderMsg} (Order #${order.id.slice(0, 8)})`,
            type: "REMINDER"
          }
        });
      }
    }




  }
}

export function getGoogleCalendarUrl(order: any) {
  const title = `Servis ${order.appliance?.appliance_type?.name} - FixIt`;
  const details = `Detail Pesanan: #${order.id}\nPelanggan: ${order.user?.name}\nMasalah: ${order.problem}\n\nSync by FixIt Platform`;
  const location = order.user?.address || "Alamat Pelanggan";
  
  const start = new Date(order.scheduled_date_time || new Date());
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // Default 2 hours

  
  const formatGCalDate = (date: Date) => format(date, "yyyyMMdd'T'HHmmss'Z'");
  
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}&dates=${formatGCalDate(start)}/${formatGCalDate(end)}`;
}
