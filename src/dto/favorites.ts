import { Album, Artist, Track } from '@prisma/client';
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { Artist as ArtistSchema } from './artist';
import { Album as AlbumSchema } from './album';
import { Track as TrackSchema } from './track';

export class Favorites {
  @ApiProperty({
    description: 'An array of Artist objects',
    nullable: false,
    type: 'array',
    items: { $ref: getSchemaPath(ArtistSchema) },
    default: [],
  })
  artists: Artist[] = [];

  @ApiProperty({
    description: 'An array of Album objects',
    nullable: false,
    type: 'array',
    items: { $ref: getSchemaPath(AlbumSchema) },
    default: [],
  })
  albums: Album[] = [];

  @ApiProperty({
    description: 'An array of Track objects',
    nullable: false,
    type: 'array',
    items: { $ref: getSchemaPath(TrackSchema) },
    default: [],
  })
  tracks: Track[] = [];
}
