import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

type ResponseData = {
  success: boolean;
  message: string;
  data?: unknown;
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ResponseData
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ResponseData> {
    return next.handle().pipe(
      map((result: unknown) => {
        if (isObject(result)) {
          const message = 'message' in result ? String(result.message) : 'OK';

          let data: unknown = result;

          if ('data' in result) {
            data = result.data;
          } else if ('message' in result) {
            data = undefined;
          }

          return {
            success: true,
            message,
            data,
          };
        }

        return {
          success: true,
          message: 'OK',
          data: result,
        };
      }),
    );
  }
}
