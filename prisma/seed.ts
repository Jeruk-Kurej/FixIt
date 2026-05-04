import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding data...')

  // Hapus data lama agar seed tidak duplikat
  await prisma.orderDetail.deleteMany()
  await prisma.order.deleteMany()
  await prisma.serviceTask.deleteMany()
  await prisma.appliance.deleteMany()
  await prisma.technician.deleteMany()
  await prisma.applianceType.deleteMany()
  await prisma.user.deleteMany()

  // 1. Buat Akun Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@fixit.com' },
    update: {},
    create: {
      name: 'Admin FixIt',
      email: 'admin@fixit.com',
      password: 'password_admin',
      phone: '081234567890',
      address: 'Kantor Pusat FixIt, Jakarta',
      role: 'ADMIN',
    },
  })
  console.log('Admin created:', admin.name)

  // 2. Buat Akun Customer
  const customer = await prisma.user.upsert({
    where: { email: 'budi@example.com' },
    update: {},
    create: {
      name: 'Budi Santoso',
      email: 'budi@example.com',
      password: 'password_budi',
      phone: '089876543210',
      address: 'Jl. Sudirman No. 45, Jakarta',
      role: 'CUSTOMER',
    },
  })
  console.log('Customer created:', customer.name)

  // 3. Buat Akun & Profil Teknisi
  const techUser = await prisma.user.upsert({
    where: { email: 'joko.tech@fixit.com' },
    update: {},
    create: {
      name: 'Joko Teknisi',
      email: 'joko.tech@fixit.com',
      password: 'password_joko',
      phone: '08111222333',
      address: 'Jl. Pemuda No. 12, Jakarta',
      role: 'TECHNICIAN',
    },
  })
  const technician = await prisma.technician.create({
    data: {
      userId: techUser.id,
      trustScore: 4.8,
      isAvailable: true,
    }
  })
  console.log('Technician created:', techUser.name)

  // 4. Buat Master Data Kategori Barang (ApplianceType)
  const acType = await prisma.applianceType.create({
    data: {
      name: 'AC',
      iconUrl: 'https://assets3.lottiefiles.com/packages/lf20_Q895iE.json',
      baseServiceFee: 100000,
    }
  })
  const kulkasType = await prisma.applianceType.create({
    data: {
      name: 'Kulkas',
      iconUrl: 'https://assets5.lottiefiles.com/packages/lf20_t2XoZl.json',
      baseServiceFee: 150000,
    }
  })
  const mesinCuciType = await prisma.applianceType.create({
    data: {
      name: 'Mesin Cuci',
      iconUrl: 'https://assets9.lottiefiles.com/packages/lf20_4kji20.json',
      baseServiceFee: 120000,
    }
  })
  console.log('Appliance Types created')

  // 5. Buat ServiceTask untuk Kategori Barang
  const cuciAC = await prisma.serviceTask.create({
    data: {
      applianceTypeId: acType.id,
      taskName: 'Cuci AC',
      standardPrice: 75000,
    }
  })
  const isiFreonAC = await prisma.serviceTask.create({
    data: {
      applianceTypeId: acType.id,
      taskName: 'Isi Freon AC',
      standardPrice: 150000,
    }
  })
  console.log('Service Tasks created')

  // 6. Buat Barang Elektronik (Appliances) untuk Customer
  const customerAC = await prisma.appliance.create({
    data: {
      userId: customer.id,
      applianceTypeId: acType.id,
      brand: 'Daikin',
      modelNumber: 'DK-1234',
    }
  })

  const customerKulkas = await prisma.appliance.create({
    data: {
      userId: customer.id,
      applianceTypeId: kulkasType.id,
      brand: 'Sharp',
      modelNumber: 'SP-K567',
    }
  })
  console.log('Appliances created for customer')

  // 7. Buat Order (Pesanan)
  const orderAC = await prisma.order.create({
    data: {
      userId: customer.id,
      applianceId: customerAC.id,
      technicianId: technician.id,
      status: 'ACCEPTED',
      problemDescription: 'AC kurang dingin, mungkin freon habis',
      estimatedCost: 250000,
      scheduledDateTime: new Date(),
    }
  })

  const orderKulkas = await prisma.order.create({
    data: {
      userId: customer.id,
      applianceId: customerKulkas.id,
      status: 'WORKING',
      problemDescription: 'Kulkas tidak bisa beku, suara mesin kasar',
      estimatedCost: 350000,
      finalCost: 400000,
      scheduledDateTime: new Date(),
    }
  })
  console.log('Orders created')

  // 8. Buat OrderDetail
  await prisma.orderDetail.create({
    data: {
      orderId: orderAC.id,
      taskName: cuciAC.taskName,
      price: cuciAC.standardPrice,
      isConfirmedByTech: true,
    }
  })

  await prisma.orderDetail.create({
    data: {
      orderId: orderAC.id,
      taskName: isiFreonAC.taskName,
      price: isiFreonAC.standardPrice,
      isConfirmedByTech: true,
    }
  })
  console.log('Order Details created')

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
