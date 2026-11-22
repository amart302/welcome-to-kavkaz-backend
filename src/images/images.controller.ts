import {
  BadRequestException,
  Controller,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiPayloadTooLargeResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnsupportedMediaTypeResponse,
} from '@nestjs/swagger';

import { Auth } from '@/common/decorators/auth.decorator';
import { FileUploadInterceptor } from '@/common/interceptors/file-upload.interceptor';

import { imageExample } from './docs/images.examples';
import { ImagesService } from './images.service';

const imageMimeTypes = ['image/jpeg', 'image/png', 'image/webp'] as const;
const fileRequiredMessage = 'Файл не был загружен';

@Controller('images')
@ApiTags('Images')
@ApiInternalServerErrorResponse({
  description: 'Внутренняя ошибка сервера',
  schema: {
    example: {
      success: false,
      statusCode: 500,
      message: 'Внутренняя ошибка сервера',
    },
  },
})
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('upload')
  @Auth()
  @UseInterceptors(FileUploadInterceptor([...imageMimeTypes]))
  @ApiOperation({ summary: 'Загрузка изображения' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
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
  })
  @ApiCreatedResponse({
    description: 'Изображение успешно загружено',
    schema: {
      example: {
        success: true,
        message: 'Изображение успешно загружено',
        data: imageExample,
      },
    },
  })
  @ApiBadRequestResponse({
    description:
      'Файл отсутствует, имеет недопустимый тип или запрос повреждён',
    content: {
      'application/json': {
        examples: {
          fileRequired: {
            summary: 'Файл отсутствует',
            value: {
              success: false,
              statusCode: 400,
              message: fileRequiredMessage,
            },
          },
          invalidFormat: {
            summary: 'Недопустимый MIME-тип файла',
            value: {
              success: false,
              statusCode: 400,
              message: `Разрешены только типы: ${imageMimeTypes.join(', ')}`,
            },
          },
        },
      },
    },
  })
  @ApiPayloadTooLargeResponse({
    description: 'Размер файла превышает 5 МиБ',
    schema: {
      example: {
        success: false,
        statusCode: 413,
        message: 'File too large',
      },
    },
  })
  @ApiUnsupportedMediaTypeResponse({
    description: 'Неподдерживаемый тип multipart-запроса',
    schema: {
      example: {
        success: false,
        statusCode: 415,
        message: 'Unsupported content type',
      },
    },
  })
  @ApiTooManyRequestsResponse({
    description: 'Превышен лимит запросов',
    schema: {
      example: {
        success: false,
        statusCode: 429,
        message: 'ThrottlerException: Too Many Requests',
      },
    },
  })
  upload(
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
        exceptionFactory: () => new BadRequestException(fileRequiredMessage),
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.imagesService.upload(file);
  }
}
