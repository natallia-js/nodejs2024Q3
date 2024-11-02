import { Injectable } from '@nestjs/common';
import { PrismaService } from '../additional-services/prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto } from '../dto/user';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async getUser(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id: id || '' },
    });
  }

  async userWithLoginExists(login: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { login: login || '' },
    });
    return Boolean(user); 
  }

  async addUser(newUserData: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data: newUserData,
    });
  }

  async updateUserPassword(userId: string, newPassword: string): Promise<User> {
    return this.prisma.user.update({
      where: { id: userId,  },
      data: { password: newPassword },
    });
  }

  async deleteUser(id: string): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
