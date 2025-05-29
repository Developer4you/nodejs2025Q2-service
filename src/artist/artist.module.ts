import { Module } from '@nestjs/common';
import { ArtistController } from './artist.controller';
import { ArtistService } from './artist.service';
import { ArtistRepository } from './repositories/artist.repository';

@Module({
    controllers: [ArtistController],
    providers: [
        ArtistService,
        ArtistRepository,
    ],
    exports: [ArtistService],
})
export class ArtistModule {}