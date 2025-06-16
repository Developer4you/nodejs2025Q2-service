import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './entities/token.entity';

@Module({
    imports: [
        UserModule,
        TypeOrmModule.forFeature([Token]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => {
                const secret = config.get<string>('JWT_SECRET_KEY');
                const refreshSecret = config.get<string>('JWT_SECRET_REFRESH_KEY');

                if (!secret || !refreshSecret) {
                    throw new Error('JWT secrets are not configured');
                }

                return {
                    secret,
                    signOptions: { expiresIn: config.get('TOKEN_EXPIRE_TIME') },
                };
            },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService, JwtModule],
})
export class AuthModule {}