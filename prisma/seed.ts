import { PrismaClient, Role, OrderStatus, Gender } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // 1. Cleanup
  await prisma.orderDetail.deleteMany();
  await prisma.order.deleteMany();
  await prisma.serviceTask.deleteMany();
  await prisma.appliance.deleteMany();
  await prisma.applianceType.deleteMany();
  await prisma.technician.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Users
  const userBudi = await prisma.user.create({
    data: {
      name: "Budi Santoso",
      email: "budi@example.com",
      password: "password_budi",
      phone: "08123456789",
      address: "Jl. Melati No. 12, Jakarta",
      age: 28,
      gender: Gender.MALE,
      role: Role.CUSTOMER,
    },
  });

  const userJoko = await prisma.user.create({
    data: {
      name: "Joko Teknisi",
      email: "joko.tech@fixit.com",
      password: "password_joko",
      phone: "08987654321",
      address: "Jl. Bengkel No. 5, Bekasi",
      age: 35,
      gender: Gender.MALE,
      role: Role.TECHNICIAN,
    },
  });

  // 3. Create Technician Profile
  const techJoko = await prisma.technician.create({
    data: {
      user_id: userJoko.id,
      rating: 4.9,
      is_available: true,
    },
  });

  // 4. Create Appliance Types
  const acType = await prisma.applianceType.create({
    data: {
      name: "Air Conditioner (AC)",
      base_service_fee: 50000,
    },
  });

  const kulkasType = await prisma.applianceType.create({
    data: {
      name: "Kulkas / Refrigerator",
      base_service_fee: 75000,
    },
  });

  // 5. Create Service Tasks
  await prisma.serviceTask.createMany({
    data: [
      { appliance_type_id: acType.id, task_name: "Cuci AC Standar", standard_price: 75000 },
      { appliance_type_id: acType.id, task_name: "Tambah Freon R32", standard_price: 150000 },
      { appliance_type_id: kulkasType.id, task_name: "Ganti Kompresor", standard_price: 450000 },
    ],
  });

  // 6. Create User Appliances
  const budiAC = await prisma.appliance.create({
    data: {
      user_id: userBudi.id,
      appliance_type_id: acType.id,
      brand: "Panasonic",
      model_number: "PN-123-X",
    },
  });

  // 7. Create Orders
  await prisma.order.create({
    data: {
      user_id: userBudi.id,
      appliance_id: budiAC.id,
      status: OrderStatus.DONE,
      problem: "AC tidak dingin dan berbunyi bising",
      scheduled_date_time: new Date(),
      estimated_cost: 150000,
      final_cost: 150000,
      technician_id: techJoko.id,
    },
  });

  console.log("Seed finished successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
