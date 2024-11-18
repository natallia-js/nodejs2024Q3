import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { Error as ErrorType } from '../dto/error';
import { Tokens } from '../dto/tokens';

export const ApiLoginResponse = (
  tags: string[],
) => {
  return applyDecorators(
    ApiOperation({
      summary: 'Login',
      description: 'Allows a user to log in',
      tags,
    }),
    ApiExtraModels(ErrorType),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'User successfully logged in',
      schema: {
        $ref: getSchemaPath(Tokens),
      },
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'Bad request. Body does not contain required field(-s) or field value(-s) is(are) incorrect',
      schema: {
        $ref: getSchemaPath(ErrorType),
      },
    }),
    ApiResponse({
      status: HttpStatus.FORBIDDEN,
      description:
        'Authentication failed (no user with such login, password doesn\'t match actual one, etc.)',
      schema: {
        $ref: getSchemaPath(ErrorType),
      },
    }),    
  );
};
