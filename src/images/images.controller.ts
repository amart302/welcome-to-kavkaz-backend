import {
  BadRequestException,
  Controller,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Auth } from '@/common/decorators/auth.decorator';
import { FileUploadInterceptor } from '@/common/interceptors/file-upload.interceptor';
import { ServiceDataResponse } from '@/common/types/service-response.types';

import {
  fileRequiredMessage,
  imageMimeTypes,
} from './constants/images.constants';
import { ApiUploadImage } from './docs/images.swagger';
import { ImagesService } from './images.service';
import { ImageResponse } from './types/image.types';

@Controller('images')
@ApiTags('Images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('upload')
  @Auth()
  @UseInterceptors(FileUploadInterceptor([...imageMimeTypes]))
  @ApiUploadImage()
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
