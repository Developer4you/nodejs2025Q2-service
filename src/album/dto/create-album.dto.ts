import { IsString, IsNotEmpty, IsInt, IsOptional } from 'class-validator';

export class CreateAlbumDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsInt()
    year: number;

    @IsOptional()
    @IsString()
    artistId?: string | null;
}