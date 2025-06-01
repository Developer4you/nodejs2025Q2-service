import { Module, forwardRef } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { ArtistRepository } from './repositories/artist.repository';
import { AlbumModule } from '../album/album.module';
import { TrackModule } from '../track/track.module';
import { FavoritesModule } from '../favorites/favorites.module';

@Module({
    imports: [
        forwardRef(() => AlbumModule),
        forwardRef(() => TrackModule),
        forwardRef(() => FavoritesModule),
    ],
    controllers: [ArtistController],
    providers: [
        ArtistService,
        ArtistRepository,
    ],
    exports: [ArtistService, ArtistRepository],
})
export class ArtistModule {}