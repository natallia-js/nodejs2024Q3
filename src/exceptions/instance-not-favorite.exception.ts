import { HttpException, HttpStatus } from '@nestjs/common';

export class InstanceNotFavoriteException extends HttpException {
  constructor(instanceKind: string) {
    super(`Instance not favorite: ${instanceKind}`, HttpStatus.NOT_FOUND); // 404
  }
}
