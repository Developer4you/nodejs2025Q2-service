import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Track } from './track.entity';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ArtistDeletedEvent } from '../events/artist-deleted.event';
import { AlbumDeletedEvent } from '../events/album-deleted.event';
import { TrackDeletedEvent } from '../events/track-deleted.event';
import { OnEvent } from '@nestjs/event-emitter';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Artist } from '../artist/artist.entity';
import { Album } from '../album/album.entity';

@Injectable()
export class TrackService {
  constructor(
      @InjectRepository(Track)
      private readonly trackRepository: Repository<Track>,
      @InjectRepository(Artist)
      private readonly artistRepository: Repository<Artist>,
      @InjectRepository(Album)
      private readonly albumRepository: Repository<Album>,
      private readonly eventEmitter: EventEmitter2,
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

    const track = await this.trackRepository.create(dto);
    return this.trackRepository.save(track);
  }

  async update(id: string, dto: UpdateTrackDto): Promise<Track> {

    const track = await this.trackRepository.findOneBy({ id });
    if (!track) throw new NotFoundException('Track not found');

    if (dto.artistId !== undefined) {
      if (dto.artistId) {
        await this.validateArtistExists(dto.artistId);
        track.artistId = dto.artistId;
      } else {
        track.artistId = null;
      }
    }

    if (dto.albumId !== undefined) {
      if (dto.albumId) {
        await this.validateAlbumExists(dto.albumId);
        track.albumId = dto.albumId;
      } else {
        track.albumId = null;
      }
    }

    if (dto.name !== undefined) {
      track.name = dto.name;
    }

    if (dto.duration !== undefined) {
      track.duration = dto.duration;
    }

    return this.trackRepository.save(track);
  }

  async delete(id: string): Promise<void> {
    const track = await this.trackRepository.findOneBy({ id });
    if (!track) throw new NotFoundException('Track not found');

    this.eventEmitter.emit('track.deleted', new TrackDeletedEvent(id));

    await this.trackRepository.delete(id);
  }

  @OnEvent('artist.deleted')
  async handleArtistDeleted(event: ArtistDeletedEvent) {
    await this.removeArtistReference(event.artistId);
  }

  @OnEvent('album.deleted')
  async handleAlbumDeleted(event: AlbumDeletedEvent) {
    await this.removeAlbumReference(event.albumId);
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
        .set({ albumId: null } as QueryDeepPartialEntity<Track>)
        .where('albumId = :albumId', { albumId })
        .execute();
  }

  private async validateArtistExists(artistId: string): Promise<void> {
    const artist = await this.artistRepository.findOneBy({ id: artistId });
    if (!artist) {
      throw new BadRequestException('Artist not found');
    }
  }

  private async validateAlbumExists(albumId: string): Promise<void> {
    const album = await this.albumRepository.findOneBy({ id: albumId });
    if (!album) {
      throw new BadRequestException('Album not found');
    }
  }
}