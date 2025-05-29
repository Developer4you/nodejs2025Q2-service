import { Module, forwardRef } from '@nestjs/common';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { FavoritesRepository } from './repositories/favorites.repository';
import { ArtistModule } from '../artist/artist.module';
import { AlbumModule } from '../album/album.module';
import { TrackModule } from '../track/track.module';

@Module({
    imports: [
        forwardRef(() => ArtistModule),
        forwardRef(() => AlbumModule),
        forwardRef(() => TrackModule),
    ],
    controllers: [FavoritesController],
    providers: [
        FavoritesService,
        FavoritesRepository,
    ],
    exports: [FavoritesRepository],
})
export class FavoritesModule {}