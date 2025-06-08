import {
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from '../artist/entities/artist.entity';
import { Album } from '../album/entities/album.entity';
import { Track } from '../track/entities/track.entity';
import { Favorites } from './entities/favorites.entity';

@Injectable()
export class FavoritesService {
  constructor(
      @InjectRepository(Favorites)
      private readonly favoritesRepository: Repository<Favorites>,
      @InjectRepository(Artist)
      private readonly artistRepository: Repository<Artist>,
      @InjectRepository(Album)
      private readonly albumRepository: Repository<Album>,
      @InjectRepository(Track)
      private readonly trackRepository: Repository<Track>,
  ) {}

  private async getOrCreateFavorites(): Promise<Favorites> {
    let favorites = await this.favoritesRepository.findOne({
      relations: ['artists', 'albums', 'tracks'],
    });

    if (!favorites) {
      favorites = this.favoritesRepository.create({
        artists: [],
        albums: [],
        tracks: [],
      });
      await this.favoritesRepository.save(favorites);
    }

    return favorites;
  }

  async getAll(): Promise<{
    artists: Artist[];
    albums: Album[];
    tracks: Track[];
  }> {
    const favorites = await this.getOrCreateFavorites();
    return {
      artists: favorites.artists,
      albums: favorites.albums,
      tracks: favorites.tracks,
    };
  }

  async addArtist(id: string): Promise<void> {
    const artist = await this.artistRepository.findOneBy({ id });
    if (!artist) {
      throw new UnprocessableEntityException('Artist not found');
    }

    const favorites = await this.getOrCreateFavorites();
    if (!favorites.artists.some(a => a.id === id)) {
      favorites.artists.push(artist);
      await this.favoritesRepository.save(favorites);
    }
  }

  async removeArtist(id: string): Promise<void> {
    const favorites = await this.getOrCreateFavorites();
    favorites.artists = favorites.artists.filter(a => a.id !== id);
    await this.favoritesRepository.save(favorites);
  }

  async addAlbum(id: string): Promise<void> {
    const album = await this.albumRepository.findOneBy({ id });
    if (!album) {
      throw new UnprocessableEntityException('Album not found');
    }

    const favorites = await this.getOrCreateFavorites();
    if (!favorites.albums.some(a => a.id === id)) {
      favorites.albums.push(album);
      await this.favoritesRepository.save(favorites);
    }
  }

  async removeAlbum(id: string): Promise<void> {
    const favorites = await this.getOrCreateFavorites();
    favorites.albums = favorites.albums.filter(a => a.id !== id);
    await this.favoritesRepository.save(favorites);
  }

  async addTrack(id: string): Promise<void> {
    const track = await this.trackRepository.findOneBy({ id });
    if (!track) {
      throw new UnprocessableEntityException('Track not found');
    }

    const favorites = await this.getOrCreateFavorites();
    if (!favorites.tracks.some(t => t.id === id)) {
      favorites.tracks.push(track);
      await this.favoritesRepository.save(favorites);
    }
  }

  async removeTrack(id: string): Promise<void> {
    const favorites = await this.getOrCreateFavorites();
    favorites.tracks = favorites.tracks.filter(t => t.id !== id);
    await this.favoritesRepository.save(favorites);
  }
}