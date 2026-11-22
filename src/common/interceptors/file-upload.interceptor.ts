import { randomUUID } from 'node:crypto';

import { BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { diskStorage } from 'multer';

const ALLOWED_MIME_TYPES = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'application/pdf': '.pdf',
} as const;

type AllowedMimeType = keyof typeof ALLOWED_MIME_TYPES;

export function FileUploadInterceptor(
  allowedMimeTypes: AllowedMimeType[],
  maxSize: number = 5 * 1024 * 1024,
) {
  return FileInterceptor('file', {
    storage: diskStorage({
      destination: 'uploads',
      filename: (_req: Request, file: Express.Multer.File, cb) => {
        const extension = ALLOWED_MIME_TYPES[file.mimetype as AllowedMimeType];

        cb(null, `${randomUUID()}${extension}`);
      },
    }),

    limits: {
      fileSize: maxSize,
    },

    fileFilter: (_req: Request, file: Express.Multer.File, cb) => {
      const isAllowed = allowedMimeTypes.some(
        (mimeType) => mimeType === file.mimetype,
      );

      if (!isAllowed) {
        return cb(
          new BadRequestException(
            `Разрешены только типы: ${allowedMimeTypes.join(', ')}`,
          ),
          false,
        );
      }

      cb(null, true);
    },
  });
}
