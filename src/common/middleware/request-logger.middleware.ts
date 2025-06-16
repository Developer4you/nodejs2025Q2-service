import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggingService } from '../../logging/logging.service';

// @Injectable()
// export class RequestLoggerMiddleware implements NestMiddleware {
//     constructor(private readonly loggingService: LoggingService) {}
//
//     use(req: Request, res: Response, next: NextFunction) {
//         const { method, originalUrl, body, query } = req;
//         const start = Date.now();
//
//         res.on('finish', () => {
//             const { statusCode } = res;
//             const duration = Date.now() - start;
//
//             this.loggingService.log(
//                 `${method} ${originalUrl} ${statusCode} ${duration}ms - Body: ${JSON.stringify(body)} - Query: ${JSON.stringify(query)}`
//             );
//         });
//
//         next();
//     }
// }

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
    constructor(private readonly loggingService: LoggingService) {}

    use(req: Request, res: Response, next: NextFunction) {
        const { method, originalUrl } = req;
        this.loggingService.log(`Incoming request: ${method} ${originalUrl}`);
        next();
    }
}