import { PrismaClient, OrderStatus, PaymentStatus, ServiceType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const customerEmail = "blukitosetiawan@gmail.com";
  const techEmail = "bcarlielukito@student.ciputra.ac.id";

  console.log("Creating dummy DONE order...");

  // 1. Get Customer
  const customer = await prisma.user.findUnique({
    where: { email: customerEmail },
    include: { appliances: true }
  });

  if (!customer) throw new Error("Customer not found!");

  // 2. Get Technician
  const techUser = await prisma.user.findUnique({
    where: { email: techEmail },
    include: { technician: true }
  });

  if (!techUser || !techUser.technician) throw new Error("Technician not found!");

  // 3. Get or Create Appliance
  let appliance = customer.appliances[0];
  if (!appliance) {
    const acType = await prisma.applianceType.findFirst();
    appliance = await prisma.appliance.create({
      data: {
        user_id: customer.id,
        appliance_type_id: acType?.id || "dummy-type-id",
        brand: "Daikin",
        model_number: "FTKQ25",
      }
    });
  }

  // 4. Create the Order
  const order = await prisma.order.create({
    data: {
      user_id: customer.id,
      technician_id: techUser.technician.id,
      appliance_id: appliance.id,
      status: OrderStatus.DONE,
      payment_status: PaymentStatus.FULLY_PAID,
      problem: "Cuci AC rutin dan cek freon (Dummy Order for Testing)",
      scheduled_date_time: new Date(),
      estimated_cost: 150000,
      final_cost: 150000,
      service_type: ServiceType.HOME_SERVICE,
    }
  });

  console.log("✅ SUCCESS!");
  console.log(`Order ID: ${order.id}`);
  console.log("Sekarang buka Dashboard Customer (blukitosetiawan@gmail.com).");
  console.log("Anda akan melihat tombol 'Beri Nilai' pada pesanan ini.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
