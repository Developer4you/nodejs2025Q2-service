import { Module } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { AlbumRepository } from './repositories/album.repository';
import { ArtistModule } from '../artist/artist.module';

@Module({
    imports: [ArtistModule],
    controllers: [AlbumController],
    providers: [
        AlbumService,
        AlbumRepository,
    ],
    exports: [AlbumService],
})
export class AlbumModule {}