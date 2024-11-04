import { Module } from '@nestjs/common';
import { FavoritesController } from './fevorite.controller';
import { FavoritesService } from './fevorite.service';

@Module({
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
