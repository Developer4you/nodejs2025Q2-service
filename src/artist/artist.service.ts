import {
    Injectable,
    NotFoundException,
    Inject,
    forwardRef
} from '@nestjs/common';
import { ArtistRepository } from './repositories/artist.repository';
import { Artist } from './entities/artist.entity';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';
import { FavoritesService } from '../favorites/favorites.service';


@Injectable()
export class ArtistService {
    constructor(
        private readonly repository: ArtistRepository,
        @Inject(forwardRef(() => AlbumService))
        private readonly albumService: AlbumService,
        @Inject(forwardRef(() => TrackService))
        private readonly trackService: TrackService,
        @Inject(forwardRef(() => FavoritesService))
        private readonly favoritesService: FavoritesService,
    ) {}

    findAll(): Artist[] {
        return this.repository.findAll();
    }

    findById(id: string): Artist {
        const artist = this.repository.findById(id);
        if (!artist) throw new NotFoundException('Artist not found');
        return artist;
    }

    create(dto: CreateArtistDto): Artist {
        return this.repository.create(dto);
    }

    update(id: string, dto: UpdateArtistDto): Artist {
        const artist = this.repository.update(id, dto);
        if (!artist) throw new NotFoundException('Artist not found');
        return artist;
    }

    delete(id: string): void {
        console.log('artist.service.delete')
        // Удалить из избранного
        this.favoritesService.removeArtist(id);

        // Обновить связанные сущности
        this.albumService.removeArtistReference(id);
        this.trackService.removeArtistReference(id);

        // Удалить артиста
        console.log('const exists = this.repository.findById(id);')
        const exists = this.repository.findById(id);
        if (!exists) throw new NotFoundException('Artist not found');

        this.repository.delete(id); // Просто удаляем без возврата значения
    }
}