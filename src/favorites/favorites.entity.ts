import {Entity, PrimaryGeneratedColumn, Column} from 'typeorm';
// import { Artist } from '../artist/artist.entity';
// import { Album } from '../album/album.entity';
// import { Track } from '../track/track.entity';

@Entity({ name: 'favorites' })
export class Favorites {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid', { array: true, default: () => 'ARRAY[]::uuid[]' })
    artists: string[];

    @Column('uuid', { array: true, default: () => 'ARRAY[]::uuid[]' })
    albums: string[];

    @Column('uuid', { array: true, default: () => 'ARRAY[]::uuid[]' })
    tracks: string[];
}