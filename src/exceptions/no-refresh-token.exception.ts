import { HttpException, HttpStatus } from '@nestjs/common';

export class NoRefreshTokenException extends HttpException {
  constructor() {
    super('No [valid] refresh token specified', HttpStatus.UNAUTHORIZED); // 401
  }
}
