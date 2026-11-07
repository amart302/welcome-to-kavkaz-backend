import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

import type { AuthUser } from '../types/auth-user.types';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const authHeader = req.headers.authorization;
    const tokenMatch = authHeader?.match(/^Bearer\s+(\S+)$/i);

    if (!tokenMatch) {
      this.logger.warn(
        `Authentication failed: authorization header missing or invalid (ip=${req.ip})`,
      );

      throw new UnauthorizedException('Пожалуйста, авторизуйтесь');
    }

    let decoded: AuthUser;

    try {
      decoded = await this.jwtService.verifyAsync<AuthUser>(tokenMatch[1], {
        secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      });
    } catch {
      this.logger.warn(
        `Authentication failed: JWT validation failed (ip=${req.ip})`,
      );

      throw new UnauthorizedException('Пожалуйста, авторизуйтесь');
    }

    if (
      typeof decoded !== 'object' ||
      decoded === null ||
      !('sub' in decoded) ||
      typeof decoded.sub !== 'string' ||
      !decoded.sub.trim()
    ) {
      this.logger.warn(
        `Authentication failed: JWT payload invalid (ip=${req.ip})`,
      );

      throw new UnauthorizedException('Пожалуйста, авторизуйтесь');
    }

    req.user = { sub: decoded.sub };

    return true;
  }
}
