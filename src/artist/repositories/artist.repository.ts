import { v4 as uuidv4 } from 'uuid';
import { Artist } from '../entities/artist.entity';
import { CreateArtistDto } from '../dto/create-artist.dto';
import { UpdateArtistDto } from '../dto/update-artist.dto';

export class ArtistRepository {
  private artists: Artist[] = [];

  findAll(): Artist[] {
    return [...this.artists];
  }

  findById(id: string): Artist | undefined {
    this.artists.forEach((e) => console.log('artists', e.id));
    return this.artists.find((a) => a.id === id);
  }

  create(dto: CreateArtistDto): Artist {
    const artist: Artist = {
      id: uuidv4(),
      ...dto,
    };
    this.artists.push(artist);
    return artist;
  }

  update(id: string, dto: UpdateArtistDto): Artist | undefined {
    const index = this.artists.findIndex((a) => a.id === id);
    if (index === -1) return undefined;

    this.artists[index] = {
      ...this.artists[index],
      ...dto,
    };

    return this.artists[index];
  }

  delete(id: string): boolean {
    const initialLength = this.artists.length;
    this.artists = this.artists.filter((a) => a.id !== id);
    return this.artists.length < initialLength;
  }
}
