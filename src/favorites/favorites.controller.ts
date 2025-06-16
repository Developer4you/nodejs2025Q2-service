import {
  Controller,
  Get,
  Post,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe, UnprocessableEntityException, NotFoundException,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly service: FavoritesService) {}

  @Get()
  getAll() {
    return this.service.getAll();
  }

  @Post('artist/:id')
  @HttpCode(HttpStatus.CREATED)
  async addArtist(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      await this.service.addArtist(id);
      return { message: 'Artist added to favorites' };
    } catch (error) {
      if (error instanceof UnprocessableEntityException) {
        throw new UnprocessableEntityException({
          message: `Artist with ID ${id} not found`,
          status: HttpStatus.UNPROCESSABLE_ENTITY,
        });
      }
      throw error;
    }
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeArtist(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      await this.service.removeArtist(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Post('album/:id')
  @HttpCode(HttpStatus.CREATED)
  async addAlbum(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      await this.service.addAlbum(id);
      return { message: 'Album added to favorites' };
    } catch (error) {
      if (error instanceof UnprocessableEntityException) {
        throw new UnprocessableEntityException({
          message: `Album with ID ${id} not found`,
          status: HttpStatus.UNPROCESSABLE_ENTITY,
        });
      }
      throw error;
    }
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAlbum(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.service.removeAlbum(id);
  }

  @Post('track/:id')
  @HttpCode(HttpStatus.CREATED)
  async addTrack(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      await this.service.addTrack(id);
      return {message: 'Track added to favorites'};
    } catch (error) {
      if (error instanceof UnprocessableEntityException) {
        throw new UnprocessableEntityException({
          message: `Track with ID ${id} not found`,
          status: HttpStatus.UNPROCESSABLE_ENTITY,
        });
    }
      throw error;
    }
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeTrack(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.service.removeTrack(id);
  }
}