import type { AuthUser } from './auth-user.types';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
