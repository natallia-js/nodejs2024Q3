import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidRefreshTokenException extends HttpException {
  constructor() {
    super('Refresh token is invalid or expired', HttpStatus.FORBIDDEN); // 403
  }
}
