import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding data...')

  // Hapus data lama agar seed tidak duplikat
  await prisma.order.deleteMany()
  await prisma.appliance.deleteMany()
  await prisma.technician.deleteMany()
  await prisma.membership.deleteMany()
  await prisma.applianceCategory.deleteMany()

  // 1. Buat Akun Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@fixit.com' },
    update: {},
    create: {
      name: 'Admin FixIt',
      email: 'admin@fixit.com',
      phone: '081234567890',
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
      phone: '08111222333',
      role: 'TECHNICIAN',
    },
  })
  const technician = await prisma.technician.create({
    data: {
      userId: techUser.id,
      trustScore: 4.8,
      currentLat: -6.200000,
      currentLng: 106.816666,
      isAvailable: true,
    }
  })
  console.log('Technician created:', techUser.name)

  // 4. Buat Kategori Appliance (FixIt 2.0)
  const acCat = await prisma.applianceCategory.create({
    data: {
      name: 'AC',
      iconUrl: 'https://assets3.lottiefiles.com/packages/lf20_Q895iE.json', // Placeholder
      baseServiceFee: 100000,
    }
  })
  const kulkasCat = await prisma.applianceCategory.create({
    data: {
      name: 'Kulkas',
      iconUrl: 'https://assets5.lottiefiles.com/packages/lf20_t2XoZl.json', // Placeholder
      baseServiceFee: 150000,
    }
  })
  const mesinCuciCat = await prisma.applianceCategory.create({
    data: {
      name: 'Mesin Cuci',
      iconUrl: 'https://assets9.lottiefiles.com/packages/lf20_4kji20.json', // Placeholder
      baseServiceFee: 120000,
    }
  })
  console.log('Appliance Categories created')

  // 5. Buat Barang Elektronik (Appliances) untuk Customer
  const ac = await prisma.appliance.create({
    data: {
      userId: customer.id,
      type: acCat.name,
      brand: 'Daikin',
    }
  })

  const kulkas = await prisma.appliance.create({
    data: {
      userId: customer.id,
      type: kulkasCat.name,
      brand: 'Sharp',
    }
  })
  console.log('Appliances created for customer')

  // 6. Buat Contoh Order (Pesanan) dengan fitur Smart Scheduling (ada scheduledDate dan technicianId)
  const orderAC = await prisma.order.create({
    data: {
      userId: customer.id,
      applianceId: ac.id,
      technicianId: technician.id,
      serviceType: 'HOME_SERVICE',
      status: 'ON_THE_WAY',
      problem: 'AC kurang dingin, mungkin freon habis',
      estimatedCost: 250000,
      scheduledDate: new Date(),
    }
  })

  const orderKulkas = await prisma.order.create({
    data: {
      userId: customer.id,
      applianceId: kulkas.id,
      serviceType: 'WORKSHOP_VISIT',
      status: 'WORKING',
      problem: 'Kulkas tidak bisa beku, suara mesin kasar',
      estimatedCost: 350000,
      finalCost: 400000, 
    }
  })
  console.log('Orders created')

  // 7. Buat Membership untuk Customer
  const membership = await prisma.membership.create({
    data: {
      userId: customer.id,
      status: 'ACTIVE',
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // 1 Tahun
    }
  })
  console.log('Membership created')

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
