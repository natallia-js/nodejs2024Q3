import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AppLoggerMiddleware.name);

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, baseUrl, url, body, params } = request;
    const requestStartTime = new Date().getTime();
    const userAgent = request.get('user-agent') || '';

    response.on('finish', () => {
      const { statusCode } = response;
      const responseTime = new Date().getTime();
      const duration = responseTime - requestStartTime;
      const contentLength = response.get('content-length');

      this.logger.log(`REQ: method=${method}, userAgent=${userAgent}, ip=${ip}, baseUrl=${baseUrl}, url=${url}, body=${JSON.stringify(body)}, params=${JSON.stringify(params)}; ` +
                      `RESP: statusCode=${statusCode}, duration=${duration}msec, contentLength=${contentLength}`);
    });

    next();
  }
}
