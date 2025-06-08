import {
  Injectable,
  NotFoundException,
  BadRequestException, forwardRef, Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {DeepPartial, Repository} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Album } from './entities/album.entity';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { ArtistService } from '../artist/artist.service';
import { TrackService } from '../track/track.service';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class AlbumService {
  constructor(
      @InjectRepository(Album)
      private readonly albumRepository: Repository<Album>,
      @Inject(forwardRef(() => ArtistService)) // Добавляем forwardRef
      private readonly artistService: ArtistService,
      @Inject(forwardRef(() => TrackService)) // Добавляем forwardRef
      private readonly trackService: TrackService,
      private readonly favoritesService: FavoritesService,
  ) {}

  async findAll(): Promise<Album[]> {
    return this.albumRepository.find();
  }

  async findById(id: string): Promise<Album> {
    const album = await this.albumRepository.findOneBy({ id });
    if (!album) throw new NotFoundException('Album not found');
    return album;
  }

  async create(dto: CreateAlbumDto): Promise<Album> {
    if (dto.artistId) {
      await this.validateArtistExists(dto.artistId);
    }

    const album = this.albumRepository.create(dto);
    return this.albumRepository.save(album);
  }

  async update(id: string, dto: UpdateAlbumDto): Promise<Album> {
    if (dto.artistId) {
      await this.validateArtistExists(dto.artistId);
    }

    const album = await this.albumRepository.preload(dto as DeepPartial<Album> & { id: string });

    if (!album) throw new NotFoundException('Album not found');

    return this.albumRepository.save(album);
  }

  async delete(id: string): Promise<void> {
    const album = await this.albumRepository.findOneBy({ id });
    if (!album) throw new NotFoundException('Album not found');

    await this.favoritesService.removeAlbum(id);
    await this.trackService.removeAlbumReference(id);

    await this.albumRepository.delete(id);
  }

  async removeArtistReference(artistId: string): Promise<void> {
    await this.albumRepository
        .createQueryBuilder()
        .update(Album)
        .set({ artistId: null } as QueryDeepPartialEntity<Album>)
        .where('artistId = :artistId', { artistId })
        .execute();
  }

  private async validateArtistExists(artistId: string): Promise<void> {
    try {
      await this.artistService.findById(artistId);
    } catch {
      throw new BadRequestException('Artist not found');
    }
  }
}