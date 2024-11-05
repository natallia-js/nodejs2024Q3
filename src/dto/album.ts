import { z } from 'zod';
import { Album as AlbumModel } from '@prisma/client';

export class Album {
  id: string; // uuid v4
  name: string;
  year: number;
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

export type CreateAlbumDto = z.infer<typeof createAlbumSchema>;

export const updateAlbumSchema = z
  .object({
    name: z.string().min(1, 'Minimal album name length is 1 symbol').optional(),
    year: z.number().optional(),
    artistId: z.string().nullable().optional(),
  });

export type UpdateAlbumDto = z.infer<typeof updateAlbumSchema>;
