import { Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Artist } from '../../artist/entities/artist.entity';
import { Album } from '../../album/entities/album.entity';
import { Track } from '../../track/entities/track.entity';

@Entity()
export class Favorites {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToMany(() => Artist)
    @JoinTable()
    artists: Artist[];

    @ManyToMany(() => Album)
    @JoinTable()
    albums: Album[];

    @ManyToMany(() => Track)
    @JoinTable()
    tracks: Track[];
}