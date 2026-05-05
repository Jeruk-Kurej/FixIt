import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = "bcarlielukito@student.ciputra.ac.id";
  console.log(`Setting up ${email} as a Technician...`);

  // 1. Create or Update User to TECHNICIAN
  const user = await prisma.user.upsert({
    where: { email: email },
    update: {
      role: Role.TECHNICIAN,
    },
    create: {
      name: "BryanC Technician",
      email: email,
      role: Role.TECHNICIAN,
      phone: "081234567890",
      address: "Universitas Ciputra",
    }
  });

  // 2. Ensure Technician Profile Exists
  const tech = await prisma.technician.upsert({
    where: { user_id: user.id },
    update: {
      is_available: true,
    },
    create: {
      user_id: user.id,
      rating: 5.0,
      is_available: true,
    }
  });

  console.log("✅ SUCCESS!");
  console.log(`User ID: ${user.id}`);
  console.log(`Tech ID: ${tech.id}`);
  console.log(`Role: ${user.role}`);
  console.log("Sekarang silakan login Google dengan email tersebut.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
