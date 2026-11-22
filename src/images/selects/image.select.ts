import type { Prisma } from '@/generated/prisma/client';

export const imageSelect = {
  id: true,
  path: true,
  originalName: true,
  mimeType: true,
  sizeBytes: true,
  createdAt: true,
} satisfies Prisma.ImageSelect;
