import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../additional-services/prisma.service';
import { Favorites as FavoritesModel } from '@prisma/client';
import { Favorites } from '../../dto/favorites';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async getAllFavorites(): Promise<Favorites> {
    const favorites: FavoritesModel | null =
      await this.prisma.favorites.findFirst({});
    if (!favorites) return { artists: [], albums: [], tracks: [] };
    const favoriteArtistsIds = favorites.artists.split(',');
    const favoriteAlbumsIds = favorites.albums.split(',');
    const favoriteTracksIds = favorites.tracks.split(',');
    const favoriteArtists =
      favoriteArtistsIds.length > 0
        ? await this.prisma.artist.findMany({
            where: { id: { in: Array.from(favoriteArtistsIds) } },
          })
        : [];
    const favoriteAlbums =
      favoriteAlbumsIds.length > 0
        ? await this.prisma.album.findMany({
            where: { id: { in: Array.from(favoriteAlbumsIds) } },
          })
        : [];
    const favoriteTracks =
      favoriteTracksIds.length > 0
        ? await this.prisma.track.findMany({
            where: { id: { in: Array.from(favoriteTracksIds) } },
          })
        : [];
    return {
      artists: favoriteArtists,
      albums: favoriteAlbums,
      tracks: favoriteTracks,
    };
  }

  async addArtistToFavorites(artistId: string) {
    const favoritesRecord = await this.prisma.favorites.findFirst({});
    if (favoritesRecord) {
      if (!favoritesRecord.artists.includes(artistId))
        await this.prisma.favorites.update({
          where: { id: favoritesRecord.id },
          data: { artists: `${favoritesRecord.artists},${artistId}` },
        });
    } else {
      await this.prisma.favorites.create({
        data: { artists: artistId, albums: '', tracks: '' },
      });
    }
  }

  async addAlbumToFavorites(albumId: string) {
    const favoritesRecord = await this.prisma.favorites.findFirst({});
    if (favoritesRecord) {
      if (!favoritesRecord.albums.includes(albumId))
        await this.prisma.favorites.update({
          where: { id: favoritesRecord.id },
          data: { albums: `${favoritesRecord.albums},${albumId}` },
        });
    } else {
      await this.prisma.favorites.create({
        data: { artists: '', albums: albumId, tracks: '' },
      });
    }
  }

  async addTrackToFavorites(trackId: string) {
    const favoritesRecord = await this.prisma.favorites.findFirst({});
    if (favoritesRecord) {
      if (!favoritesRecord.tracks.includes(trackId))
        await this.prisma.favorites.update({
          where: { id: favoritesRecord.id },
          data: { tracks: `${favoritesRecord.tracks},${trackId}` },
        });
    } else {
      await this.prisma.favorites.create({
        data: { artists: '', albums: '', tracks: trackId },
      });
    }
  }

  // returns true if there is a favorites record with albums string that includes albumId,
  // and this albumId is successfully deleted from favorites
  async deleteAlbumFromFavorites(albumId: string): Promise<boolean> {
    const favoritesRecord = await this.prisma.favorites.findFirst({});
    if (!favoritesRecord) return false;
    if (favoritesRecord.albums.includes(albumId)) {
      const albumIdsArray = favoritesRecord.albums.split(',');
      const itemIndex = albumIdsArray.indexOf(albumId);
      albumIdsArray.splice(itemIndex, 1);
      await this.prisma.favorites.update({
        where: { id: favoritesRecord.id },
        data: { albums: albumIdsArray.join(',') },
      });
      return true;
    }
    return false;
  }

  // returns true if there is a favorites record with artists string that includes artistId,
  // amd this artistId is successfully deleted from favorites
  async deleteArtistFromFavorites(artistId: string): Promise<boolean> {
    const favoritesRecord = await this.prisma.favorites.findFirst({});
    if (!favoritesRecord) return false;
    if (favoritesRecord.artists.includes(artistId)) {
      const artistIdsArray = favoritesRecord.artists.split(',');
      const itemIndex = artistIdsArray.indexOf(artistId);
      artistIdsArray.splice(itemIndex, 1);
      await this.prisma.favorites.update({
        where: { id: favoritesRecord.id },
        data: { artists: artistIdsArray.join(',') },
      });
      return true;
    }
    return false;
  }

  // returns true if there is a favorites record with tracks string that includes trackId,
  // amd this trackId is successfully deleted from favorites
  async deleteTrackFromFavorites(trackId: string): Promise<boolean> {
    const favoritesRecord = await this.prisma.favorites.findFirst({});
    if (!favoritesRecord) return false;
    if (favoritesRecord.tracks.includes(trackId)) {
      const trackIdsArray = favoritesRecord.tracks.split(',');
      const itemIndex = trackIdsArray.indexOf(trackId);
      trackIdsArray.splice(itemIndex, 1);
      await this.prisma.favorites.update({
        where: { id: favoritesRecord.id },
        data: { tracks: trackIdsArray.join(',') },
      });
      return true;
    }
    return false;
  }
}
