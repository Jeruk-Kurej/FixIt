import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import BookingForm from "./BookingForm";

export default async function BookingPage() {
  const cookieStore = await cookies();
  const isLoggedIn = !!cookieStore.get("user_email")?.value;

  if (!isLoggedIn) {
    redirect("/login");
  }

  return <BookingForm />;
}
