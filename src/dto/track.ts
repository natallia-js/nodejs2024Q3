import { z } from 'zod';
import { Track as TrackModel } from '@prisma/client';

export class Track {
  id: string; // uuid v4
  name: string;
  artistId: string | null = null; // refers to Artist
  albumId: string | null = null; // refers to Album
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
    artistId: z.string().optional(),
    albumId: z.string().optional(),
    year: z.number(),
  })
  .required();

export type CreateTrackDto = z.infer<typeof createTrackSchema>;

export const updateTrackSchema = z
  .object({
    name: z.string().min(1, 'Minimal track name length is 1 symbol').optional(),
    artistId: z.string().optional(),
    albumId: z.string().optional(),
    year: z.number().optional(),
  })
  .required();

export type UpdateTrackDto = z.infer<typeof updateTrackSchema>;
