import { HttpException, HttpStatus } from '@nestjs/common';

export class InstanceNotFoundException extends HttpException {
  constructor(instanceKind: string) {
    super(`Instance not found: ${instanceKind}`, HttpStatus.NOT_FOUND); // 404
  }
}
