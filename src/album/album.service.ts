import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { AlbumRepository } from './repositories/album.repository';
import { Album } from './entities/album.entity';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { ArtistService } from '../artist/artist.service';
import { TrackService } from '../track/track.service';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class AlbumService {
  constructor(
    private readonly repository: AlbumRepository,
    @Inject(forwardRef(() => ArtistService))
    private readonly artistService: ArtistService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
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
    // Удалить из избранного
    this.favoritesService.removeAlbum(id);

    // Обновить связанные треки
    this.trackService.removeAlbumReference(id);

    // Удалить альбом
    const success = this.repository.delete(id);
    if (!success) throw new NotFoundException('Album not found');
  }

  removeArtistReference(artistId: string): void {
    this.repository.removeArtistReference(artistId);
  }
}
