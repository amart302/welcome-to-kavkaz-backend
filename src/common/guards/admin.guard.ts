import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

import { Role } from '@/generated/prisma/enums';

@Injectable()
export class AdminGuard implements CanActivate {
  private readonly logger = new Logger(AdminGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const { user, ip } = context.switchToHttp().getRequest<Request>();

    if (!user) {
      this.logger.warn(`Authorization failed: user missing (ip=${ip})`);

      throw new UnauthorizedException('Пожалуйста, авторизуйтесь');
    }

    if (user.role !== Role.ADMIN) {
      this.logger.warn(
        `Authorization failed: admin role required (userId=${user.sub})`,
      );

      throw new ForbiddenException('Доступ разрешён только администраторам');
    }

    return true;
  }
}
