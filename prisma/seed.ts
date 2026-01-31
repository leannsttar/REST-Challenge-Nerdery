import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await prisma.revokedTokens.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('123456', 10);

  await prisma.user.create({
    data: {
      email: 'lelouch@gmail.com',
      name: 'Lelouch Vi Britannia',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  await prisma.user.create({
    data: {
      email: 'edward@gmail.com',
      name: 'Edward Elric',
      password: hashedPassword,
      role: Role.CLIENT,
    },
  });

  await prisma.user.create({
    data: {
      email: 'tenma@gmail.com',
      name: 'Kenzo Tenma',
      password: hashedPassword,
      role: Role.CLIENT,
    },
  });

  console.log('Seed executed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });