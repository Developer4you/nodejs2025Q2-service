import { v4 as uuidv4 } from 'uuid';
import { Album } from '../entities/album.entity';
import { CreateAlbumDto } from '../dto/create-album.dto';
import { UpdateAlbumDto } from '../dto/update-album.dto';

export class AlbumRepository {
  private albums: Album[] = [];

  findAll(): Album[] {
    return [...this.albums];
  }

  findById(id: string): Album | undefined {
    return this.albums.find((a) => a.id === id);
  }

  create(dto: CreateAlbumDto): Album {
    const album: Album = {
      id: uuidv4(),
      artistId: dto.artistId || null,
      ...dto,
    };
    this.albums.push(album);
    return album;
  }

  update(id: string, dto: UpdateAlbumDto): Album | undefined {
    const index = this.albums.findIndex((a) => a.id === id);
    if (index === -1) return undefined;

    this.albums[index] = {
      ...this.albums[index],
      ...dto,
      artistId: dto.artistId || null,
    };

    return this.albums[index];
  }

  delete(id: string): boolean {
    const initialLength = this.albums.length;
    this.albums = this.albums.filter((a) => a.id !== id);
    return this.albums.length < initialLength;
  }

  removeArtistReference(artistId: string): void {
    this.albums = this.albums.map((album) => {
      if (album.artistId === artistId) {
        return { ...album, artistId: null };
      }
      return album;
    });
  }
}
