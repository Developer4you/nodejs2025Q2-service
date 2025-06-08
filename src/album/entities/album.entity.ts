import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Artist } from '../../artist/entities/artist.entity';

@Entity()
export class Album {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'int' })
  year: number;

  @ManyToOne(() => Artist, { nullable: true, onDelete: 'SET NULL' })
  artist: Artist | null;
}