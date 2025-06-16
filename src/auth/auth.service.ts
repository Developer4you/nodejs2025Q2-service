import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { TokensDto } from './dto/tokens.dto';
import { Token } from './entities/token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        @InjectRepository(Token)
        private readonly tokenRepository: Repository<Token>,
        private readonly configService: ConfigService,
    ) {}

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
                secret: this.configService.get('JWT_REFRESH_SECRET'),
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
        const accessToken = this.jwtService.sign(
            { userId, login },
            {
                expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN'),
                secret: this.configService.get('JWT_ACCESS_SECRET'),
            },
        );

        const refreshToken = this.jwtService.sign(
            { userId, login },
            {
                expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            },
        );

        const expiresAt = Date.now() +
            parseInt(this.configService.get('JWT_REFRESH_EXPIRES_IN')) * 1000;

        // Use userService instead of userRepository
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