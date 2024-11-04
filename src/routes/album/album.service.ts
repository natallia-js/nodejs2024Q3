import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../additional-services/prisma.service';
import { Album as AlbumModel } from '@prisma/client';
import { CreateAlbumDto, Album, UpdateAlbumDto } from '../../dto/album';

@Injectable()
export class AlbumsService {
  constructor(private prisma: PrismaService) {}

  async getAllAlbums(): Promise<Album[]> {
    const albums: AlbumModel[] = await this.prisma.album.findMany();
    return albums.map((album) => new Album(album));
  }

  async getGivenAlbums(ids: string[]): Promise<Album[]> {
    const albums: AlbumModel[] = await this.prisma.album.findMany({
      where: { id: { in: ids || [] } },
    });
    return albums.map((album) => new Album(album));
  }

  async getAlbum(id: string): Promise<Album | null> {
    const album: AlbumModel | null = await this.prisma.album.findUnique({
      where: { id: id || '' },
    });
    return album ? new Album(album) : null;
  }

  async addAlbum(newAlbumData: CreateAlbumDto): Promise<Album> {
    const album: AlbumModel = await this.prisma.album.create({
      data: newAlbumData,
    });
    return new Album(album);
  }

  async updateAlbumData(
    albumId: string,
    updateAlbumDto: UpdateAlbumDto,
  ): Promise<Album | null> {
    const album: AlbumModel | null = await this.prisma.album.update({
      where: { id: albumId },
      data: updateAlbumDto,
    });
    return album ? new Album(album) : null;
  }

  async deleteAlbum(id: string): Promise<boolean> {
    if (await this.prisma.album.findUnique({ where: { id } })) {
      await this.prisma.album.delete({ where: { id } });
      return true;
    }
    return false;
  }
}
