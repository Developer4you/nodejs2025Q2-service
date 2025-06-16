import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Token } from '../../auth/entities/token.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'users' })
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

    @Column({
        type: 'bigint',
        transformer: {
            to: (value: number) => value,
            from: (value: string | number) => Number(value),
        },
    })
    createdAt: number;

    @Column({
        type: 'bigint',
        transformer: {
            to: (value: number) => value,
            from: (value: string | number) => Number(value),
        },
    })
    updatedAt: number;

    @OneToMany(() => Token, (token) => token.user)
    refreshTokens: Token[];
}