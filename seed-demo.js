const { PrismaClient, Role, OrderStatus, Gender, PaymentStatus, PaymentType, PaymentVerificationStatus, ServiceType } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("=== START DEMO SEEDING ===");

  // 1. Cleanup existing tables in correct order
  console.log("Cleaning up old database records...");
  await prisma.notification.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.orderDetail.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.serviceTask.deleteMany({});
  await prisma.appliance.deleteMany({});
  await prisma.applianceType.deleteMany({});
  await prisma.technician.deleteMany({});
  await prisma.membership.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.user.deleteMany({});
  console.log("Cleanup complete!");

  // 2. Create Appliance Types
  console.log("Creating Appliance Types...");
  const acType = await prisma.applianceType.create({
    data: { name: 'AC', base_service_fee: 100000 }
  });
  const kulkasType = await prisma.applianceType.create({
    data: { name: 'Kulkas', base_service_fee: 150000 }
  });
  const mesinCuciType = await prisma.applianceType.create({
    data: { name: 'Mesin Cuci', base_service_fee: 120000 }
  });
  const tvType = await prisma.applianceType.create({
    data: { name: 'Televisi', base_service_fee: 100000 }
  });
  const microwaveType = await prisma.applianceType.create({
    data: { name: 'Microwave', base_service_fee: 80000 }
  });

  // 3. Create Service Tasks
  console.log("Creating Service Tasks...");
  await prisma.serviceTask.createMany({
    data: [
      { appliance_type_id: acType.id, task_name: "Cuci AC Standar", standard_price: 75000 },
      { appliance_type_id: acType.id, task_name: "Tambah Freon R32", standard_price: 150000 },
      { appliance_type_id: kulkasType.id, task_name: "Ganti Kompresor", standard_price: 450000 },
      { appliance_type_id: mesinCuciType.id, task_name: "Ganti Karet Selang", standard_price: 60000 },
      { appliance_type_id: tvType.id, task_name: "Perbaikan Backlight LED", standard_price: 250000 },
      { appliance_type_id: microwaveType.id, task_name: "Ganti Magnetron", standard_price: 300000 }
    ]
  });

  // 4. Create Users (Customers, Technicians, Admin)
  console.log("Creating Users...");

  // Customers
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
    }
  });

  const userSusi = await prisma.user.create({
    data: {
      name: "Susi Susanti",
      email: "susi@example.com",
      password: "password_susi",
      phone: "08234567890",
      address: "Jl. Mawar No. 45, Bandung",
      age: 25,
      gender: Gender.FEMALE,
      role: Role.CUSTOMER,
    }
  });

  const userRoni = await prisma.user.create({
    data: {
      name: "Roni Wijaya",
      email: "roni@example.com",
      password: "password_roni",
      phone: "08345678901",
      address: "Jl. Dahlia No. 78, Surabaya",
      age: 32,
      gender: Gender.MALE,
      role: Role.CUSTOMER,
    }
  });

  // Technicians
  const userJoko = await prisma.user.create({
    data: {
      name: "Joko Teknisi",
      email: "joko.tech@fixit.com",
      password: "password_joko",
      phone: "08987654321",
      address: "Jl. Bengkel No. 5, Bekasi",
      role: Role.TECHNICIAN,
    }
  });

  const userAnton = await prisma.user.create({
    data: {
      name: "Anton Teknisi",
      email: "anton.tech@fixit.com",
      password: "password_anton",
      phone: "08876543210",
      address: "Jl. Solder No. 12, Tangerang",
      role: Role.TECHNICIAN,
    }
  });

  const userRian = await prisma.user.create({
    data: {
      name: "Rian Teknisi",
      email: "rian.tech@fixit.com",
      password: "password_rian",
      phone: "08765432109",
      address: "Jl. Obeng No. 9, Depok",
      role: Role.TECHNICIAN,
    }
  });

  const userMaster = await prisma.user.create({
    data: {
      name: "Master Teknisi",
      email: "dummy.technician@fixit.com",
      password: "password123",
      phone: "08999999999",
      address: "Mabes FixIt Center, Jakarta",
      role: Role.TECHNICIAN,
    }
  });

  // Admin
  await prisma.user.create({
    data: {
      name: "Admin FixIt",
      email: "admin@fixit.com",
      password: "admin123",
      phone: "08111111111",
      address: "Kantor Pusat FixIt",
      role: Role.ADMIN,
    }
  });

  // 5. Create Technician Profiles with Specialties
  console.log("Creating Technician Profiles...");
  const techJoko = await prisma.technician.create({
    data: {
      user_id: userJoko.id,
      rating: 4.8,
      is_available: true,
      specialties: { connect: [{ id: acType.id }, { id: kulkasType.id }] }
    }
  });

  const techAnton = await prisma.technician.create({
    data: {
      user_id: userAnton.id,
      rating: 4.7,
      is_available: true,
      specialties: { connect: [{ id: mesinCuciType.id }, { id: tvType.id }] }
    }
  });

  const techRian = await prisma.technician.create({
    data: {
      user_id: userRian.id,
      rating: 4.5,
      is_available: true,
      specialties: { connect: [{ id: microwaveType.id }] }
    }
  });

  const techMaster = await prisma.technician.create({
    data: {
      user_id: userMaster.id,
      rating: 5.0,
      is_available: true,
      specialties: { connect: [{ id: acType.id }, { id: kulkasType.id }, { id: mesinCuciType.id }, { id: tvType.id }, { id: microwaveType.id }] }
    }
  });

  // 6. Create Customer Appliances
  console.log("Creating Customer Appliances...");
  // Budi's appliances
  const budiAC = await prisma.appliance.create({
    data: {
      user_id: userBudi.id,
      appliance_type_id: acType.id,
      name: "AC Kamar Utama",
      brand: "Panasonic",
      model_number: "PN-123-X",
    }
  });
  const budiKulkas = await prisma.appliance.create({
    data: {
      user_id: userBudi.id,
      appliance_type_id: kulkasType.id,
      name: "Kulkas Dapur",
      brand: "LG",
      model_number: "LG-DAPUR-55",
    }
  });

  // Susi's appliances
  const susiTV = await prisma.appliance.create({
    data: {
      user_id: userSusi.id,
      appliance_type_id: tvType.id,
      name: "TV Ruang Tamu",
      brand: "Sony",
      model_number: "SN-BRAVIA-50",
    }
  });
  const susiMesinCuci = await prisma.appliance.create({
    data: {
      user_id: userSusi.id,
      appliance_type_id: mesinCuciType.id,
      name: "Mesin Cuci Belakang",
      brand: "Samsung",
      model_number: "SM-CUCI-99",
    }
  });

  // Roni's appliances
  const roniMicrowave = await prisma.appliance.create({
    data: {
      user_id: userRoni.id,
      appliance_type_id: microwaveType.id,
      name: "Microwave Dapur",
      brand: "Sharp",
      model_number: "SH-MICRO-88",
    }
  });
  const roniAC = await prisma.appliance.create({
    data: {
      user_id: userRoni.id,
      appliance_type_id: acType.id,
      name: "AC Kamar Anak",
      brand: "Daikin",
      model_number: "DK-CHILD-12",
    }
  });

  // 7. Create Orders for Various Demo Scenarios
  console.log("Creating Orders & Payments...");
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);

  // Scenario 1: PENDING - Baru Masuk & Menunggu Verifikasi Pembayaran DP oleh Admin
  const order1 = await prisma.order.create({
    data: {
      user_id: userBudi.id,
      appliance_id: budiAC.id,
      status: OrderStatus.PENDING,
      problem: "AC tidak dingin sama sekali, hanya keluar angin biasa.",
      scheduled_date_time: tomorrow,
      estimated_cost: 100000,
      service_type: ServiceType.HOME_SERVICE,
      payment_status: PaymentStatus.UNPAID,
    }
  });

  await prisma.payment.create({
    data: {
      order_id: order1.id,
      amount: 50000,
      type: PaymentType.DOWN_PAYMENT,
      method: "BANK_TRANSFER",
      status: PaymentVerificationStatus.PENDING,
      proof_url: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=500", // dummy receipt image
    }
  });

  // Scenario 2: ACCEPTED - DP Valid, Menunggu Teknisi untuk Claim (Akan muncul di Feed Baru Anton/Master)
  const order2 = await prisma.order.create({
    data: {
      user_id: userSusi.id,
      appliance_id: susiTV.id,
      status: OrderStatus.ACCEPTED,
      problem: "Layar TV berkedip terus dan kadang-kadang layarnya mati sendiri.",
      scheduled_date_time: tomorrow,
      estimated_cost: 150000,
      service_type: ServiceType.HOME_SERVICE,
      payment_status: PaymentStatus.DP_PAID,
    }
  });

  await prisma.payment.create({
    data: {
      order_id: order2.id,
      amount: 50000,
      type: PaymentType.DOWN_PAYMENT,
      method: "BANK_TRANSFER",
      status: PaymentVerificationStatus.VALID,
      proof_url: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=500",
      verifiedAt: new Date(),
    }
  });

  // Scenario 3: WORKING - Sudah diclaim oleh Rian Teknisi & Sedang Dikerjakan di Lokasi
  const order3 = await prisma.order.create({
    data: {
      user_id: userRoni.id,
      appliance_id: roniMicrowave.id,
      status: OrderStatus.WORKING,
      problem: "Microwave tidak bisa panas padahal mesin menyala.",
      scheduled_date_time: tomorrow,
      estimated_cost: 120000,
      service_type: ServiceType.HOME_SERVICE,
      payment_status: PaymentStatus.DP_PAID,
      technician_id: techRian.id,
    }
  });

  await prisma.payment.create({
    data: {
      order_id: order3.id,
      amount: 50000,
      type: PaymentType.DOWN_PAYMENT,
      method: "BANK_TRANSFER",
      status: PaymentVerificationStatus.VALID,
      proof_url: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=500",
      verifiedAt: new Date(),
    }
  });

  // Scenario 4: DONE - Sudah selesai diperbaiki oleh Joko Teknisi & Pembayaran Lunas
  const order4 = await prisma.order.create({
    data: {
      user_id: userBudi.id,
      appliance_id: budiKulkas.id,
      status: OrderStatus.DONE,
      problem: "Pintu kulkas tidak bisa menutup rapat dan bagian freezer tidak membeku.",
      scheduled_date_time: new Date(),
      estimated_cost: 150000,
      final_cost: 250000,
      service_type: ServiceType.HOME_SERVICE,
      payment_status: PaymentStatus.FULLY_PAID,
      technician_id: techJoko.id,
    }
  });

  // Down Payment (Valid)
  await prisma.payment.create({
    data: {
      order_id: order4.id,
      amount: 50000,
      type: PaymentType.DOWN_PAYMENT,
      method: "BANK_TRANSFER",
      status: PaymentVerificationStatus.VALID,
      proof_url: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=500",
      verifiedAt: new Date(),
    }
  });

  // Final Balance Payment (Valid)
  await prisma.payment.create({
    data: {
      order_id: order4.id,
      amount: 200000,
      type: PaymentType.FINAL_BALANCE,
      method: "BANK_TRANSFER",
      status: PaymentVerificationStatus.VALID,
      proof_url: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=500",
      verifiedAt: new Date(),
    }
  });

  // Create Review for Order 4
  await prisma.review.create({
    data: {
      order: { connect: { id: order4.id } },
      technician: { connect: { id: techJoko.id } },
      user: { connect: { id: userBudi.id } },
      rating: 5,
      comment: "Kerja cepat, ramah, dan kulkas saya langsung normal kembali. Terima kasih Joko!"
    }
  });

  console.log("=== SEEDING COMPLETED SUCCESSFULLY ===");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
