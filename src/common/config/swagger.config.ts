import { DocumentBuilder } from '@nestjs/swagger';

export function createSwaggerConfig() {
  return new DocumentBuilder()
    .setTitle('Welcome to Kavkaz API')
    .setDescription('API проекта Welcome to Kavkaz')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
}
