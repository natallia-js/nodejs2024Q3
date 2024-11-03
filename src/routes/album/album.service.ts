import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../additional-services/prisma.service';
import { Album as AlbumModel } from '@prisma/client';
import { CreateAlbumDto, Album, UpdateAlbumDto } from '../../dto/album';

@Injectable()
export class AlbumsService {
  constructor(private prisma: PrismaService) {}

  async getAllAlbums(): Promise<Album[]> {
    const albums: AlbumModel[] = await this.prisma.album.findMany();
    return albums.map(album => new Album(album));
  }

  async getArtist(id: string): Promise<Artist | null> {
    const artist: ArtistModel | null = await this.prisma.artist.findUnique({
      where: { id: id || '' },
    });
    return artist ? new Artist(artist) : null;
  }

  async artistWithNameExists(name: string, notId?: string): Promise<boolean> {
    if (!notId)
        return Boolean(await this.prisma.artist.findUnique({
          where: { name: name || '' },
        }));
    return Boolean(await this.prisma.artist.findUnique({
        where: { NOT: { id: notId }, name: name || '' },
    }));
  }

  async addArtist(newArtistData: CreateArtistDto): Promise<Artist> {
    const artist: ArtistModel = await this.prisma.artist.create({
      data: newArtistData,
    });
    return new Artist(artist);
  }

  async updateArtistData(artistId: string, updateArtistDto: UpdateArtistDto): Promise<Artist | null> {
    const artist: ArtistModel | null = await this.prisma.artist.update({
      where: { id: artistId },
      data: updateArtistDto,
    });
    return artist ? new Artist(artist) : null;
  }

  async deleteArtist(id: string): Promise<Artist | null> {
    const artist = await this.prisma.artist.delete({
      where: { id },
    });
    return artist ? new Artist(artist) : null;
  }
}
