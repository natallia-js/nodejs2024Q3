import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './routes/user/user.controller';
import { UsersService } from './routes/user/user.service';
import { ArtistsController } from './routes/artist/artist.controller';
import { ArtistsService } from './routes/artist/artist.service';
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
