import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
    HttpCode,
    HttpStatus,
    ParseUUIDPipe
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Controller('artist')
export class ArtistController {
    constructor(private readonly service: ArtistService) {}

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Get(':id')
    findOne(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.service.findById(id);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED) // 201 Created
    create(@Body() dto: CreateArtistDto) {
        return this.service.create(dto);
    }

    @Put(':id')
    update(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() dto: UpdateArtistDto
    ) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT) // 204 No Content
    remove(@Param('id', new ParseUUIDPipe()) id: string) {
        console.log('id', id)
        this.service.delete(id);
    }
}