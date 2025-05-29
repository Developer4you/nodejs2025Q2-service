import {
    Injectable,
    NotFoundException,
    BadRequestException
} from '@nestjs/common';
import { AlbumRepository } from './repositories/album.repository';
import { Album } from './entities/album.entity';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { ArtistService } from '../artist/artist.service';

@Injectable()
export class AlbumService {
    constructor(
        private readonly repository: AlbumRepository,
        private readonly artistService: ArtistService,
    ) {}

    findAll(): Album[] {
        return this.repository.findAll();
    }

    findById(id: string): Album {
        const album = this.repository.findById(id);
        if (!album) throw new NotFoundException('Album not found');
        return album;
    }

    async create(dto: CreateAlbumDto): Promise<Album> {
        if (dto.artistId) {
            try {
                await this.artistService.findById(dto.artistId);
            } catch {
                throw new BadRequestException('Artist not found');
            }
        }
        return this.repository.create(dto);
    }

    async update(id: string, dto: UpdateAlbumDto): Promise<Album> {
        if (dto.artistId) {
            try {
                await this.artistService.findById(dto.artistId);
            } catch {
                throw new BadRequestException('Artist not found');
            }
        }

        const updatedAlbum = this.repository.update(id, dto);
        if (!updatedAlbum) throw new NotFoundException('Album not found');
        return updatedAlbum;
    }

    delete(id: string): void {
        const success = this.repository.delete(id);
        if (!success) throw new NotFoundException('Album not found');
    }

    removeArtistReference(artistId: string): void {
        this.repository.removeArtistReference(artistId);
    }
}