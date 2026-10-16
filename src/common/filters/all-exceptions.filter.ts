import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    const INTERNAL_SERVER_ERROR_MESSAGE = 'Внутренняя ошибка сервера';
    let rawMessage: unknown;

    if (status >= 500) {
      if (exception instanceof Error) {
        this.logger.error('Unhandled exception', exception.stack);
      } else {
        this.logger.error(`Unhandled exception (${String(exception)})`);
      }

      rawMessage = INTERNAL_SERVER_ERROR_MESSAGE;
    } else if (typeof exceptionResponse === 'string') {
      rawMessage = exceptionResponse;
    } else if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      'message' in exceptionResponse
    ) {
      rawMessage = exceptionResponse.message;
    } else {
      rawMessage =
        exception instanceof HttpException
          ? exception.message
          : INTERNAL_SERVER_ERROR_MESSAGE;
    }

    const message = Array.isArray(rawMessage)
      ? rawMessage.map(String)
      : String(rawMessage);

    res.status(status).json({
      success: false,
      statusCode: status,
      message,
    });
  }
}
