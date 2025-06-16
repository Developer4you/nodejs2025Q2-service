import {
  Injectable, NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Artist } from '../artist/artist.entity';
import { Album } from '../album/album.entity';
import { Track } from '../track/track.entity';
import { Favorites } from './favorites.entity';

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

  private async getOrCreateFavorites() {
    let [favorites] = await this.favoritesRepository.find();
    if (favorites) return favorites;
    const newFavorites = this.favoritesRepository.create({
        artists: [],
        albums: [],
        tracks: [],
      });
    return  this.favoritesRepository.save(newFavorites);
  }

  async getFavorites() {
    const {
      artists: artistsIds,
      albums: albumsIds,
      tracks: tracksIds,
    } = await this.getOrCreateFavorites();

    const [artists, albums, tracks]: [Artist[], Album[], Track[]] = await Promise.all([
      this.artistRepository.find({
        where: { id: In(artistsIds) },
      }),
      this.albumRepository.find({
        where: { id: In(albumsIds) },
        relations: ['artist'],
      }),
      this.trackRepository.find({
        where: { id: In(tracksIds) },
        relations: ['artist', 'album'],
      }),
    ]);
    return { artists, albums, tracks };
  }

  async getAll(): Promise<{
    artists: any[];
    albums: any[];
    tracks: any[];
  }> {
    const favorites = await this.getFavorites();
    return {
      artists: favorites.artists.map(artist => ({
        id: artist.id,
        name: artist.name,
        grammy: artist.grammy,
      })),
      albums: favorites.albums.map(album => ({
        id: album.id,
        name: album.name,
        year: album.year,
        artistId: album.artist?.id || null,
      })),
      tracks: favorites.tracks.map(track => ({
        id: track.id,
        name: track.name,
        duration: track.duration,
        artistId: track.artist?.id || null,
        albumId: track.album?.id || null,
      })),
    };
  }

  async addArtist(id: string): Promise<void> {
    const artist = await this.artistRepository.findOneBy({ id });
    if (!artist) throw new UnprocessableEntityException('Artist not found');

    const favorites = await this.getOrCreateFavorites();

    if (!favorites.artists.includes(id)) {
      favorites.artists = [...favorites.artists, id];
      await this.favoritesRepository.save(favorites);
    }
  }

  async addAlbum(id: string): Promise<void> {
    const album = await this.albumRepository.findOneBy({ id });
    if (!album) {
      throw new UnprocessableEntityException('Album not found');
    }

    const favorites = await this.getOrCreateFavorites();
    if (!favorites.albums.includes(id)) {
      favorites.albums = [...favorites.albums, id];
      await this.favoritesRepository.save(favorites);
    }
  }

  async addTrack(id: string): Promise<void> {
    const track = await this.trackRepository.findOneBy({ id });
    if (!track) {
      throw new UnprocessableEntityException(`Track with ID ${id} not found`);
    }

    const favorites = await this.getOrCreateFavorites();
    if (!favorites.tracks.includes(id)) {
      favorites.tracks = [...favorites.tracks, id];
      await this.favoritesRepository.save(favorites);
    }
  }

  async removeArtist(id: string): Promise<void> {
    const favorites = await this.getOrCreateFavorites();
    const initialLength = favorites.artists.length;

    favorites.artists = favorites.artists.filter(artistId => artistId !== id);

    if (favorites.artists.length === initialLength) {
      throw new NotFoundException('Artist not found in favorites');
    }

    await this.favoritesRepository.save(favorites);
  }

  async removeAlbum(id: string): Promise<void> {
    const favorites = await this.getOrCreateFavorites();
    const initialLength = favorites.albums.length;

    favorites.albums = favorites.albums.filter(albums => albums !== id);

    if (favorites.albums.length === initialLength) {
      throw new NotFoundException('Album not found in favorites');
    }

    await this.favoritesRepository.save(favorites);
  }

  async removeTrack(id: string): Promise<void> {
    const favorites = await this.getOrCreateFavorites();
    const initialLength = favorites.tracks.length;
    console.log('favorites.artists.length', favorites.tracks.length)
    favorites.tracks = favorites.tracks.filter(tracks => tracks !== id);

    if (favorites.tracks.length === initialLength) {
      throw new NotFoundException('Track not found in favorites');
    }

    await this.favoritesRepository.save(favorites);
  }
}