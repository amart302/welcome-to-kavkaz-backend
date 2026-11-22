import type { ImageResponse } from '../types/image.types';

export const imageExample = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  path: 'uploads/6e862453-0e67-47b0-9764-f8d89884b10a.webp',
  originalName: 'mountain.webp',
  mimeType: 'image/webp',
  sizeBytes: 245760,
  createdAt: '2026-11-22T12:00:00.000Z',
} satisfies Omit<ImageResponse, 'createdAt'> & { createdAt: string };
