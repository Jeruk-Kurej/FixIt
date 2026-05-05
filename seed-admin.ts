import { PrismaClient, Role, Gender } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Creating Admin User...");
  
  const admin = await prisma.user.upsert({
    where: { email: "admin@fixit.com" },
    update: {},
    create: {
      name: "Admin FixIt",
      email: "admin@fixit.com",
      password: "password_admin",
      phone: "080011223344",
      address: "Headquarters FixIt, Jakarta",
      role: Role.ADMIN,
      gender: Gender.MALE,
      age: 30
    }
  });

  console.log("Admin Created:", admin.email);
}

main().catch(console.error).finally(() => prisma.$disconnect());
