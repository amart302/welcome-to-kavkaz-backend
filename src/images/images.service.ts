import { unlink } from 'node:fs/promises';

import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { ServiceDataResponse } from '@/common/types/service-response.types';
import { PrismaService } from '@/prisma/prisma.service';

import { imageSelect } from './selects/image.select';
import { ImageResponse } from './types/image.types';

@Injectable()
export class ImagesService {
  private readonly logger = new Logger(ImagesService.name);

  private readonly ORPHAN_FILE_TTL_MS = 24 * 60 * 60 * 1000;

  constructor(private readonly prismaService: PrismaService) {}

  private async removePhysicalFiles(
    images: { id: string; path: string }[],
  ): Promise<string[]> {
    const results = await Promise.all(
      images.map(async ({ id, path }) => {
        try {
          await unlink(path);
          return id;
        } catch (error) {
          if (
            error instanceof Error &&
            'code' in error &&
            error.code === 'ENOENT'
          ) {
            return id;
          }

          this.logger.warn(
            `Physical file deletion failed (path=${path})`,
            error instanceof Error
              ? (error.stack ?? error.message)
              : String(error),
          );
          return null;
        }
      }),
    );

    return results.filter((item) => item !== null);
  }

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

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async removeOrphanImages(): Promise<void> {
    this.logger.log('Orphan images cleanup started');

    const images = await this.prismaService.image.findMany({
      where: {
        tourId: null,
        createdAt: {
          lt: new Date(Date.now() - this.ORPHAN_FILE_TTL_MS),
        },
      },
      select: {
        id: true,
        path: true,
      },
    });

    if (!images.length) {
      this.logger.log('Orphan images cleanup skipped: no orphan images found');

      return;
    }

    const imageIdsToDelete = await this.removePhysicalFiles(images);

    if (!imageIdsToDelete.length) {
      this.logger.log(
        'Orphan images cleanup skipped: no image files could be removed',
      );

      return;
    }

    const { count } = await this.prismaService.image.deleteMany({
      where: {
        id: {
          in: imageIdsToDelete,
        },
        tourId: null,
      },
    });

    this.logger.log(
      `Orphan images cleanup completed successfully (removed=${count})`,
    );
  }
}
