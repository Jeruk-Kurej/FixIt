import prisma from "@/lib/prisma";
// Force recompile to detect new Prisma schema
import { cookies } from "next/headers";
import TechnicianDashboardView from "./TechnicianDashboardView";
import CustomerDashboardView from "./CustomerDashboardView";
import AdminDashboardView from "./AdminDashboardView";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const cookieStore = await cookies();
  
  const userEmail = session?.user?.email || cookieStore.get("user_email")?.value;
  const userRole = (session?.user as any)?.role || cookieStore.get("user_role")?.value;

  if (!userEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-50">
        <div className="text-center">
           <p className="text-slate-500 mb-4">Sesi Anda telah berakhir.</p>
           <a href="/login" className="px-6 py-2 bg-orange-500 rounded-xl font-bold">Login Kembali</a>
        </div>
      </div>
    );
  }

  const user = await prisma.user.findFirst({
    where: { email: String(userEmail) },
    include: {
      technician: {
        include: {
          orders: {
            orderBy: { createdAt: "desc" },
            include: {
              user: true,
              appliance: { include: { appliance_type: true } }
            }
          }
        }
      },

      orders: {
        orderBy: { createdAt: "desc" },
        include: {
          technician: { include: { user: true } },
          appliance: { include: { appliance_type: true } },
          messages: { take: 1, orderBy: { createdAt: 'desc' } },
          payments: { orderBy: { createdAt: 'desc' } },
          review: true
        }

      }
    }
  });

  if (!user) return null;

  // Fetch pending memberships separately to bypass Prisma Client include issues
  const pendingMemberships = await prisma.membership.findMany({
    where: { status: 'PENDING' },
    include: { user: true }
  });

  const pendingPayments = await prisma.payment.findMany({
    where: { status: 'PENDING' },
    include: {
      order: {
        include: { user: true }
      }
    }
  });

  const verifiedPayments = await prisma.payment.findMany({
    where: { status: 'VALID' },
    include: {
      order: {
        include: { 
          user: true,
          appliance: { include: { appliance_type: true } }
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  const verifiedMemberships = await prisma.membership.findMany({
    where: { status: 'ACTIVE' },
    include: { user: true },
    orderBy: { createdAt: 'desc' },
    take: 10
  });



  // Trigger smart reminders (Lazy Sync on load)
  const { processSmartReminders } = await import("@/lib/reminder-engine");
  await processSmartReminders(user.id);

  const calendarEvents = user.orders
    .filter(o => o.scheduled_date_time && o.technician_id && (o.payment_status === 'DP_PAID' || o.payment_status === 'FULLY_PAID'))
    .map(o => ({
      id: o.id,
      date: new Date(o.scheduled_date_time!),
      applianceName: o.appliance?.appliance_type?.name || "Servis",
      type: o.service_type as any,
      status: o.status,
      problem: o.problem || "Cek Berkala"
    }));

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 py-10 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/5 blur-[150px] rounded-full pointer-events-none" />
      
      {user.role === 'ADMIN' ? (
        <AdminDashboardView 
          user={user} 
          pendingMemberships={pendingMemberships} 
          pendingPayments={pendingPayments} 
          verifiedPayments={verifiedPayments}
          verifiedMemberships={verifiedMemberships}
        />

      ) : user.role === 'TECHNICIAN' && user.technician ? (
        <TechnicianDashboardView user={user} tech={user.technician} />
      ) : (
        <CustomerDashboardView 
          user={user} 
          pendingMemberships={pendingMemberships}
          pendingPayments={pendingPayments}
          calendarEvents={calendarEvents} 
        />
      )}
    </div>
  );
}

