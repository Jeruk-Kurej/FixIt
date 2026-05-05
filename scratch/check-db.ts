import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const types = await prisma.applianceType.findMany();
  console.log("Appliance Types:", types);
}

main().catch(console.error).finally(() => prisma.$disconnect());
