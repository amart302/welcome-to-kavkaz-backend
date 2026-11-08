import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { isUUID } from 'class-validator';
import type { Request } from 'express';

import { PrismaService } from '@/prisma/prisma.service';

import type { AccessTokenPayload } from '../types/auth-user.types';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private readonly prismaService: PrismaService,
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

    let decoded: AccessTokenPayload;

    try {
      decoded = await this.jwtService.verifyAsync<AccessTokenPayload>(
        tokenMatch[1],
        {
          secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
        },
      );
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
      !isUUID(decoded.sub)
    ) {
      this.logger.warn(
        `Authentication failed: JWT payload invalid (ip=${req.ip})`,
      );

      throw new UnauthorizedException('Пожалуйста, авторизуйтесь');
    }

    const user = await this.prismaService.user.findUnique({
      where: { id: decoded.sub },
      select: { id: true, role: true, isActive: true },
    });

    if (!user) {
      this.logger.warn(
        `Authentication failed: user not found (userId=${decoded.sub})`,
      );

      throw new UnauthorizedException('Пожалуйста, авторизуйтесь');
    }

    if (!user.isActive) {
      this.logger.warn(
        `Authentication failed: user inactive (userId=${user.id})`,
      );

      throw new UnauthorizedException('Пожалуйста, авторизуйтесь');
    }

    req.user = { sub: user.id, role: user.role };

    return true;
  }
}
