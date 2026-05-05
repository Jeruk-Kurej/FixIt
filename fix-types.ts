import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Adding missing appliance types...");
  
  const missingTypes = [
    { name: "Mesin Cuci", base_service_fee: 65000 },
    { name: "TV / Monitor", base_service_fee: 85000 },
    { name: "Water Heater", base_service_fee: 95000 }
  ];

  for (const type of missingTypes) {
    const exists = await prisma.applianceType.findFirst({
      where: { name: { contains: type.name.split(' ')[0] } }
    });

    if (!exists) {
      await prisma.applianceType.create({ data: type });
      console.log(`Added: ${type.name}`);
    }
  }

  console.log("Done!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
