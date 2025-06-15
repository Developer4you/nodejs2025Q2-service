import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from './artist.entity';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ArtistDeletedEvent } from '../events/artist-deleted.event';

@Injectable()
export class ArtistService {
  constructor(
      @InjectRepository(Artist)
      private readonly artistRepository: Repository<Artist>,
      private readonly eventEmitter: EventEmitter2,
  ) {}

  async findAll(): Promise<Artist[]> {
    return this.artistRepository.find();
  }

  async findById(id: string): Promise<Artist> {
    const artist = await this.artistRepository.findOneBy({ id });
    if (!artist) throw new NotFoundException('Artist not found');
    return artist;
  }

  async create(dto: CreateArtistDto): Promise<Artist> {
    const artist = this.artistRepository.create(dto);
    return this.artistRepository.save(artist);
  }

  async update(id: string, dto: UpdateArtistDto): Promise<Artist> {
    const artist = await this.artistRepository.preload({
      id,
      ...dto
    });

    if (!artist) throw new NotFoundException('Artist not found');
    return this.artistRepository.save(artist);
  }

  async delete(id: string): Promise<void> {
    const artist = await this.artistRepository.findOneBy({ id });
    if (!artist) throw new NotFoundException('Artist not found');

    // Генерируем событие перед удалением
    this.eventEmitter.emit('artist.deleted', new ArtistDeletedEvent(id));

    await this.artistRepository.delete(id);
  }
}