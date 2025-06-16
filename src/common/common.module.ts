import { Module } from '@nestjs/common';
import { RequestLoggerMiddleware } from './middleware/request-logger.middleware';
import { LoggingService } from '../logging/logging.service';

@Module({
    providers: [LoggingService, RequestLoggerMiddleware],
    exports: [RequestLoggerMiddleware],
})
export class CommonModule {}