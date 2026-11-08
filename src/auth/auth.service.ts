import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import type {
  AccessTokenPayload,
  AuthUser,
} from '@/common/types/auth-user.types';
import type { ServiceDataResponse } from '@/common/types/service-response.types';
import { PrismaService } from '@/prisma/prisma.service';

import { LoginDto } from './dto/login.dto';
import type { AuthToken, CurrentUserData } from './types/auth.types';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private async generateAccessToken(
    payload: AccessTokenPayload,
  ): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  async login(dto: LoginDto): Promise<ServiceDataResponse<AuthToken>> {
    this.logger.log('Login started');

    const { email, password } = dto;

    const user = await this.prismaService.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        passwordHash: true,
        isActive: true,
      },
    });

    if (!user) {
      this.logger.warn('Login failed: user not found');

      throw new UnauthorizedException('Неверный email или пароль');
    }

    if (!user.isActive) {
      this.logger.warn(`Login failed: user inactive (userId=${user.id})`);

      throw new UnauthorizedException('Неверный email или пароль');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      this.logger.warn(`Login failed: invalid password (userId=${user.id})`);

      throw new UnauthorizedException('Неверный email или пароль');
    }

    const accessToken = await this.generateAccessToken({ sub: user.id });

    this.logger.log(`Login completed successfully (userId=${user.id})`);

    return {
      message: 'Вход в систему выполнен успешно',
      data: { accessToken },
    };
  }

  getMe(authUser: AuthUser): ServiceDataResponse<CurrentUserData> {
    this.logger.log('Get user started');

    const { sub, role } = authUser;

    this.logger.log(`Get user completed successfully (userId=${sub})`);

    return {
      message: 'Данные пользователя получены',
      data: { id: sub, role },
    };
  }
}
