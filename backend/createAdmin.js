const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('admin123', 10);
  
  await prisma.user.upsert({
    where: { email: 'admin@hotel.com' },
    update: { password_hash: hash, role: 'ADMIN' },
    create: {
      name: 'System Admin',
      email: 'admin@hotel.com',
      password_hash: hash,
      role: 'ADMIN'
    }
  });
  console.log('Admin user created');
}

main().then(() => prisma.$disconnect());
