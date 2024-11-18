import { HttpException, HttpStatus } from '@nestjs/common';

export class UserWithLoginAndPasswordNotFoundException extends HttpException {
  constructor(login: string) {
    super(`User with login "${login}" not found or wrong password specified. Try again`, HttpStatus.FORBIDDEN); // 403
  }
}
