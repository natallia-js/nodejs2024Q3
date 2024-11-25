import { HttpException, HttpStatus } from '@nestjs/common';

export class InstanceForFavoriteNotFoundException extends HttpException {
  constructor(instanceKind: string) {
    super(
      `Instance not found: ${instanceKind}`,
      HttpStatus.UNPROCESSABLE_ENTITY,
    ); // 422
  }
}
