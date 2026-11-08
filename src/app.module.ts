import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { envValidationSchema } from '@/common/config/env.validation';
import { JwtAuthModule } from '@/common/modules/jwt-auth.module';
import { PrismaModule } from '@/prisma/prisma.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
    }),

    JwtAuthModule,
    PrismaModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
