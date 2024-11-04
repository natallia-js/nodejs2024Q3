import { Album, Artist, Track } from '@prisma/client';

export class Favorites {
  artists: Artist[] = [];
  albums: Album[] = [];
  tracks: Track[] = [];
}
