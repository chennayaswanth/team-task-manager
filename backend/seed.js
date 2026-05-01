const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const existingAdmin = await prisma.user.findUnique({ where: { email: 'admin@test.com' } });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    await prisma.user.create({
      data: {
        name: 'Super Admin',
        email: 'admin@test.com',
        password: hashedPassword,
        role: 'ADMIN'
      }
    });
    console.log('Admin user created: admin@test.com / password123');
  } else {
    console.log('Admin already exists');
  }

  const existingMember = await prisma.user.findUnique({ where: { email: 'member@test.com' } });
  if (!existingMember) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    await prisma.user.create({
      data: {
        name: 'Team Member',
        email: 'member@test.com',
        password: hashedPassword,
        role: 'MEMBER'
      }
    });
    console.log('Member user created: member@test.com / password123');
  } else {
    console.log('Member already exists');
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
