import { z } from 'zod';
import { Album as AlbumModel } from '@prisma/client';
export class Album {
  id: string; // uuid v4
  name: string;
  year: number;
  artistId: string | null; // refers to Artist
}