import { DocumentBuilder } from '@nestjs/swagger';

export function createSwaggerConfig() {
  return new DocumentBuilder()
    .setTitle('Welcome to Kavkazz Backend')
    .setDescription('API for Welcome to Kavkazz')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
}
