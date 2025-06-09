import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Artist } from '../../artist/entities/artist.entity';
import { Album } from '../../album/entities/album.entity';

@Entity()
export class Track {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'int' })
  duration: number;

  @ManyToOne(() => Artist, { nullable: true, onDelete: 'SET NULL' })
  artist: Artist | null;

  @ManyToOne(() => Album, { nullable: true, onDelete: 'SET NULL' })
  album: Album | null;
}