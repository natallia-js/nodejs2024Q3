import { Module, forwardRef } from '@nestjs/common';
import { TracksController } from './track.controller';
import { TracksService } from './track.service';
import { PrismaModule } from '../../additional-services/prisma.module';
import { AlbumsModule } from '../album/album.module';
import { ArtistsModule } from '../artist/artist.module';
import { FavoritesModule } from '../favorite/favorite.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => AlbumsModule),
    forwardRef(() => ArtistsModule),
    forwardRef(() => FavoritesModule),
  ],
  controllers: [TracksController],
  providers: [TracksService],
  exports: [TracksService],
})
export class TracksModule {}
