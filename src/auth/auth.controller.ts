import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Auth } from '@/common/decorators/auth.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { AuthUser } from '@/common/types/auth-user.types';
import type { ServiceDataResponse } from '@/common/types/service-response.types';

import { AuthService } from './auth.service';
import { ApiGetCurrentUser, ApiLoginUser } from './docs/auth.swagger';
import { LoginDto } from './dto/login.dto';
import type { AuthToken, CurrentUserData } from './types/auth.types';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiLoginUser()
  login(@Body() dto: LoginDto): Promise<ServiceDataResponse<AuthToken>> {
    return this.authService.login(dto);
  }

  @Get('me')
  @Auth()
  @ApiGetCurrentUser()
  getMe(
    @CurrentUser() authUser: AuthUser,
  ): ServiceDataResponse<CurrentUserData> {
    return this.authService.getMe(authUser);
  }
}
