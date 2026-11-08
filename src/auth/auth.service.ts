import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import type { AuthUser } from '@/common/types/auth-user.types';
import { PrismaService } from '@/prisma/prisma.service';

import { LoginDto } from './dto/login.dto';
import { AuthWithTokenResponse } from './types/auth.types';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private async generateAccessToken(authUser: AuthUser): Promise<string> {
    return this.jwtService.signAsync(authUser);
  }

  async login(dto: LoginDto): Promise<AuthWithTokenResponse> {
    this.logger.log('Login started');

    const { email, password } = dto;

    const user = await this.prismaService.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        role: true,
        passwordHash: true,
      },
    });

    if (!user) {
      this.logger.warn('Login failed: user not found');

      throw new UnauthorizedException('Неверный email или пароль');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      this.logger.warn(`Login failed: invalid password (userId=${user.id})`);

      throw new UnauthorizedException('Неверный email или пароль');
    }

    const accessToken = await this.generateAccessToken({
      sub: user.id,
      role: user.role,
    });

    this.logger.log(`Login completed successfully (userId=${user.id})`);

    return {
      message: 'Вход в систему выполнен успешно',
      data: { accessToken },
    };
  }
}
