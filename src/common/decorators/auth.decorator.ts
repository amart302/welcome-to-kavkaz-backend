import { applyDecorators, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { AdminGuard } from '../guards/admin.guard';
import { AuthGuard } from '../guards/auth.guard';

export function Auth({
  adminOnly = false,
}: {
  adminOnly?: boolean;
} = {}): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    UseGuards(...(adminOnly ? [AuthGuard, AdminGuard] : [AuthGuard])),
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
    ...(adminOnly
      ? [
          ApiForbiddenResponse({
            description: 'Доступ разрешён только администраторам',
            schema: {
              example: {
                success: false,
                statusCode: 403,
                message: 'Доступ разрешён только администраторам',
              },
            },
          }),
        ]
      : []),
  );
}
