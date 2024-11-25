import { z } from 'zod';
import { Exclude } from 'class-transformer';
import { User as UserModel } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({
    description: 'User identifier',
    nullable: false,
    format: 'uuid',
    required: true,
  })
  id: string; // uuid v4

  @ApiProperty({
    description: 'User login',
    nullable: false,
    example: 'TestUser',
    required: true,
  })
  login: string;

  @Exclude()
  password: string;

  @ApiProperty({
    description: 'Update version (increments on each update)',
    nullable: false,
    example: 1,
    required: false,
  })
  version: number;

  @ApiProperty({
    description: 'Timestamp of user record creation',
    nullable: false,
    default: 'timestamp of record creation',
    example: 1655000000,
    required: false,
  })
  createdAt: number;

  @ApiProperty({
    description:
      'Timestamp of user record last modification (only password can be modified)',
    nullable: false,
    default: 'timestamp of record creation',
    example: 1655000000,
    required: false,
  })
  updatedAt: number;

  constructor(user: UserModel) {
    if (user.id) this.id = user.id;
    if (user.login) this.login = user.login;
    if (user.password) this.password = user.password;
    if (user.version) this.version = user.version;
    if (user.createdAt) this.createdAt = user.createdAt.valueOf();
    if (user.updatedAt) this.updatedAt = user.updatedAt.valueOf();
  }
}

export const userIdSchema = z.string().uuid('User id is not valid');

export const createUserSchema = z
  .object({
    login: z.string().min(1, 'Minimal login length is 1 symbol'),
    password: z.string().min(1, 'Minimal password length is 1 symbol'),
  })
  .required();

//export type CreateUserDto = z.infer<typeof createUserSchema>;

export class CreateUserDto {
  @ApiProperty({ description: "The user's login", required: true })
  login: string;

  @ApiProperty({ description: "The user's password", required: true })
  password: string;
}

export const authUserSchema = z
  .object({
    login: z.string().min(1, 'Minimal login length is 1 symbol'),
    password: z.string().min(1, 'Minimal password length is 1 symbol'),
  })
  .required();

export class AuthUserDto {
  @ApiProperty({ description: "The user's login", required: true })
  login: string;

  @ApiProperty({ description: "The user's password", required: true })
  password: string;
}

export const refreshTokenSchema = z
  .object({
    refreshToken: z.string(),
  })
  .required();

export class RefreshTokenDto {
  @ApiProperty({ description: 'Refresh token', required: true })
  refreshToken: string;
}

export const updatePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, 'Unknown current password'), // current password
    newPassword: z.string().min(1, 'Minimal password length is 1 symbol'), // new password
  })
  .required();

//export type UpdatePasswordDto = z.infer<typeof updatePasswordSchema>;

export class UpdatePasswordDto {
  @ApiProperty({ description: "The user's old password", required: true })
  oldPassword: string;

  @ApiProperty({ description: "The user's new password", required: true })
  newPassword: string;
}
