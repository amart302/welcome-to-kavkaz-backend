import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { authTokenExample, currentUserExample } from './auth.examples';

export function ApiLogin(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    ApiOperation({ summary: 'Авторизация пользователя' }),
    ApiOkResponse({
      description: 'Вход в систему выполнен успешно',
      schema: {
        example: {
          success: true,
          message: 'Вход в систему выполнен успешно',
          data: authTokenExample,
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Ошибка валидации входных данных',
      schema: {
        example: {
          success: false,
          statusCode: 400,
          message: ['Email обязателен'],
        },
      },
    }),
    ApiUnauthorizedResponse({
      description:
        'Пользователь не найден, пароль неверен или учетная запись деактивирована',
      schema: {
        example: {
          success: false,
          statusCode: 401,
          message: 'Неверный email или пароль',
        },
      },
    }),
  );
}

export function ApiGetMe(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    ApiOperation({ summary: 'Получение данных пользователя' }),
    ApiOkResponse({
      description: 'Данные пользователя получены',
      schema: {
        example: {
          success: true,
          message: 'Данные пользователя получены',
          data: currentUserExample,
        },
      },
    }),
  );
}
