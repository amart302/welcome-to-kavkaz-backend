import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { Auth } from '@/common/decorators/auth.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';
import type { AuthUser } from '@/common/types/auth-user.types';
import type { ServiceDataResponse } from '@/common/types/service-response.types';

import { AuthService } from './auth.service';
import { authTokenExample, currentUserExample } from './docs/auth.examples';
import { LoginDto } from './dto/login.dto';
import type { AuthToken, CurrentUserData } from './types/auth.types';

@Controller('auth')
@ApiTags('Auth')
@ApiInternalServerErrorResponse({
  description: 'Внутренняя ошибка сервера',
  schema: {
    example: {
      success: false,
      statusCode: 500,
      message: 'Внутренняя ошибка сервера',
    },
  },
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiOkResponse({
    description: 'Вход в систему выполнен успешно',
    schema: {
      example: {
        success: true,
        message: 'Вход в систему выполнен успешно',
        data: authTokenExample,
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Ошибка валидации входных данных',
    schema: {
      example: {
        success: false,
        statusCode: 400,
        message: ['Email обязателен'],
      },
    },
  })
  @ApiUnauthorizedResponse({
    description:
      'Пользователь не найден, пароль неверен или учетная запись деактивирована',
    schema: {
      example: {
        success: false,
        statusCode: 401,
        message: 'Неверный email или пароль',
      },
    },
  })
  login(@Body() dto: LoginDto): Promise<ServiceDataResponse<AuthToken>> {
    return this.authService.login(dto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Получение данных пользователя' })
  @ApiOkResponse({
    description: 'Данные пользователя получены',
    schema: {
      example: {
        success: true,
        message: 'Данные пользователя получены',
        data: currentUserExample,
      },
    },
  })
  @Auth()
  getMe(
    @CurrentUser() authUser: AuthUser,
  ): ServiceDataResponse<CurrentUserData> {
    return this.authService.getMe(authUser);
  }
}
