import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from 'typeorm';
import {Album} from "../album/album.entity";
import {Track} from "../track/track.entity";

@Entity({ name: 'artists' })
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  grammy: boolean;

  @OneToMany(() => Track, (track) => track.artist)
  tracks: Track[];

  @OneToMany(() => Album, (album) => album.artist)
  albums: Album[];
}