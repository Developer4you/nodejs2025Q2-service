import { v4 as uuidv4 } from 'uuid';
import { Track } from '../entities/track.entity';
import { CreateTrackDto } from '../dto/create-track.dto';
import { UpdateTrackDto } from '../dto/update-track.dto';

export class TrackRepository {
    private tracks: Track[] = [];

    findAll(): Track[] {
        return [...this.tracks];
    }

    findById(id: string): Track | undefined {
        return this.tracks.find(t => t.id === id);
    }

    create(dto: CreateTrackDto): Track {
        const track: Track = {
            id: uuidv4(),
            artistId: dto.artistId || null,
            albumId: dto.albumId || null,
            ...dto,
        };
        this.tracks.push(track);
        return track;
    }

    update(id: string, dto: UpdateTrackDto): Track | undefined {
        const index = this.tracks.findIndex(t => t.id === id);
        if (index === -1) return undefined;

        this.tracks[index] = {
            ...this.tracks[index],
            ...dto,
            artistId: dto.artistId || null,
            albumId: dto.albumId || null,
        };

        return this.tracks[index];
    }

    delete(id: string): boolean {
        const initialLength = this.tracks.length;
        this.tracks = this.tracks.filter(t => t.id !== id);
        return this.tracks.length < initialLength;
    }

    removeArtistReference(artistId: string): void {
        this.tracks = this.tracks.map(track => {
            if (track.artistId === artistId) {
                return { ...track, artistId: null };
            }
            return track;
        });
    }

    removeAlbumReference(albumId: string): void {
        this.tracks = this.tracks.map(track => {
            if (track.albumId === albumId) {
                return { ...track, albumId: null };
            }
            return track;
        });
    }
}