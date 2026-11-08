import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { AuthGuard } from '../guards/auth.guard';

export function Auth(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    UseGuards(AuthGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({
      description:
        'Bearer-токен отсутствует, некорректен или просрочен; данные токена некорректны; пользователь не найден или учетная запись деактивирована',
      schema: {
        example: {
          success: false,
          statusCode: 401,
          message: 'Пожалуйста, авторизуйтесь',
        },
      },
    }),
  );
}
