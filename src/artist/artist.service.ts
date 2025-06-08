import {
  forwardRef, Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from './entities/artist.entity';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';
import { FavoritesService } from '../favorites/favorites.service';

@Injectable()
export class ArtistService {
  constructor(
      @InjectRepository(Artist)
      private readonly artistRepository: Repository<Artist>,
      @Inject(forwardRef(() => AlbumService))
      private readonly albumService: AlbumService,
      @Inject(forwardRef(() => TrackService))
      private readonly trackService: TrackService,
      private readonly favoritesService: FavoritesService,
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

    await this.favoritesService.removeArtist(id);
    await this.albumService.removeArtistReference(id);
    await this.trackService.removeArtistReference(id);

    await this.artistRepository.delete(id);
  }
}