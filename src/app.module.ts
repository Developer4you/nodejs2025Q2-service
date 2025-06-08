import { Module, forwardRef } from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import { UserModule } from './user/user.module';
import { ArtistModule } from './artist/artist.module';
import { TrackModule } from './track/track.module';
import { AlbumModule } from './album/album.module';
import { FavoritesModule } from './favorites/favorites.module';
import {Favorites} from "./favorites/entities/favorites.entity";
import {Track} from "./track/entities/track.entity";
import {Album} from "./album/entities/album.entity";
import {Artist} from "./artist/entities/artist.entity";
import {User} from "./user/entities/user.entity";
import {TypeOrmModule, TypeOrmModuleOptions} from "@nestjs/typeorm";

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    forwardRef(() => ArtistModule),
    forwardRef(() => AlbumModule),
    forwardRef(() => TrackModule),
    forwardRef(() => FavoritesModule),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService): TypeOrmModuleOptions => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [User, Artist, Album, Track, Favorites],
        synchronize: true, // Только для разработки!
        autoLoadEntities: true,
        // Дополнительные настройки для продакшена:
        extra: {
          ssl: config.get<string>('NODE_ENV') === 'production'
              ? { rejectUnauthorized: false }
              : null,
        },
      }),
    }),
  ],
})
export class AppModule {}
