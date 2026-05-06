import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import BookingForm from "./BookingForm";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function BookingPage() {
  const session = await getServerSession(authOptions);
  const cookieStore = await cookies();
  const isLoggedIn = !!session || !!cookieStore.get("user_email")?.value;

  if (!isLoggedIn) {
    redirect("/login");
  }

  return <BookingForm />;
}
