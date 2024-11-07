import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Error } from '../dto/error';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message: string | object =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal Server Error';
    const messageString =
      typeof message !== 'string' ? (message as any).message : message;
    const errorMessage =
      typeof message !== 'string' ? (message as any).error : '';

    const errorObject = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: messageString,
      additionalErrorInfo: errorMessage,
    } as Error;
    response.status(status).json(errorObject);
  }
}
