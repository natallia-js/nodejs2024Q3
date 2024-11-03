import { Module } from '@nestjs/common';
import { ArtistsController } from './artist.controller';
import { ArtistsService } from './artist.service';

@Module({
  controllers: [ArtistsController],
  providers: [ArtistsService],
})
export class ArtistsModule {}
