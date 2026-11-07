import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import type { ServiceMessageResponse } from '@/common/types/service-response.types';

import { AppService } from './app.service';

@Controller()
@ApiTags('Health')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @ApiOperation({ summary: 'Проверка доступности API' })
  @ApiOkResponse({
    description: 'API доступен. Подключение к базе данных не проверяется.',
    schema: {
      example: {
        success: true,
        message: 'Hello World!',
      },
    },
  })
  healthCheck(): ServiceMessageResponse {
    return this.appService.healthCheck();
  }
}
