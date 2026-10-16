import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import process from 'process';

import { createSwaggerConfig } from '@/common/config/swagger.config';
import { AllExceptionsFilter } from '@/common/filters/all-exceptions.filter';
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: ['http://localhost:3000', process.env.FRONTEND_URL],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  const swaggerConfig = createSwaggerConfig();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((error: unknown) => {
  const logger = new Logger('Bootstrap');

  if (error instanceof Error) {
    logger.error('Application bootstrap failed', error.stack);
  } else {
    logger.error(`Application bootstrap failed (${String(error)})`);
  }

  process.exitCode = 1;
});
