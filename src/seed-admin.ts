import { Logger } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

import { PrismaClient } from './generated/prisma/client';

const logger = new Logger('SeedAdmin');

async function bootstrap(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!databaseUrl || !email || !adminPassword) {
    throw new Error('DATABASE_URL, ADMIN_EMAIL and ADMIN_PASSWORD must be set');
  }

  const adapter = new PrismaPg({
    connectionString: databaseUrl,
  });

  const prisma = new PrismaClient({ adapter });

  try {
    logger.log('Database connection started');

    await prisma.$connect();

    logger.log('Database connection completed successfully');
    logger.log('Admin initialization started');

    const passwordHash = await bcrypt.hash(adminPassword, 10);

    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        passwordHash,
        role: 'ADMIN',
      },
    });

    logger.log('Admin ensured successfully');
  } finally {
    logger.log('Database disconnection started');

    await prisma.$disconnect();

    logger.log('Database disconnection completed successfully');
  }
}

// async function bootstrap(): Promise<void> {
//   try {
//     logger.log('Database connection started');

//     await prisma.$connect();

//     logger.log('Database connection completed successfully');

//     await main();
//   } finally {
//     logger.log('Database disconnection started');

//     await prisma.$disconnect();

//     logger.log('Database disconnection completed successfully');
//   }
// }

bootstrap().catch((error: unknown) => {
  logger.error(
    'Seed failed',
    error instanceof Error ? error.stack : String(error),
  );

  process.exitCode = 1;
});
