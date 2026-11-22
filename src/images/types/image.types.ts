import type { Prisma } from '@/generated/prisma/client';

import type { imageSelect } from '../selects/image.select';

export type ImageResponse = Prisma.ImageGetPayload<{
  select: typeof imageSelect;
}>;
