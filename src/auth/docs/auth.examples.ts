import type { AuthToken, CurrentUserData } from '../types/auth.types';

export const authTokenExample: AuthToken = {
  accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
};

export const currentUserExample: CurrentUserData = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  role: 'ADMIN',
};
