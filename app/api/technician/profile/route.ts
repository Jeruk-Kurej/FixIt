import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const cookieStore = await cookies();
    const userEmail = session?.user?.email || cookieStore.get("user_email")?.value;

    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        technician: {
          include: {
            specialties: true
          }
        }
      }
    });

    if (!user || user.role !== "TECHNICIAN" || !user.technician) {
      return NextResponse.json({ error: "Forbidden - Technician only" }, { status: 403 });
    }

    return NextResponse.json({
      name: user.name,
      phone: user.phone,
      specialties: user.technician.specialties.map(s => s.id),
      bank_name: user.technician.bank_name,
      bank_account: user.technician.bank_account,
      bank_owner: user.technician.bank_owner,
    });
  } catch (error: any) {
    console.error("Error fetching technician profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { name, phone, specialties, bank_name, bank_account, bank_owner } = await req.json(); // specialties is an array of ApplianceType IDs
    const session = await getServerSession(authOptions);
    const cookieStore = await cookies();
    const userEmail = session?.user?.email || cookieStore.get("user_email")?.value;

    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: { technician: true }
    });

    if (!user || user.role !== "TECHNICIAN" || !user.technician) {
      return NextResponse.json({ error: "Forbidden - Technician only" }, { status: 403 });
    }

    // Update user details
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        phone
      }
    });

    // Update technician specialties using Prisma's set operation
    const updatedTechnician = await prisma.technician.update({
      where: { id: user.technician.id },
      data: {
        bank_name: bank_name || null,
        bank_account: bank_account || null,
        bank_owner: bank_owner || null,
        specialties: {
          set: specialties.map((id: string) => ({ id }))
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error updating technician profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
