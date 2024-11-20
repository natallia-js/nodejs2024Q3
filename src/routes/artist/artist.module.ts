import { Module, forwardRef } from '@nestjs/common';
import { ArtistsController } from './artist.controller';
import { ArtistsService } from './artist.service';
import { PrismaModule } from '../../additional-services/prisma.module';
import { FavoritesModule } from '../favorite/favorite.module';

@Module({
  imports: [PrismaModule, forwardRef(() => FavoritesModule)],
  controllers: [ArtistsController],
  providers: [ArtistsService],
  exports: [ArtistsService],
})
export class ArtistsModule {}
