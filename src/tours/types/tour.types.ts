import { Prisma } from '@/generated/prisma/client';

import { tourDetailsSelect } from '../selects/tour.selects';

export type TourDetailsResponse = Prisma.TourGetPayload<{
  select: typeof tourDetailsSelect;
}>;
