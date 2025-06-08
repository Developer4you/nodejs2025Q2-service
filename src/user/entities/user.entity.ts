import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  login: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: 1 })
  version: number;

  @Column({ type: 'bigint', default: () => 'EXTRACT(EPOCH FROM NOW()) * 1000' })
  createdAt: number;

  @Column({ type: 'bigint', default: () => 'EXTRACT(EPOCH FROM NOW()) * 1000' })
  updatedAt: number;
}