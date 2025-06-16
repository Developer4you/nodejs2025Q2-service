import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { User } from './user/user.entity';
import { Artist } from './artist/artist.entity';
import { Album } from './album/album.entity';
import { Track } from './track/track.entity';
import { Favorites } from './favorites/favorites.entity';
import { UserModule } from './user/user.module';
import { ArtistModule } from './artist/artist.module';
import { AlbumModule } from './album/album.module';
import { TrackModule } from './track/track.module';
import { FavoritesModule } from './favorites/favorites.module';
import {AuthModule} from "./auth/auth.module";
import { PassportModule } from '@nestjs/passport';
import {LoggingService} from "./logging/logging.service";
import {HttpExceptionFilter} from "./common/filters/http-exception.filter";
import {JwtAuthGuard} from "./auth/guards/jwt-auth.guard";
import {APP_FILTER, APP_GUARD, Reflector} from "@nestjs/core";
import {CommonModule} from "./common/common.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
      maxListeners: 20,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        logging: true,
        extra: { // Добавляем настройки пула соединений
          max: 20, // максимальное количество соединений в пуле
          connectionTimeoutMillis: 5000, // таймаут подключения (5 секунд)
          idleTimeoutMillis: 10000, // время бездействия перед закрытием (10 секунд)
        },
        poolErrorHandler: (err: any) => { // обработчик ошибок пула
          const loggingService = new LoggingService();
          loggingService.error('Database pool error', err.stack);
        }
      } as TypeOrmModuleOptions),
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    CommonModule,
    AuthModule,
    UserModule,
    ArtistModule,
    AlbumModule,
    TrackModule,
    FavoritesModule,
  ],
  providers: [
    Reflector,
    LoggingService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}