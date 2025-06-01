import { Module, forwardRef } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { AlbumRepository } from './repositories/album.repository';
import { ArtistModule } from '../artist/artist.module';
import { TrackModule } from '../track/track.module';
import { FavoritesModule } from '../favorites/favorites.module';

@Module({
    imports: [
        forwardRef(() => ArtistModule),
        forwardRef(() => TrackModule),
        forwardRef(() => FavoritesModule),
    ],
    controllers: [AlbumController],
    providers: [
        AlbumService,
        AlbumRepository,
    ],
    exports: [AlbumService, AlbumRepository],
})
export class AlbumModule {}