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
import { ArtistsService } from './artist.service';
import {
  CreateArtistDto,
  createArtistSchema,
  UpdateArtistDto,
  updateArtistSchema,
  Artist,
  artistIdSchema,
} from '../../dto/artist';
import { HttpExceptionFilter } from '../../exceptions/http-exception.filter';
import { InstanceNotFoundException } from '../../exceptions/instance-not-found.exception';
import ZodValidationPipe from 'src/pipes/zod-validation.pipe';
import { BadRequestParamsException } from 'src/exceptions/bad-request-params.exception';

@Controller('artist')
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  @HttpCode(200)
  @UseFilters(HttpExceptionFilter)
  async getAllArtists(): Promise<Artist[]> {
    return this.artistsService.getAllArtists();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  @HttpCode(200)
  @UseFilters(HttpExceptionFilter)
  async getArtist(
    @Param('id', new ZodValidationPipe(artistIdSchema)) id: string,
  ): Promise<Artist> {
    const artist: Artist | null = await this.artistsService.getArtist(id);
    if (!artist) throw new InstanceNotFoundException(`artist with id = ${id}`);
    return artist;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createArtistSchema))
  @UseFilters(HttpExceptionFilter)
  async addArtist(@Body() createArtistDto: CreateArtistDto): Promise<Artist> {
    if (await this.artistsService.artistWithNameExists(createArtistDto.name))
      throw new BadRequestParamsException(
        'Artist with this name already exists',
      );
    return this.artistsService.addArtist(createArtistDto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Put(':id')
  @HttpCode(200)
  @UseFilters(HttpExceptionFilter)
  async updateArtistData(
    @Param('id', new ZodValidationPipe(artistIdSchema)) id: string,
    @Body(new ZodValidationPipe(updateArtistSchema))
    updateArtistDto: UpdateArtistDto,
  ): Promise<Artist> {
    const existingArtistRecord: Artist | null =
      await this.artistsService.getArtist(id);
    if (!existingArtistRecord) throw new InstanceNotFoundException(`artist with id = ${id}`);
    if (
      await this.artistsService.artistWithNameExists(updateArtistDto.name, id)
    )
      throw new BadRequestParamsException(
        'Artist with this name already exists',
      );
    const artist: Artist | null = await this.artistsService.updateArtistData(
      id,
      updateArtistDto,
    );
    if (!artist) throw new InstanceNotFoundException(`artist with id = ${id}`);
    return artist;
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':id')
  @HttpCode(204)
  @UseFilters(HttpExceptionFilter)
  async deleteArtist(@Param('id', new ZodValidationPipe(artistIdSchema)) id: string) {
    if (!await this.artistsService.deleteArtist(id))
      throw new InstanceNotFoundException(`artist with id = ${id}`);
  }
}
