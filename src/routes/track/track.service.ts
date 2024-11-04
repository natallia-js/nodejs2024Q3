import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../additional-services/prisma.service';
import { Track as TrackModel } from '@prisma/client';
import { CreateTrackDto, Track, UpdateTrackDto } from '../../dto/track';

@Injectable()
export class TracksService {
  constructor(private prisma: PrismaService) {}

  async getAllTracks(): Promise<Track[]> {
    const tracks: TrackModel[] = await this.prisma.track.findMany();
    return tracks.map(track => new Track(track));
  }

  async getGivenTracks(ids: string[]): Promise<Track[]> {
    const tracks: TrackModel[] = await this.prisma.track.findMany({
      where: { id: { in: ids || [] }},
    });
    return tracks.map(track => new Track(track));
  }  

  async getTrack(id: string): Promise<Track | null> {
    const track: TrackModel | null = await this.prisma.track.findUnique({
      where: { id: id || '' },
    });
    return track ? new Track(track) : null;
  }

  async addTrack(newTrackData: CreateTrackDto): Promise<Track> {
    const track: TrackModel = await this.prisma.track.create({
      data: newTrackData,
    });
    return new Track(track);
  }

  async updateTrackData(trackId: string, updateTrackDto: UpdateTrackDto): Promise<Track | null> {
    const track: TrackModel | null = await this.prisma.track.update({
      where: { id: trackId },
      data: updateTrackDto,
    });
    return track ? new Track(track) : null;
  }

  async deleteTrack(id: string): Promise<Track | null> {
    const track = await this.prisma.track.delete({
      where: { id },
    });
    return track ? new Track(track) : null;
  }
}
