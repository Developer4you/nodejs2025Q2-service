import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../user/user.entity';

@Entity({ name: 'tokens' })
export class Token {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.refreshTokens, { onDelete: 'CASCADE' })
    user: User;

    @Column()
    refreshToken: string;

    @Column({ type: 'bigint' })
    expiresAt: number;
}