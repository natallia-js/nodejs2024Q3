import { z } from 'zod';

/*export interface User {
  id: string; // uuid v4
  login: string;
  password: string;
  version: number; // integer number, increments on update
  createdAt: number; // timestamp of creation
  updatedAt: number; // timestamp of last update
}*/

export const userIdSchema = z.string().uuid('User id is not valid');

export const createUserSchema = z
  .object({
    login: z.string().min(1, 'Minimal login length is 1 symbol'),
    password: z.string().min(1, 'Minimal password length is 1 symbol'),
  })
  .required();

export type CreateUserDto = z.infer<typeof createUserSchema>;

export const updatePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, 'Unknown current password'), // current password
    newPassword: z.string().min(1, 'Minimal password length is 1 symbol'), // new password
  })
  .required();

export type UpdatePasswordDto = z.infer<typeof updatePasswordSchema>;
