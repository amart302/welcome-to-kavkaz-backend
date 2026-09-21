import { Logger } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

import { PrismaClient } from '../src/generated/prisma/client';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });
const logger = new Logger('Seed');

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!email || !adminPassword) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set');
  }

  logger.log('Admin initialization started');

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  logger.log('Admin ensured successfully');
}

async function bootstrap(): Promise<void> {
  try {
    logger.log('Database connection started');

    await prisma.$connect();

    logger.log('Database connection completed successfully');

    await main();
  } finally {
    logger.log('Database disconnection started');

    await prisma.$disconnect();

    logger.log('Database disconnection completed successfully');
  }
}

bootstrap().catch((error: unknown) => {
  logger.error(
    'Seed failed',
    error instanceof Error ? error.stack : String(error),
  );

  process.exitCode = 1;
});
