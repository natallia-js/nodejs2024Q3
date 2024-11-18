import { Module, forwardRef } from '@nestjs/common';
import { FavoritesController } from './favorite.controller';
import { FavoritesService } from './favorite.service';
import { PrismaModule } from '../../additional-services/prisma.module';
import { ArtistsModule } from '../artist/artist.module';
import { AlbumsModule } from '../album/album.module';
import { TracksModule } from '../track/track.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => ArtistsModule),
    forwardRef(() => AlbumsModule),
    forwardRef(() => TracksModule),
  ],
  controllers: [FavoritesController],
  providers: [FavoritesService],
  exports: [FavoritesService],
})
export class FavoritesModule {}
