import { Module } from '@nestjs/common';
import { TracksController } from './track.controller';
import { TracksService } from './track.service';

@Module({
  controllers: [TracksController],
  providers: [TracksService],
})
export class TracksModule {}
