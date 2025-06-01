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
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Controller('album')
export class AlbumController {
    constructor(private readonly service: AlbumService) {}

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
    create(@Body() dto: CreateAlbumDto) {
        return this.service.create(dto);
    }

    @Put(':id')
    update(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() dto: UpdateAlbumDto
    ) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT) // 204 No Content
    remove(@Param('id', new ParseUUIDPipe()) id: string) {
        this.service.delete(id);
    }
}