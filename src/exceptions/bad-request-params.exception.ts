import { HttpException, HttpStatus } from '@nestjs/common';

export class BadRequestParamsException extends HttpException {
  constructor(additionalInfo = '') {
    const message =
      'Bad request params' + (additionalInfo ? `: ${additionalInfo}` : '');
    super(message, HttpStatus.BAD_REQUEST); // 400
  }
}
