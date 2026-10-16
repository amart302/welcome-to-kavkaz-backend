import { Injectable } from '@nestjs/common';

import type { ServiceMessageResponse } from '@/common/types/service-response.types';

@Injectable()
export class AppService {
  healthCheck(): ServiceMessageResponse {
    return {
      message: 'Hello World!',
    };
  }
}
