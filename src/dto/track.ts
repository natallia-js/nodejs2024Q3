import { z } from 'zod';
import { Track as TrackModel } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class Track {
  @ApiProperty({
    description: 'Track identifier',
    nullable: false,
    format: 'uuid',
    required: true,
  })
  id: string; // uuid v4

  @ApiProperty({
    description: 'Track name',
    nullable: false,
    example: 'The Show Must Go On',
    required: true,
  })
  name: string;

  @ApiProperty({
    description: 'Id of the artist the track belongs to',
    nullable: true,
    default: null,
    format: 'uuid',
    required: false,
  })
  artistId: string | null = null; // refers to Artist

  @ApiProperty({
    description: 'Id of the album the track belongs to',
    nullable: true,
    default: null,
    format: 'uuid',
    required: false,
  })
  albumId: string | null = null; // refers to Album

  @ApiProperty({
    description: 'Duration of the track in seconds',
    nullable: false,
    example: 262,
    required: true,
  })
  duration: number; // integer number

  constructor(track: TrackModel) {
    if (track.id) this.id = track.id;
    if (track.name) this.name = track.name;
    if (track.artistId) this.artistId = track.artistId;
    if (track.albumId) this.albumId = track.albumId;
    if (track.duration) this.duration = track.duration;
  }
}

export const trackIdSchema = z.string().uuid('Track id is not valid');

export const createTrackSchema = z
  .object({
    name: z.string().min(1, 'Minimal track name length is 1 symbol'),
    artistId: z.string().nullable(),
    albumId: z.string().nullable(),
    duration: z.number(),
  })
  .required();

//export type CreateTrackDto = z.infer<typeof createTrackSchema>;

export class CreateTrackDto {
  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: false })
  artistId: string | null;

  @ApiProperty({ required: false })
  albumId: string | null;

  @ApiProperty({ required: true })
  duration: number;
}

export const updateTrackSchema = z.object({
  name: z.string().min(1, 'Minimal track name length is 1 symbol').optional(),
  artistId: z.string().nullable().optional(),
  albumId: z.string().nullable().optional(),
  duration: z.number().optional(),
});

//export type UpdateTrackDto = z.infer<typeof updateTrackSchema>;

export class UpdateTrackDto {
  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ format: 'uuid', required: false })
  artistId?: string | null;

  @ApiProperty({ format: 'uuid', required: false })
  albumId?: string | null;

  @ApiProperty({ required: false })
  duration?: number;
}
