import { z } from 'zod';
import { Artist as ArtistModel } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class Artist {
  @ApiProperty({
    description: 'Artist identifier',
    nullable: false,
    format: 'uuid',
    required: true,
  })
  id: string; // uuid v4

  @ApiProperty({
    description: 'Artist name',
    nullable: false,
    example: 'Freddie Mercury',
    required: true,
  })
  name: string;

  @ApiProperty({
    description: 'Has (true) or not (false) the artist grammy',
    nullable: false,
    example: false,
    required: false,
  })
  grammy = false;

  constructor(artist: ArtistModel) {
    if (artist.id) this.id = artist.id;
    if (artist.name) this.name = artist.name;
    if (typeof artist.grammy === 'boolean') this.grammy = artist.grammy;
  }
}

export const artistIdSchema = z.string().uuid('Artist id is not valid');

export const createArtistSchema = z
  .object({
    name: z.string().min(1, 'Minimal artist name length is 1 symbol'),
    grammy: z.boolean(),
  })
  .required();

//export type CreateArtistDto = z.infer<typeof createArtistSchema>;

export class CreateArtistDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  grammy: boolean;
}

export const updateArtistSchema = z.object({
  name: z.string().min(1, 'Minimal artist name length is 1 symbol').optional(),
  grammy: z.boolean().optional(),
});

//export type UpdateArtistDto = z.infer<typeof updateArtistSchema>;

export class UpdateArtistDto {
  @ApiProperty()
  name?: string;

  @ApiProperty()
  grammy?: boolean;
}
