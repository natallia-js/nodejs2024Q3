import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { Error as ErrorType } from '../dto/error';
import { Tokens } from '../dto/tokens';

export const ApiRefreshTokensResponse = (tags: string[]) => {
  return applyDecorators(
    ApiOperation({
      summary: 'Refresh tokens',
      description: 'Returns a new pair of access anf refresh tokens',
      tags,
    }),
    ApiExtraModels(ErrorType),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Operation successful',
      schema: {
        $ref: getSchemaPath(Tokens),
      },
    }),
    ApiResponse({
      status: HttpStatus.UNAUTHORIZED,
      description: 'Bad request. Body does not contain refresh token',
      schema: {
        $ref: getSchemaPath(ErrorType),
      },
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description: 'Refresh token is invalid or expired',
      schema: {
        $ref: getSchemaPath(ErrorType),
      },
    }),
  );
};
