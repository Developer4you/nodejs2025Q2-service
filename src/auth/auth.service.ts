import {ConflictException, Injectable, UnauthorizedException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { TokensDto } from './dto/tokens.dto';
import { Token } from './entities/token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {Connection, Repository} from 'typeorm';
import { ConfigService } from '@nestjs/config';
import {User} from "../user/user.entity";
import {SignupDto} from "./dto/signup.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        @InjectRepository(Token)
        private readonly tokenRepository: Repository<Token>,
        private readonly configService: ConfigService,
        private readonly connection: Connection,
    ) {}

    async signup(dto: SignupDto): Promise<User> {
        const queryRunner = this.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const existingUser = await queryRunner.manager.findOne(User, {
                where: { login: dto.login }
            });

            if (existingUser) {
                throw new ConflictException('User already exists');
            }

            const user = queryRunner.manager.create(User, {
                login: dto.login,
                password: await bcrypt.hash(dto.password, 10),
                version: 1,
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });

            await queryRunner.manager.save(user);
            await queryRunner.commitTransaction();

            return user;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async login(dto: LoginDto): Promise<TokensDto> {
        const user = await this.userService.findByLogin(dto.login);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return this.generateTokens(user.id, user.login);
    }

    async refresh(refreshToken: string): Promise<TokensDto> {
        const token = await this.tokenRepository.findOne({
            where: { refreshToken },
        });

        if (!token || token.expiresAt < Date.now()) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get('JWT_SECRET_REFRESH_KEY'),
            });

            await this.tokenRepository.delete({ refreshToken });

            return this.generateTokens(payload.userId, payload.login);
        } catch (e) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    async logout(refreshToken: string): Promise<void> {
        await this.tokenRepository.delete({ refreshToken });
    }

    private async generateTokens(userId: string, login: string): Promise<TokensDto> {
        const accessSecret = this.configService.get('JWT_SECRET_KEY');
        const refreshSecret = this.configService.get('JWT_SECRET_REFRESH_KEY');

        if (!accessSecret || !refreshSecret) {
            throw new Error('JWT secrets are not configured');
        }

        const accessToken = this.jwtService.sign(
            { userId, login },
            { expiresIn: this.configService.get('TOKEN_EXPIRE_TIME'), secret: accessSecret }
        );

        const refreshToken = this.jwtService.sign(
            { userId, login },
            { expiresIn: this.configService.get('TOKEN_REFRESH_EXPIRE_TIME'), secret: refreshSecret }
        );

        const expiresAt = Date.now() +
            parseInt(this.configService.get('TOKEN_REFRESH_EXPIRE_TIME')) * 1000;

        const user = await this.userService.findById(userId);

        const token = this.tokenRepository.create({
            user,
            refreshToken,
            expiresAt,
        });

        await this.tokenRepository.save(token);

        return { accessToken, refreshToken };
    }
}