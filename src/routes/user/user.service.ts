import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../additional-services/prisma.service';
import { User as UserModel } from '@prisma/client';
import { CreateUserDto, User, AuthUserDto } from '../../dto/user';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(): Promise<User[]> {
    const users: UserModel[] = await this.prisma.user.findMany();
    return users.map((user) => new User(user));
  }

  async getUser(id: string): Promise<User | null> {
    const user: UserModel | null = await this.prisma.user.findUnique({
      where: { id: id || '' },
    });
    return user ? new User(user) : null;
  }

  async getUsersByLogin(login: string): Promise<User[] | null> {
    const users: UserModel[] | null = await this.prisma.user.findMany({
      where: { login },
    });
    if (!users) return null;
    return users.map(user => new User(user));
  }

  async addUser(newUserData: CreateUserDto): Promise<User> {
    const user: UserModel = await this.prisma.user.create({
      data: newUserData,
    });
    return new User(user);
  }

  async updateUserPassword(
    userId: string,
    newPassword: string,
  ): Promise<User | null> {
    const user: UserModel | null = await this.prisma.user.update({
      where: { id: userId },
      data: {
        password: newPassword,
        version: { increment: 1 },
        updatedAt: new Date(),
      },
    });
    return user ? new User(user) : null;
  }

  // returns true if user was found and deleted, false - if user was not found
  async deleteUser(id: string): Promise<boolean> {
    if (await this.prisma.user.findUnique({ where: { id } })) {
      await this.prisma.user.delete({ where: { id } });
      return true;
    }
    return false;
  }
}
