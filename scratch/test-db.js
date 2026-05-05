const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    console.log("Testing Prisma Write...")
    const user = await prisma.user.create({
      data: {
        name: "Test User",
        email: "test-" + Date.now() + "@example.com",
        role: "CUSTOMER"
      }
    })
    console.log("SUCCESS! User created:", user.id)
  } catch (err) {
    console.error("DATABASE WRITE ERROR:", err)
  } finally {
    await prisma.$disconnect()
  }
}

main()
