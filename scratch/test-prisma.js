const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const user = await prisma.user.findFirst({
      where: { email: "budi@example.com" },
      include: {
        orders: {
          include: {
            technician: { include: { user: true } },
            appliance: { include: { appliance_type: true } },
            messages: { take: 1, orderBy: { createdAt: 'desc' } }
          }
        },
        technician: true
      }
    });
    console.log("Success with new 'Message' model!");
    
    const msg = await prisma.message.findMany({ take: 1 });
    console.log("Message query success!");
  } catch (e) {
    console.error(e.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
