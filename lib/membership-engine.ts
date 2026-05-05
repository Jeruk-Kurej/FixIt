import prisma from "./prisma";
import { addMonths } from "date-fns";

export async function activateMembership(membershipId: string) {
  try {
    const membership = await prisma.membership.findUnique({
      where: { id: membershipId },
      include: { user: true }
    });

    if (!membership || membership.status !== 'PENDING') return;

    // 1. Update Membership Status
    console.log("Activating membership:", membershipId);
    await prisma.membership.update({
      where: { id: membershipId },
      data: { status: 'ACTIVE' }
    });

    // 2. Find Appliance Type ID
    // Look for exact match first, then partial
    let applianceType = await prisma.applianceType.findFirst({
      where: { name: membership.appliance_name }
    });

    if (!applianceType) {
      applianceType = await prisma.applianceType.findFirst({
        where: { name: { contains: membership.appliance_name } }
      });
    }

    if (!applianceType) {
      // Fallback to General Maintenance if still not found
      applianceType = await prisma.applianceType.findFirst({
        where: { name: { contains: "Service" } }
      });
    }

    if (!applianceType) {
      console.error("No appliance type found at all, even fallback.");
      return;
    }
    console.log("Using appliance type:", applianceType.name);



    // 3. Create a dummy Appliance for the user if they don't have one of this type
    let appliance = await prisma.appliance.findFirst({
      where: { 
        user_id: membership.user_id,
        appliance_type_id: applianceType.id
      }
    });

    if (!appliance) {
      appliance = await prisma.appliance.create({
        data: {
          user_id: membership.user_id,
          appliance_type_id: applianceType.id,
          brand: "Premium Member Unit",
          model_number: "MEMBERSHIP-AUTO"
        }
      });
    }

    // 4. Generate Routine Service Orders for the next 12 months
    const totalMonths = 12;
    const intervals = Math.floor(totalMonths / membership.frequency_months);
    
    const ordersToCreate = [];
    for (let i = 1; i <= intervals; i++) {
      const scheduledDate = addMonths(new Date(), i * membership.frequency_months);
      
      ordersToCreate.push(
        prisma.order.create({
          data: {
            user_id: membership.user_id,
            appliance_id: appliance.id,
            status: "PENDING",
            payment_status: "FULLY_PAID", // Membership is prepaid
            problem: `Servis Rutin Berkala (${membership.appliance_name})`,
            scheduled_date_time: scheduledDate,
            estimated_cost: 0, // Already paid via membership
            final_cost: 0,
            service_type: "HOME_SERVICE"
          }
        })
      );
    }

    await Promise.all(ordersToCreate);

    // 5. Send Notification to User
    await prisma.notification.create({
      data: {
        user_id: membership.user_id,
        title: "Membership Aktif! 🚀",
        message: `Selamat! Paket Smart Care ${membership.appliance_name} Anda aktif. Kami telah menjadwalkan kunjungan rutin di kalender Anda.`,
        type: "INFO"
      }
    });

  } catch (error) {
    console.error("Error activating membership:", error);
  }
}
