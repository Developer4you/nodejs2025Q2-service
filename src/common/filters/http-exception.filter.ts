import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggingService } from '../../logging/logging.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(@Inject(LoggingService) private readonly loggingService: LoggingService) {}

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        this.loggingService.error(
            `HTTP Exception: ${status} - ${request.url}`,
            exception.stack,
            'HttpExceptionFilter',
        );

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: exception.message || 'Internal server error',
        });
    }
}