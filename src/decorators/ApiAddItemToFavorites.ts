import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { Error as ErrorType } from '../dto/error';

export const ApiAddItemToFavorites = (
  tags: string[],
  singleTypeNameString: string,
) => {
  return applyDecorators(
    ApiOperation({
      summary: `Add ${singleTypeNameString} to the favorites`,
      description: `Add ${singleTypeNameString} to the favorites`,
      tags,
    }),
    ApiExtraModels(ErrorType),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: `${
        singleTypeNameString.charAt(0).toUpperCase() +
        singleTypeNameString.slice(1)
      } was successfully added to favorites`,
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        `Bad request. Parameter ${singleTypeNameString}Id is invalid (not uuid). ` +
        `Error message: "Bad request params: ${
          singleTypeNameString.charAt(0).toUpperCase() +
          singleTypeNameString.slice(1)
        } id is not valid"`,
      schema: {
        $ref: getSchemaPath(ErrorType),
      },
    }),
    ApiResponse({
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      description: `${
        singleTypeNameString.charAt(0).toUpperCase() +
        singleTypeNameString.slice(1)
      } with id doesn't exist`,
      schema: {
        $ref: getSchemaPath(ErrorType),
      },
    }),
  );
};
