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
  ApiOperation,
  ApiPayloadTooLargeResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Auth } from '@/common/decorators/auth.decorator';
import { FileUploadInterceptor } from '@/common/interceptors/file-upload.interceptor';
import { ServiceDataResponse } from '@/common/types/service-response.types';

import { imageExample } from './docs/images.examples';
import { ImagesService } from './images.service';
import { ImageResponse } from './types/image.types';

const imageMimeTypes = ['image/jpeg', 'image/png', 'image/webp'] as const;
const fileRequiredMessage = 'Файл не был загружен';

@Controller('images')
@ApiTags('Images')
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
    schema: {
      example: {
        success: false,
        statusCode: 400,
        message: fileRequiredMessage,
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
  upload(
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: true,
        exceptionFactory: () => new BadRequestException(fileRequiredMessage),
      }),
    )
    file: Express.Multer.File,
  ): Promise<ServiceDataResponse<ImageResponse>> {
    return this.imagesService.upload(file);
  }
}
