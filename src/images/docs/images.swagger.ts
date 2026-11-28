import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiPayloadTooLargeResponse,
} from '@nestjs/swagger';

import {
  fileRequiredMessage,
  imageMimeTypes,
} from '../constants/images.constants';
import { imageExample } from './images.examples';

export function ApiUploadImage(): ReturnType<typeof applyDecorators> {
  return applyDecorators(
    ApiOperation({ summary: 'Загрузка изображения' }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      required: true,
      schema: {
        type: 'object',
        required: ['file'],
        properties: {
          file: {
            type: 'string',
            format: 'binary',
            description: `Изображение размером до 5 МиБ (${imageMimeTypes.join(', ')})`,
          },
        },
      },
    }),
    ApiCreatedResponse({
      description: 'Изображение успешно загружено',
      schema: {
        example: {
          success: true,
          message: 'Изображение успешно загружено',
          data: imageExample,
        },
      },
    }),
    ApiBadRequestResponse({
      description:
        'Файл отсутствует, имеет недопустимый тип или запрос повреждён',
      schema: {
        example: {
          success: false,
          statusCode: 400,
          message: fileRequiredMessage,
        },
      },
    }),
    ApiPayloadTooLargeResponse({
      description: 'Размер файла превышает 5 МиБ',
      schema: {
        example: {
          success: false,
          statusCode: 413,
          message: 'File too large',
        },
      },
    }),
  );
}
