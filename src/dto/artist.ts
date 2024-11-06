import { z } from 'zod';
import { Artist as ArtistModel } from '@prisma/client';

export class Artist {
  id: string; // uuid v4
  name: string;
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

export type CreateArtistDto = z.infer<typeof createArtistSchema>;

export const updateArtistSchema = z.object({
  name: z.string().min(1, 'Minimal artist name length is 1 symbol').optional(),
  grammy: z.boolean().optional(),
});

export type UpdateArtistDto = z.infer<typeof updateArtistSchema>;
