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

    const response =
      exception instanceof HttpException ? exception.getResponse() : null;

    let rawMessage: unknown;

    if (
      typeof response === 'object' &&
      response !== null &&
      'message' in response
    ) {
      rawMessage = response.message;
    } else {
      if (exception instanceof Error) {
        this.logger.error('Unhandled exception', exception.stack);
      } else {
        this.logger.error(`Unhandled exception (${String(exception)})`);
      }

      rawMessage = 'Внутренняя ошибка сервера';
    }

    const message = Array.isArray(rawMessage)
      ? String(rawMessage[0])
      : String(rawMessage);

    res.status(status).json({
      success: false,
      statusCode: status,
      message,
    });
  }
}
