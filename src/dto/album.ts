import { z } from 'zod';
import { Album as AlbumModel } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class Album {
  @ApiProperty({
    description: 'Album identifier',
    nullable: false,
    format: 'uuid',
    required: true,
  })
  id: string; // uuid v4

  @ApiProperty({
    description: 'Album name',
    nullable: false,
    example: 'Innuendo',
    required: true,
  })
  name: string;

  @ApiProperty({
    description: 'Album year',
    nullable: false,
    example: 1991,
    required: true,
  })
  year: number;

  @ApiProperty({
    description: 'Id of the artist the album belongs to',
    nullable: true,
    default: null,
    format: 'uuid',
    required: false,
  })
  artistId: string | null = null; // refers to Artist

  constructor(album: AlbumModel) {
    if (album.id) this.id = album.id;
    if (album.name) this.name = album.name;
    if (album.year) this.year = album.year;
    if (album.artistId) this.artistId = album.artistId;
  }
}

export const albumIdSchema = z.string().uuid('Album id is not valid');

export const createAlbumSchema = z
  .object({
    name: z.string().min(1, 'Minimal album name length is 1 symbol'),
    year: z.number(),
    artistId: z.string().nullable(),
  })
  .required();

//export type CreateAlbumDto = z.infer<typeof createAlbumSchema>;

export class CreateAlbumDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  year: number;

  @ApiProperty()
  artistId: string | null;
}

export const updateAlbumSchema = z.object({
  name: z.string().min(1, 'Minimal album name length is 1 symbol').optional(),
  year: z.number().optional(),
  artistId: z.string().nullable().optional(),
});

//export type UpdateAlbumDto = z.infer<typeof updateAlbumSchema>;

export class UpdateAlbumDto {
  @ApiProperty()
  name?: string;

  @ApiProperty()
  year?: number;

  @ApiProperty()
  artistId?: string | null;
}
