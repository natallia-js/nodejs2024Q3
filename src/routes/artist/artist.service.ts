import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../additional-services/prisma.service';
import { Artist as ArtistModel } from '@prisma/client';
import { CreateArtistDto, Artist, UpdateArtistDto } from '../../dto/artist';

@Injectable()
export class ArtistsService {
  constructor(private prisma: PrismaService) {}

  async getAllArtists(): Promise<Artist[]> {
    const artists: ArtistModel[] = await this.prisma.artist.findMany();
    return artists.map((artist) => new Artist(artist));
  }

  async getGivenArtists(ids: string[]): Promise<Artist[]> {
    const artists: ArtistModel[] = await this.prisma.artist.findMany({
      where: { id: { in: ids || [] } },
    });
    return artists.map((artist) => new Artist(artist));
  }

  async getArtist(id: string): Promise<Artist | null> {
    const artist: ArtistModel | null = await this.prisma.artist.findUnique({
      where: { id: id || '' },
    });
    return artist ? new Artist(artist) : null;
  }

  async artistWithNameExists(name: string, notId?: string): Promise<boolean> {
    if (!notId)
      return Boolean(
        await this.prisma.artist.findUnique({
          where: { name: name || '' },
        }),
      );
    return Boolean(
      await this.prisma.artist.findUnique({
        where: { NOT: { id: notId }, name: name || '' },
      }),
    );
  }

  async addArtist(newArtistData: CreateArtistDto): Promise<Artist> {
    const artist: ArtistModel = await this.prisma.artist.create({
      data: newArtistData,
    });
    return new Artist(artist);
  }

  async updateArtistData(
    artistId: string,
    updateArtistDto: UpdateArtistDto,
  ): Promise<Artist | null> {
    const artist: ArtistModel | null = await this.prisma.artist.update({
      where: { id: artistId },
      data: updateArtistDto,
    });
    return artist ? new Artist(artist) : null;
  }

  async deleteArtist(id: string): Promise<boolean> {
    if (await this.prisma.artist.findUnique({ where: { id } })) {
      await this.prisma.artist.delete({ where: { id } });
      return true;
    }
    return false;
  }
}
