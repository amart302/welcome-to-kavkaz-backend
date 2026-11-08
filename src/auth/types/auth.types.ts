import type { Role } from '@/generated/prisma/enums';

export interface AuthToken {
  accessToken: string;
}

export interface CurrentUserData {
  id: string;
  role: Role;
}
