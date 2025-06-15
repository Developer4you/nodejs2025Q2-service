import {NestFactory, Reflector} from '@nestjs/core';
import { AppModule } from './app.module';
import {BadRequestException, ClassSerializerInterceptor, ValidationPipe} from '@nestjs/common';
import {HttpExceptionFilter} from "./common/filters/http-exception.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector))
  );

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    exceptionFactory: (errors) => {
      return new BadRequestException({
        message: 'Validation error',
        errors: errors.map(err => ({
          property: err.property,
          constraints: err.constraints,
        })),
      });
    }
  }));

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.PORT || 4000);
}

bootstrap();
