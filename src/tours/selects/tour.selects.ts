import type { Prisma } from '@/generated/prisma/client';
import { imageSelect } from '@/images/selects/image.select';

export const tourDetailsSelect = {
  id: true,
  title: true,
  slug: true,
  shortDescription: true,
  description: true,
  price: true,
  durationDays: true,
  durationHours: true,
  location: true,
  meetingPoint: true,
  maxParticipants: true,
  included: true,
  notIncluded: true,
  whatToBring: true,
  importantInfo: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  days: {
    orderBy: { dayNumber: 'asc' },
    select: {
      id: true,
      dayNumber: true,
      title: true,
      description: true,
      overnight: true,
    },
  },
  images: {
    orderBy: [{ position: 'asc' }, { id: 'asc' }],
    select: {
      ...imageSelect,
      position: true,
    },
  },
} satisfies Prisma.TourSelect;
