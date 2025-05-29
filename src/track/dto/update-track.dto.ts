import { IsString, IsNotEmpty, IsInt, IsOptional } from 'class-validator';

export class UpdateTrackDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    @IsString()
    artistId?: string | null;

    @IsOptional()
    @IsString()
    albumId?: string | null;

    @IsInt()
    @IsNotEmpty()
    duration: number;
}