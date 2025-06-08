import {
  Injectable,
  NotFoundException,
  BadRequestException, forwardRef, Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {DeepPartial, Repository} from 'typeorm';
import { Track } from './entities/track.entity';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { ArtistService } from '../artist/artist.service';
import { AlbumService } from '../album/album.service';
import { FavoritesService } from '../favorites/favorites.service';
import {QueryDeepPartialEntity} from "typeorm/query-builder/QueryPartialEntity";

@Injectable()
export class TrackService {
  constructor(
      @InjectRepository(Track)
      private readonly trackRepository: Repository<Track>,
      @Inject(forwardRef(() => ArtistService))
      private readonly artistService: ArtistService,
      @Inject(forwardRef(() => AlbumService))
      private readonly albumService: AlbumService,
      private readonly favoritesService: FavoritesService,
  ) {}

  async findAll(): Promise<Track[]> {
    return this.trackRepository.find();
  }

  async findById(id: string): Promise<Track> {
    const track = await this.trackRepository.findOneBy({ id });
    if (!track) throw new NotFoundException('Track not found');
    return track;
  }

  async create(dto: CreateTrackDto): Promise<Track> {
    if (dto.artistId) {
      await this.validateArtistExists(dto.artistId);
    }

    if (dto.albumId) {
      await this.validateAlbumExists(dto.albumId);
    }

    const track = this.trackRepository.create(dto);
    return this.trackRepository.save(track);
  }

  async update(id: string, dto: UpdateTrackDto): Promise<Track> {
    if (dto.artistId) {
      await this.validateArtistExists(dto.artistId);
    }

    if (dto.albumId) {
      await this.validateAlbumExists(dto.albumId);
    }

    const track = await this.trackRepository.preload(dto as DeepPartial<Track> & { id: string });

    if (!track) throw new NotFoundException('Track not found');

    return this.trackRepository.save(track);
  }

  async delete(id: string): Promise<void> {
    const result = await this.trackRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Track not found');
    }

    await this.favoritesService.removeTrack(id);
  }

  async removeArtistReference(artistId: string): Promise<void> {
    await this.trackRepository
        .createQueryBuilder()
        .update(Track)
        .set({ artistId: null } as QueryDeepPartialEntity<Track>)
        .where('artistId = :artistId', { artistId })
        .execute();
  }

  async removeAlbumReference(albumId: string): Promise<void> {
    await this.trackRepository
        .createQueryBuilder()
        .update(Track)
        .set({ artistId: null } as QueryDeepPartialEntity<Track>)
        .where('albumId = :albumId', { albumId })
        .execute();
  }

  private async validateArtistExists(artistId: string): Promise<void> {
    try {
      await this.artistService.findById(artistId);
    } catch {
      throw new BadRequestException('Artist not found');
    }
  }

  private async validateAlbumExists(albumId: string): Promise<void> {
    try {
      await this.albumService.findById(albumId);
    } catch {
      throw new BadRequestException('Album not found');
    }
  }
}