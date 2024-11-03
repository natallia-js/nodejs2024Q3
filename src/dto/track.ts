import { z } from 'zod';
import { Track as TrackModel } from '@prisma/client';
export interface Track {
  id: string; // uuid v4
  name: string;
  artistId: string | null; // refers to Artist
  albumId: string | null; // refers to Album
  duration: number; // integer number
}