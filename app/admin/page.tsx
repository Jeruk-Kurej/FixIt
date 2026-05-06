import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminDashboardView from "./AdminDashboardView";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  const cookieStore = await cookies();
  const userEmail = session?.user?.email || cookieStore.get("user_email")?.value;

  if (!userEmail) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: userEmail as string }
  });

  if (user?.role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="text-center">
          <h1 className="text-4xl font-black text-red-500 mb-4">403</h1>
          <p className="text-slate-400">Anda tidak memiliki akses ke halaman ini.</p>
        </div>
      </div>
    );
  }

  // Fetch all pending payments
  const payments = await prisma.payment.findMany({
    where: { status: "PENDING" },
    include: {
      order: {
        include: {
          user: true,
          appliance: { include: { appliance_type: true } }
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return <AdminDashboardView initialPayments={payments} />;
}
