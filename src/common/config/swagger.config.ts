import { DocumentBuilder } from '@nestjs/swagger';

export function createSwaggerConfig() {
  return new DocumentBuilder()
    .setTitle('Nest Template API')
    .setDescription('API for Nest Template')
    .setVersion('1.0')
    .build();
}
