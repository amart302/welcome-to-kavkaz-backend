import { unlink } from 'node:fs/promises';

import { Injectable, Logger } from '@nestjs/common';

import { ServiceDataResponse } from '@/common/types/service-response.types';
import { PrismaService } from '@/prisma/prisma.service';

import { imageSelect } from './selects/image.select';
import { ImageResponse } from './types/image.types';

@Injectable()
export class ImagesService {
  private readonly logger = new Logger(ImagesService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async upload(
    file: Express.Multer.File,
  ): Promise<ServiceDataResponse<ImageResponse>> {
    this.logger.log(`Image record creation started (path=${file.path})`);

    const {
      path,
      originalname: originalName,
      mimetype: mimeType,
      size: sizeBytes,
    } = file;

    try {
      const createdImage = await this.prismaService.image.create({
        data: {
          path,
          originalName,
          mimeType,
          sizeBytes,
        },
        select: imageSelect,
      });

      this.logger.log(`Image record created (id=${createdImage.id})`);

      return {
        message: 'Изображение успешно загружено',
        data: createdImage,
      };
    } catch (error) {
      this.logger.error(
        `Image record creation failed (path=${file.path})`,
        error instanceof Error ? error.stack : String(error),
      );

      try {
        this.logger.log(`File cleanup started (path=${file.path})`);

        await unlink(file.path);

        this.logger.log(
          `File cleanup completed successfully (path=${file.path})`,
        );
      } catch (cleanupError) {
        const isMissing =
          cleanupError instanceof Error &&
          'code' in cleanupError &&
          cleanupError.code === 'ENOENT';

        if (isMissing) {
          this.logger.warn(
            `File cleanup skipped: file not found (path=${file.path})`,
          );
        } else {
          this.logger.error(
            `File cleanup failed (path=${file.path})`,
            cleanupError instanceof Error
              ? cleanupError.stack
              : String(cleanupError),
          );
        }
      }

      throw error;
    }
  }
}
