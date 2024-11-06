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
  UseInterceptors,
  UsePipes,
  HttpStatus,
} from '@nestjs/common';
import { TracksService } from './track.service';
import { ArtistsService } from '../artist/artist.service';
import { AlbumsService } from '../album/album.service';
import { FavoritesService } from '../favorite/favorite.service';
import {
  CreateTrackDto,
  createTrackSchema,
  UpdateTrackDto,
  updateTrackSchema,
  Track,
  trackIdSchema,
} from '../../dto/track';
import { InstanceNotFoundException } from '../../exceptions/instance-not-found.exception';
import { BadRequestParamsException } from '../../exceptions/bad-request-params.exception';
import ZodValidationPipe from '../../pipes/zod-validation.pipe';
import { Album } from '../../dto/album';
import { Artist } from '../../dto/artist';
import { ApiTags, ApiOperation, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { Error as ErrorType } from '../../dto/error';
import { ApiGetAllDataResponse } from '../../decorators/ApiGetAllDataResponse';

async function checkArtistAlbumPair(
  artistId: string | null | undefined,
  albumId: string | null | undefined,
  albumsService: AlbumsService,
  artistsService: ArtistsService,
): Promise<{ artistId: string | null; albumId: string | null }> {
  if (!artistId && !albumId && artistId === null && albumId === null)
    return { artistId, albumId };
  if (albumId) {
    const album: Album | null = await albumsService.getAlbum(albumId);
    if (!album)
      throw new InstanceNotFoundException(`album with id = ${albumId}`);
    if (artistId) {
      if (album.artistId !== artistId)
        throw new BadRequestParamsException(
          `The author of the album with id = ${albumId} is artist with id = ${album.artistId}`,
        );
    } else return { artistId: album.artistId, albumId };
  } else {
    const artist: Artist | null = await artistsService.getArtist(
      artistId || '',
    );
    if (!artist)
      throw new InstanceNotFoundException(`artist with id = ${artistId}`);
    return { artistId: artistId || null, albumId: null };
  }
  return { artistId, albumId };
}

@ApiTags('track')
@Controller('track')
export class TracksController {
  constructor(
    private readonly tracksService: TracksService,
    private readonly albumsService: AlbumsService,
    private readonly artistsService: ArtistsService,
    private readonly favoritesService: FavoritesService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  @HttpCode(200)
  @ApiGetAllDataResponse(Track, ['Track'], 'tracks')
  async getAllTracks(): Promise<Track[]> {
    return await this.tracksService.getAllTracks();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  @HttpCode(200)
  @ApiOperation({
    summary: 'Get single track by id',
    description: 'Gets single track by id',
    tags: ['Track'],
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful operation',
    type: Track,
  })
  async getTrack(
    @Param('id', new ZodValidationPipe(trackIdSchema)) id: string,
  ): Promise<Track> {
    const track: Track | null = await this.tracksService.getTrack(id);
    if (!track) throw new InstanceNotFoundException(`track with id = ${id}`);
    return track;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createTrackSchema))
  async addTrack(@Body() createTrackDto: CreateTrackDto): Promise<Track> {
    if (!createTrackDto.artistId) createTrackDto.artistId = null;
    if (!createTrackDto.albumId) createTrackDto.albumId = null;
    const { artistId, albumId } = await checkArtistAlbumPair(
      createTrackDto.artistId,
      createTrackDto.albumId,
      this.albumsService,
      this.artistsService,
    );
    createTrackDto.artistId = artistId;
    createTrackDto.albumId = albumId;
    return await this.tracksService.addTrack(createTrackDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Put(':id')
  @HttpCode(200)
  async updateTrackData(
    @Param('id', new ZodValidationPipe(trackIdSchema)) id: string,
    @Body(new ZodValidationPipe(updateTrackSchema))
    updateTrackDto: UpdateTrackDto,
  ): Promise<Track> {
    const existingTrackRecord: Track | null = await this.tracksService.getTrack(
      id,
    );
    if (!existingTrackRecord)
      throw new InstanceNotFoundException(`track with id = ${id}`);
    let newArtistId: string | null | undefined = undefined;
    let newAlbumId: string | null | undefined = undefined;
    if (updateTrackDto.hasOwnProperty('artistId'))
      newArtistId = updateTrackDto.artistId || null;
    if (updateTrackDto.hasOwnProperty('albumId'))
      newAlbumId = updateTrackDto.albumId || null;
    if (newArtistId !== undefined || newAlbumId !== undefined) {
      const { artistId, albumId } = await checkArtistAlbumPair(
        newArtistId === undefined ? existingTrackRecord.artistId : newArtistId,
        newAlbumId === undefined ? existingTrackRecord.albumId : newAlbumId,
        this.albumsService,
        this.artistsService,
      );
      updateTrackDto.artistId = artistId;
      updateTrackDto.albumId = albumId;
    }
    const track: Track | null = await this.tracksService.updateTrackData(
      id,
      updateTrackDto,
    );
    if (!track) throw new InstanceNotFoundException('track');
    return track;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  @HttpCode(204)
  async deleteTrack(
    @Param('id', new ZodValidationPipe(trackIdSchema)) id: string,
  ) {
    if (!(await this.tracksService.deleteTrack(id)))
      throw new InstanceNotFoundException(`track with id = ${id}`);
    // delete record from favorites (if it is there)
    await this.favoritesService.deleteTrackFromFavorites(id);
  }
}
