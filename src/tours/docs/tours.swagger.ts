import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

import {
  inactiveTourDetailsExample,
  tourDetailsExample,
} from './tours.examples';

export function ApiCreateTour(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    ApiOperation({ summary: 'Создание тура' }),
    ApiCreatedResponse({
      description: 'Тур успешно создан',
      schema: {
        example: {
          success: true,
          message: 'Тур успешно создан',
          data: tourDetailsExample,
        },
      },
    }),
    ApiBadRequestResponse({
      description:
        'Ошибка валидации, номер дня превышает длительность тура или изображение недоступно для привязки',
      examples: {
        validation: {
          summary: 'Ошибка валидации',
          value: {
            success: false,
            statusCode: 400,
            message: ['Название тура обязательно'],
          },
        },
        dayBeyondDuration: {
          summary: 'Номер дня превышает длительность тура',
          value: {
            success: false,
            statusCode: 400,
            message: 'Номер дня программы не может превышать длительность тура',
          },
        },
        imageUnavailable: {
          summary: 'Изображение недоступно для привязки',
          value: {
            success: false,
            statusCode: 400,
            message: 'Изображение не найдено или уже привязано к туру',
          },
        },
      },
    }),
    ApiConflictResponse({
      description: 'Тур с таким slug уже существует',
      schema: {
        example: {
          success: false,
          statusCode: 409,
          message: 'Тур с таким slug уже существует',
        },
      },
    }),
  );
}

export function ApiFindTourById(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    ApiOperation({ summary: 'Получение активного тура по ID' }),
    ApiParam({
      name: 'id',
      description: 'Идентификатор тура',
      schema: {
        type: 'string',
        format: 'uuid',
        example: tourDetailsExample.id,
      },
    }),
    ApiOkResponse({
      description: 'Тур успешно получен',
      schema: {
        example: {
          success: true,
          message: 'Тур успешно получен',
          data: tourDetailsExample,
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Некорректный UUID тура',
      schema: {
        example: {
          success: false,
          statusCode: 400,
          message: 'Validation failed (uuid is expected)',
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Тур не найден или неактивен',
      schema: {
        example: {
          success: false,
          statusCode: 404,
          message: 'Тур не найден',
        },
      },
    }),
  );
}

export function ApiFindTourByIdForAdmin(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    ApiOperation({
      summary: 'Получение тура по ID администратором',
      description: 'Возвращает активные и неактивные туры.',
    }),
    ApiParam({
      name: 'id',
      description: 'Идентификатор тура',
      schema: {
        type: 'string',
        format: 'uuid',
        example: tourDetailsExample.id,
      },
    }),
    ApiOkResponse({
      description: 'Тур успешно получен',
      schema: {
        example: {
          success: true,
          message: 'Тур успешно получен',
          data: inactiveTourDetailsExample,
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Некорректный UUID тура',
      schema: {
        example: {
          success: false,
          statusCode: 400,
          message: 'Validation failed (uuid is expected)',
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Тур не найден',
      schema: {
        example: {
          success: false,
          statusCode: 404,
          message: 'Тур не найден',
        },
      },
    }),
  );
}

export function ApiRemoveTour(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    ApiOperation({ summary: 'Удаление тура по ID' }),
    ApiParam({
      name: 'id',
      description: 'Идентификатор тура',
      schema: {
        type: 'string',
        format: 'uuid',
        example: tourDetailsExample.id,
      },
    }),
    ApiOkResponse({
      description: 'Тур успешно удалён',
      schema: {
        example: {
          success: true,
          message: 'Тур успешно удалён',
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Некорректный UUID тура',
      schema: {
        example: {
          success: false,
          statusCode: 400,
          message: 'Validation failed (uuid is expected)',
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Тур не найден',
      schema: {
        example: {
          success: false,
          statusCode: 404,
          message: 'Тур не найден',
        },
      },
    }),
  );
}
