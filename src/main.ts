import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingService } from './logging/logging.service';
import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const loggingService = app.get(LoggingService);

  const requestLoggerMiddleware = app.get(RequestLoggerMiddleware);
  app.use(requestLoggerMiddleware.use.bind(requestLoggerMiddleware));

  app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        exceptionFactory: (errors) => {
          return new BadRequestException({
            message: 'Validation error',
            errors: errors.map((err) => ({
              property: err.property,
              constraints: err.constraints,
            })),
          });
        },
      }),
  );

  app.useGlobalFilters(new HttpExceptionFilter(loggingService));

  process.on('uncaughtException', (error) => {
    loggingService.error('Uncaught Exception', error.stack);
    process.exit(1);
  });

  process.on('unhandledRejection', (reason: any) => {
    loggingService.error('Unhandled Rejection', reason);
  });

  app.use((req, res, next) => {
    loggingService.log(`Incoming request: ${req.method} ${req.url}`);
    next();
  });

  await app.listen(process.env.PORT || 4000);
}
console.log('dsvdd')
bootstrap();