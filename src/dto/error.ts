import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class Error {
  @ApiProperty({
    description: 'Error code',
    default: HttpStatus.INTERNAL_SERVER_ERROR,
    required: true,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error datetime as ISO string',
    default: new Date().toISOString(),
    required: true,
  })
  timestamp: string;

  @ApiProperty({ description: 'Request url', example: '/api', required: true, })
  path: string;

  @ApiProperty({
    description: 'Error message',
    default: 'Internal Server Error',
    required: true,
  })
  message: string;

  @ApiProperty({ description: 'Additional error information', default: '', required: true, })
  additionalErrorInfo: string;
}
