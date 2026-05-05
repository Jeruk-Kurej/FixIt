import { NextRequest, NextResponse } from "next/server";
import { activateMembership } from "@/lib/membership-engine";

export async function POST(req: NextRequest) {
  try {
    const { membershipId } = await req.json();
    console.log("Approve request for:", membershipId);

    if (!membershipId) {
      return NextResponse.json({ error: "Membership ID diperlukan." }, { status: 400 });
    }

    await activateMembership(membershipId);
    console.log("Activation complete.");


    return NextResponse.json({ success: true, message: "Membership berhasil diaktifkan dan jadwal telah dibuat." });
  } catch (err: any) {
    return NextResponse.json({ error: "Gagal mengaktifkan membership." }, { status: 500 });
  }
}
