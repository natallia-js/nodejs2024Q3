import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './routes/auth/auth.module';
import { ArtistsModule } from './routes/artist/artist.module';
import { AlbumsModule } from './routes/album/album.module';
import { TracksModule } from './routes/track/track.module';
import { FavoritesModule } from './routes/favorite/favorite.module';
import { UsersModule } from './routes/user/user.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    UsersModule,
    ArtistsModule,
    AuthModule,
    AlbumsModule,
    TracksModule,
    FavoritesModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService,
  ],
})
export class AppModule {}
