import { Injectable, NestMiddleware, Logger, Inject } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private logger: Logger) {
  }

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = request;

    response.on('close', () => {
      const { statusCode } = response;

      this.logger.log(`${method} ${originalUrl} ${statusCode} - ${ip}`);
    });

    next();
  }
}