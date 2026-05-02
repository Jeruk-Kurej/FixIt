import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding data...')

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

  // 3. Buat Barang Elektronik (Appliances) untuk Customer
  // Kita pastikan id statis agar mudah untuk upsert atau biarkan auto-generate kalau tidak pakai upsert.
  // Tapi karena Prisma relasi bisa di-create bersamaan, lebih aman pakai createMany atau individual create.
  
  // Hapus data lama agar seed tidak duplikat (Optional, tergantung kebutuhan)
  await prisma.order.deleteMany()
  await prisma.appliance.deleteMany()
  
  const ac = await prisma.appliance.create({
    data: {
      userId: customer.id,
      type: 'AC',
      brand: 'Daikin',
    }
  })

  const kulkas = await prisma.appliance.create({
    data: {
      userId: customer.id,
      type: 'Kulkas',
      brand: 'Sharp',
    }
  })

  const mesinCuci = await prisma.appliance.create({
    data: {
      userId: customer.id,
      type: 'Mesin Cuci',
      brand: 'Samsung',
    }
  })
  console.log('Appliances created for customer')

  // 4. Buat Contoh Order (Pesanan)
  const orderAC = await prisma.order.create({
    data: {
      userId: customer.id,
      applianceId: ac.id,
      serviceType: 'HOME_SERVICE',
      status: 'PENDING',
      problem: 'AC kurang dingin, mungkin freon habis',
      estimatedCost: 150000,
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
      finalCost: 400000, // Misal teknisi sudah mengecek dan memberikan harga final
    }
  })
  console.log('Orders created')

  // 5. Buat Membership untuk Customer
  await prisma.membership.deleteMany()
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
