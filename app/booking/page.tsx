import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import BookingForm from "./BookingForm";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export default async function BookingPage() {
  const session = await getServerSession(authOptions);
  const cookieStore = await cookies();
  const isLoggedIn = !!session || !!cookieStore.get("user_email")?.value;

  if (!isLoggedIn) {
    redirect("/login");
  }

  const applianceTypes = await prisma.applianceType.findMany({
    where: {
      technicians: {
        some: {}
      }
    },
    select: {
      id: true,
      name: true
    },
    orderBy: {
      name: "asc"
    }
  });

  return <BookingForm applianceTypes={applianceTypes} />;
}
