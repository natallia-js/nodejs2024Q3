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
} from '@nestjs/common';
import { AlbumsService } from './album.service';
import { ArtistsService } from '../artist/artist.service';
import { FavoritesService } from '../favorite/favorite.service';
import {
  CreateAlbumDto,
  createAlbumSchema,
  UpdateAlbumDto,
  updateAlbumSchema,
  Album,
  albumIdSchema,
} from '../../dto/album';
import { InstanceNotFoundException } from '../../exceptions/instance-not-found.exception';
import ZodValidationPipe from '../../pipes/zod-validation.pipe';

@Controller('album')
export class AlbumsController {
  constructor(
    private readonly albumsService: AlbumsService,
    private readonly artistsService: ArtistsService,
    private readonly favoritesService: FavoritesService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  @HttpCode(200)
  async getAllAlbums(): Promise<Album[]> {
    return await this.albumsService.getAllAlbums();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  @HttpCode(200)
  async getAlbum(
    @Param('id', new ZodValidationPipe(albumIdSchema)) id: string,
  ): Promise<Album> {
    const album: Album | null = await this.albumsService.getAlbum(id);
    if (!album) throw new InstanceNotFoundException(`album with id = ${id}`);
    return album;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAlbumSchema))
  async addAlbum(@Body() createAlbumDto: CreateAlbumDto): Promise<Album> {
    if (createAlbumDto?.artistId) {
      if (!(await this.artistsService.getArtist(createAlbumDto.artistId)))
        throw new InstanceNotFoundException(
          `artist with id = ${createAlbumDto.artistId}`,
        );
    } else createAlbumDto.artistId = null;
    return await this.albumsService.addAlbum(createAlbumDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Put(':id')
  @HttpCode(200)
  async updateAlbumData(
    @Param('id', new ZodValidationPipe(albumIdSchema)) id: string,
    @Body(new ZodValidationPipe(updateAlbumSchema))
    updateAlbumDto: UpdateAlbumDto,
  ): Promise<Album> {
    const existingAlbumRecord: Album | null = await this.albumsService.getAlbum(
      id,
    );
    if (!existingAlbumRecord)
      throw new InstanceNotFoundException(`album with id = ${id}`);
    if (updateAlbumDto?.artistId) {
      if (!(await this.artistsService.getArtist(updateAlbumDto.artistId)))
        throw new InstanceNotFoundException(
          `artist with id = ${updateAlbumDto.artistId}`,
        );
    } else updateAlbumDto.artistId = null;
    const album: Album | null = await this.albumsService.updateAlbumData(
      id,
      updateAlbumDto,
    );
    if (!album) throw new InstanceNotFoundException(`album with id = ${id}`);
    return album;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  @HttpCode(204)
  async deleteAlbum(
    @Param('id', new ZodValidationPipe(albumIdSchema)) id: string,
  ) {
    if (!(await this.albumsService.deleteAlbum(id)))
      throw new InstanceNotFoundException(`album with id = ${id}`);
    // delete record from favorites (if it is there)
    await this.favoritesService.deleteAlbumFromFavorites(id);
  }
}
