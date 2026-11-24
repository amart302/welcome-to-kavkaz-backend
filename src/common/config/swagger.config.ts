import { DocumentBuilder } from '@nestjs/swagger';

export function createSwaggerConfig() {
  return new DocumentBuilder()
    .setTitle('Welcome to Kavkaz API')
    .setVersion('1.0')
    .addBearerAuth()
    .addGlobalResponse(
      {
        status: 429,
        description: 'Превышен лимит запросов',
        schema: {
          example: {
            success: false,
            statusCode: 429,
            message: 'ThrottlerException: Too Many Requests',
          },
        },
      },
      {
        status: 500,
        description: 'Внутренняя ошибка сервера',
        schema: {
          example: {
            success: false,
            statusCode: 500,
            message: 'Внутренняя ошибка сервера',
          },
        },
      },
    )
    .build();
}
