import { Injectable } from '@nestjs/common';
import { PrismaService } from '../additional-services/prisma.service';
import { User as UserModel } from '@prisma/client';
import { CreateUserDto, User } from '../dto/user';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(): Promise<User[]> {
    const users: UserModel[] = await this.prisma.user.findMany();
    return users.map(user => new User(user));
  }

  async getUser(id: string): Promise<User | null> {
    const user: UserModel | null = await this.prisma.user.findUnique({
      where: { id: id || '' },
    });
    return user ? new User(user) : null;
  }

  async userWithLoginExists(login: string): Promise<boolean> {
    const user: UserModel | null = await this.prisma.user.findUnique({
      where: { login: login || '' },
    });
    return Boolean(user); 
  }

  async addUser(newUserData: CreateUserDto): Promise<User> {
    const user: UserModel = await this.prisma.user.create({
      data: newUserData,
    });
    return new User(user);
  }

  async updateUserPassword(userId: string, newPassword: string): Promise<User | null> {
    const user: UserModel | null = await this.prisma.user.update({
      where: { id: userId,  },
      data: { password: newPassword },
    });
    return user ? new User(user) : null;
  }

  async deleteUser(id: string): Promise<User | null> {
    const user = await this.prisma.user.delete({
      where: { id },
    });
    return user ? new User(user) : null;
  }
}
