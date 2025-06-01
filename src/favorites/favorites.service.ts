import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { FavoritesRepository } from './repositories/favorites.repository';
import { ArtistService } from '../artist/artist.service';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';
import { Artist } from '../artist/entities/artist.entity';
import { Album } from '../album/entities/album.entity';
import { Track } from '../track/entities/track.entity';

@Injectable()
export class FavoritesService {
  constructor(
    private readonly repository: FavoritesRepository,
    @Inject(forwardRef(() => ArtistService))
    private readonly artistService: ArtistService,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
  ) {}

  getAll(): {
    artists: Artist[];
    albums: Album[];
    tracks: Track[];
  } {
    const ids = this.repository.getAllIds();

    const artists = this.getArtistsByIds(ids.artists);
    const albums = this.getAlbumsByIds(ids.albums);
    const tracks = this.getTracksByIds(ids.tracks);

    return {
      artists: artists.filter((a) => a !== null),
      albums: albums.filter((a) => a !== null),
      tracks: tracks.filter((t) => t !== null),
    };
  }

  private getArtistsByIds(ids: string[]): (Artist | null)[] {
    return ids.map((id) => {
      try {
        return this.artistService.findById(id);
      } catch {
        return null;
      }
    });
  }

  private getAlbumsByIds(ids: string[]): (Album | null)[] {
    return ids.map((id) => {
      try {
        return this.albumService.findById(id);
      } catch {
        return null;
      }
    });
  }

  private getTracksByIds(ids: string[]): (Track | null)[] {
    return ids.map((id) => {
      try {
        return this.trackService.findById(id);
      } catch {
        return null;
      }
    });
  }

  addArtist(id: string): void {
    try {
      this.artistService.findById(id);
      this.repository.addArtist(id);
    } catch {
      throw new UnprocessableEntityException('Artist not found');
    }
  }

  removeArtist(id: string): void {
    this.repository.removeArtist(id);
  }

  addAlbum(id: string): void {
    try {
      this.albumService.findById(id);
      this.repository.addAlbum(id);
    } catch {
      throw new UnprocessableEntityException('Album not found');
    }
  }

  removeAlbum(id: string): void {
    this.repository.removeAlbum(id);
  }

  addTrack(id: string): void {
    try {
      this.trackService.findById(id);
      this.repository.addTrack(id);
    } catch {
      throw new UnprocessableEntityException('Track not found');
    }
  }

  removeTrack(id: string): void {
    this.repository.removeTrack(id);
  }
}
