import { Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { TrackRepository } from './repositories/track.repository';
import { ArtistModule } from '../artist/artist.module';
import { AlbumModule } from '../album/album.module';

@Module({
    imports: [ArtistModule, AlbumModule],
    controllers: [TrackController],
    providers: [
        TrackService,
        TrackRepository,
    ],
    exports: [TrackService],
})
export class TrackModule {}