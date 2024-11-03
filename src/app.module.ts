import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './user/user.controller';
import { UsersService } from './user/user.service';
import { ArtistsController } from './artist/artist.controller';
import { ArtistsService } from './artist/artist.service';
import { PrismaService } from './additional-services/prisma.service';

@Module({
  imports: [],
  controllers: [
    AppController,
    UsersController,
    ArtistsController,
  ],
  providers: [
    AppService,
    PrismaService,
    UsersService,
    ArtistsService,
  ],
})
export class AppModule {}
