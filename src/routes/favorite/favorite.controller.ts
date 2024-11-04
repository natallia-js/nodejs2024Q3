import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    Put,
    UseFilters,
    UseInterceptors,
    UsePipes,
} from '@nestjs/common';
import { FavoritesService } from './favorite.service';
import { TracksService } from '../track/track.service';
import { ArtistsService } from '../artist/artist.service';
import { AlbumsService } from '../album/album.service';
//import { CreateTrackDto, createTrackSchema, UpdateTrackDto, updateTrackSchema, Track, trackIdSchema } from '../../dto/track';
import { HttpExceptionFilter } from '../../exceptions/http-exception.filter';
import { InstanceNotFoundException } from '../../exceptions/instance-not-found.exception';
import ZodValidationPipe from 'src/pipes/zod-validation.pipe';
import { Favorites } from '../../dto/favorites';

@Controller('favs')
export class FavoritesController {
  constructor(
      private readonly favoritesService: FavoritesService,
      private readonly tracksService: TracksService,
      private readonly albumsService: AlbumsService,
      private readonly artistsService: ArtistsService
  ) {}
  
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  @HttpCode(200)
  @UseFilters(HttpExceptionFilter)
  async getAllFavorites(): Promise<Favorites> {
    return this.favoritesService.getAllFavorites();
  }
  
  /*@UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  @HttpCode(200)
  @UseFilters(HttpExceptionFilter)
  async getTrack(@Param('id', new ZodValidationPipe(trackIdSchema)) id: string): Promise<Track> {
    const track: Track | null = await this.tracksService.getTrack(id);
    if (!track)
      throw new InstanceNotFoundException('track');
    return track;
  }
  
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createTrackSchema))
  @UseFilters(HttpExceptionFilter)
  async addTrack(@Body() createTrackDto: CreateTrackDto): Promise<Track> {
    if (createTrackDto?.artistId)
      if (!await this.artistsService.getArtist(createTrackDto.artistId))
        throw new InstanceNotFoundException(`artist with id ${createTrackDto.artistId}`);
    if (createTrackDto?.albumId)
      if (!await this.albumsService.getAlbum(createTrackDto.albumId))
        throw new InstanceNotFoundException(`album with id ${createTrackDto.albumId}`);
    return this.tracksService.addTrack(createTrackDto);
  }
  
  @UseInterceptors(ClassSerializerInterceptor)
  @Put(':id')
  @HttpCode(200)
  @UseFilters(HttpExceptionFilter)
  async updateTrackData(
    @Param('id', new ZodValidationPipe(trackIdSchema)) id: string,
    @Body(new ZodValidationPipe(updateTrackSchema)) updateTrackDto: UpdateTrackDto): Promise<Track>
  {
    const existingTrackRecord: Track | null = await this.tracksService.getTrack(id);
    if (!existingTrackRecord)
      throw new InstanceNotFoundException('track');
    if (updateTrackDto?.artistId)
      if (!await this.artistsService.getArtist(updateTrackDto.artistId))
        throw new InstanceNotFoundException(`artist with id ${updateTrackDto.artistId}`);
    if (updateTrackDto?.albumId)
      if (!await this.albumsService.getAlbum(updateTrackDto.albumId))
        throw new InstanceNotFoundException(`album with id ${updateTrackDto.albumId}`);
    const track: Track | null = await this.tracksService.updateTrackData(id, updateTrackDto);
    if (!track)
      throw new InstanceNotFoundException('track');
    return track;
  }
  
  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  @HttpCode(204)
  @UseFilters(HttpExceptionFilter)
  async deleteTrack(@Param('id', new ZodValidationPipe(trackIdSchema)) id: string): Promise<Track> {
    const track: Track | null = await this.tracksService.deleteTrack(id);
    if (!track)
      throw new InstanceNotFoundException('track');
    return track;
  }*/
}
