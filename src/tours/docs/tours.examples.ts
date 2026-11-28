export const tourDetailsExample = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  title: 'В сердце горной Ингушетии',
  slug: 'v-serdtse-gornoy-ingushetii',
  shortDescription: 'Горные панорамы и древние башни за один день.',
  description: 'Познакомимся с историей и природой горной Ингушетии.',
  price: 7000,
  durationDays: 1,
  durationHours: 9,
  location: 'Горная Ингушетия',
  meetingPoint: 'Главный вход железнодорожного вокзала Владикавказа',
  maxParticipants: 6,
  included: ['Транспорт', 'Сопровождение гида'],
  notIncluded: ['Обед'],
  whatToBring: ['Удобная обувь', 'Вода'],
  importantInfo: 'Маршрут может меняться из-за погоды.',
  isActive: true,
  createdAt: '2026-11-26T10:00:00.000Z',
  updatedAt: '2026-11-26T10:00:00.000Z',
  days: [
    {
      id: 'bbf7f2b1-b044-40e5-9890-d536f41a11e4',
      dayNumber: 1,
      title: 'Водопад и башни Эрзи',
      description: 'Посетим Ляжгинский водопад и башенный комплекс Эрзи.',
      overnight: null,
    },
  ],
  images: [
    {
      id: '848d5341-08b2-4d60-8877-efcb31d71ea9',
      path: 'uploads/848d5341-08b2-4d60-8877-efcb31d71ea9.webp',
      originalName: 'erzi.webp',
      mimeType: 'image/webp',
      sizeBytes: 46550,
      createdAt: '2026-11-26T09:55:00.000Z',
      position: 1,
    },
  ],
};

export const inactiveTourDetailsExample = {
  ...tourDetailsExample,
  isActive: false,
};
