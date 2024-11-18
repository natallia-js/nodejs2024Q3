import { Module, forwardRef } from '@nestjs/common';
import { AlbumsController } from './album.controller';
import { AlbumsService } from './album.service';
import { PrismaModule } from '../../additional-services/prisma.module';
import { FavoritesModule } from '../favorite/favorite.module';
import { ArtistsModule } from '../artist/artist.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => ArtistsModule),
    forwardRef(() => FavoritesModule),
  ],
  controllers: [AlbumsController],
  providers: [AlbumsService],
  exports: [AlbumsService],
})
export class AlbumsModule {}
