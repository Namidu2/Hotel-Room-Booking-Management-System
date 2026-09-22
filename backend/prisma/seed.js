const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');
  
  // Create Room Types
  const single = await prisma.roomType.upsert({
    where: { type_name: 'Single' },
    update: {},
    create: { type_name: 'Single', description: 'Standard single room', capacity: 1, price_per_night: 5000 },
  });
  
  const double = await prisma.roomType.upsert({
    where: { type_name: 'Double' },
    update: {},
    create: { type_name: 'Double', description: 'Standard double room', capacity: 2, price_per_night: 8000 },
  });

  const suite = await prisma.roomType.upsert({
    where: { type_name: 'Suite' },
    update: {},
    create: { type_name: 'Suite', description: 'Luxury suite', capacity: 2, price_per_night: 15000 },
  });

  // Create Rooms
  await prisma.room.upsert({
    where: { room_number: '101' },
    update: {},
    create: { room_number: '101', floor: '1', status: 'AVAILABLE', room_type_id: single.room_type_id },
  });
  
  await prisma.room.upsert({
    where: { room_number: '102' },
    update: {},
    create: { room_number: '102', floor: '1', status: 'AVAILABLE', room_type_id: double.room_type_id },
  });
  
  await prisma.room.upsert({
    where: { room_number: '201' },
    update: {},
    create: { room_number: '201', floor: '2', status: 'AVAILABLE', room_type_id: suite.room_type_id },
  });

  // Admin User (password: admin123) 
  // In a real scenario, use bcrypt to hash. I will just use a plaintext for the seed for now, 
  // but wait, the instructions say: "Use hashed passwords. Do not store plain-text passwords."
  // I will add bcryptjs and hash it.
  
  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
