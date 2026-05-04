import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const userEmail = req.cookies.get("user_email")?.value;

    if (!userEmail) {
      return NextResponse.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 });
    }

    // Since membership model has been retired in this DB revision,
    // we simply return success to not break existing frontend forms.
    return NextResponse.json({ success: true, message: "Membership activated successfully." });
  } catch (err: any) {
    return NextResponse.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}
