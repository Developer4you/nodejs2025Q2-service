import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { TokensDto } from './dto/tokens.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ValidationPipe())
    login(@Body() dto: LoginDto): Promise<TokensDto> {
        return this.authService.login(dto);
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @UsePipes(new ValidationPipe())
    refresh(@Body() dto: RefreshTokenDto): Promise<TokensDto> {
        return this.authService.refresh(dto.refreshToken);
    }

    @Post('logout')
    @HttpCode(HttpStatus.NO_CONTENT)
    @UsePipes(new ValidationPipe())
    logout(@Body() dto: RefreshTokenDto): Promise<void> {
        return this.authService.logout(dto.refreshToken);
    }
}