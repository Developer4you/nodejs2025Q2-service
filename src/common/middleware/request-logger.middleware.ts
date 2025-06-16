import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggingService } from '../../logging/logging.service';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
    constructor(@Inject(LoggingService) private readonly loggingService: LoggingService) {}

    use(req: Request, res: Response, next: NextFunction) {
        const { method, originalUrl, body, query } = req;
        const start = Date.now();

        res.on('finish', () => {
            const { statusCode } = res;
            const duration = Date.now() - start;

            this.loggingService.log(
                `${method} ${originalUrl} ${statusCode} ${duration}ms - Body: ${JSON.stringify(
                    body,
                )} - Query: ${JSON.stringify(query)}`,
                'RequestLogger',
            );
        });

        next();
    }
}