import { Injectable, NotFoundException } from '@nestjs/common';
import { ArtistRepository } from './repositories/artist.repository';
import { Artist } from './entities/artist.entity';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Injectable()
export class ArtistService {
    constructor(private readonly repository: ArtistRepository) {}

    findAll(): Artist[] {
        return this.repository.findAll();
    }

    findById(id: string): Artist {
        const artist = this.repository.findById(id);
        if (!artist) throw new NotFoundException('Artist not found');
        return artist;
    }

    create(dto: CreateArtistDto): Artist {
        return this.repository.create(dto);
    }

    update(id: string, dto: UpdateArtistDto): Artist {
        const artist = this.repository.update(id, dto);
        if (!artist) throw new NotFoundException('Artist not found');
        return artist;
    }

    delete(id: string): void {
        const success = this.repository.delete(id);
        if (!success) throw new NotFoundException('Artist not found');
    }
}