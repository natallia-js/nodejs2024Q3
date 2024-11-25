import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './routes/auth/auth.module';
import { ArtistsModule } from './routes/artist/artist.module';
import { AlbumsModule } from './routes/album/album.module';
import { TracksModule } from './routes/track/track.module';
import { FavoritesModule } from './routes/favorite/favorite.module';
import { UsersModule } from './routes/user/user.module';
import { LoggerModule } from './logging/logger.module';
import configuration from './config/configuration';
import { AppLoggerMiddleware } from './middleware/app-logger.middleware';

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
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
