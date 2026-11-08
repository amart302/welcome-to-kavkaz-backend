import type { Role } from '@/generated/prisma/enums';

export interface AccessTokenPayload {
  sub: string;
}

export interface AuthUser {
  sub: string;
  role: Role;
}
