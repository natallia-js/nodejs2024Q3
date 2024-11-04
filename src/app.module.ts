import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './routes/user/user.controller';
import { UsersService } from './routes/user/user.service';
import { ArtistsController } from './routes/artist/artist.controller';
import { ArtistsService } from './routes/artist/artist.service';
import { AlbumsController } from './routes/album/album.controller';
import { AlbumsService } from './routes/album/album.service';
import { TracksController } from './routes/track/track.controller';
import { TracksService } from './routes/track/track.service';
import { PrismaService } from './additional-services/prisma.service';

@Module({
  imports: [],
  controllers: [
    AppController,

    UsersController,
    ArtistsController,
    AlbumsController,
    TracksController,
  ],
  providers: [
    AppService,
    PrismaService,

    UsersService,
    ArtistsService,
    AlbumsService,
    TracksService,
  ],
})
export class AppModule {}
