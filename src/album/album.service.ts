import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Album } from './album.entity';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ArtistDeletedEvent } from '../events/artist-deleted.event';
import { AlbumDeletedEvent } from '../events/album-deleted.event';
import { OnEvent } from '@nestjs/event-emitter';
import {Artist} from "../artist/artist.entity";

@Injectable()
export class AlbumService {
  constructor(
      @InjectRepository(Album)
      private readonly albumRepository: Repository<Album>,
      @InjectRepository(Artist)
      private readonly artistRepository: Repository<Artist>,
      private readonly eventEmitter: EventEmitter2,
  ) {}

  async findAll(): Promise<Album[]> {
    return await this.albumRepository.find();
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
    console.log('dto.artistId', dto.artistId);

    if (dto.artistId) {
      await this.validateArtistExists(dto.artistId);
    }

    const album = await this.albumRepository.findOneBy({ id });
    if (!album) throw new NotFoundException('Album not found');

    album.name = dto.name;
    album.year = dto.year;

    if (dto.artistId !== undefined) {
      album.artistId = dto.artistId;
    }

    console.log('Saving album:', album);
    return this.albumRepository.save(album);
  }

  async delete(id: string): Promise<void> {
    const album = await this.albumRepository.findOneBy({ id });
    if (!album) throw new NotFoundException('Album not found');

    this.eventEmitter.emit('album.deleted', new AlbumDeletedEvent(id));

    await this.albumRepository.delete(id);
  }

  @OnEvent('artist.deleted')
  async handleArtistDeleted(event: ArtistDeletedEvent) {
    await this.removeArtistReference(event.artistId);
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
    const artist = await this.artistRepository.findOneBy({ id: artistId });
    if (!artist) {
      throw new BadRequestException('Artist not found');
    }
  }
}