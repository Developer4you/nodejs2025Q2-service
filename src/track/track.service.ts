import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { TrackRepository } from './repositories/track.repository';
import { Track } from './entities/track.entity';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { ArtistService } from '../artist/artist.service';
import { AlbumService } from '../album/album.service';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class TrackService {
  constructor(
    private readonly repository: TrackRepository,
    @Inject(forwardRef(() => ArtistService))
    private readonly artistService: ArtistService,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {}

  findAll(): Track[] {
    return this.repository.findAll();
  }

  findById(id: string): Track {
    const track = this.repository.findById(id);
    if (!track) throw new NotFoundException('Track not found');
    return track;
  }

  async create(dto: CreateTrackDto): Promise<Track> {
    if (dto.artistId) {
      try {
        await this.artistService.findById(dto.artistId);
      } catch {
        throw new BadRequestException('Artist not found');
      }
    }

    if (dto.albumId) {
      try {
        await this.albumService.findById(dto.albumId);
      } catch {
        throw new BadRequestException('Album not found');
      }
    }

    return this.repository.create(dto);
  }

  async update(id: string, dto: UpdateTrackDto): Promise<Track> {
    if (dto.artistId) {
      try {
        await this.artistService.findById(dto.artistId);
      } catch {
        throw new BadRequestException('Artist not found');
      }
    }

    if (dto.albumId) {
      try {
        await this.albumService.findById(dto.albumId);
      } catch {
        throw new BadRequestException('Album not found');
      }
    }

    const updatedTrack = this.repository.update(id, dto);
    if (!updatedTrack) throw new NotFoundException('Track not found');
    return updatedTrack;
  }

  delete(id: string): void {
    const success = this.repository.delete(id);
    if (!success) throw new NotFoundException('Track not found');
  }

  removeArtistReference(artistId: string): void {
    this.repository.removeArtistReference(artistId);
  }

  removeAlbumReference(albumId: string): void {
    this.repository.removeAlbumReference(albumId);
  }
}
