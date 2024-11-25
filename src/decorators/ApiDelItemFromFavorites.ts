import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { Error as ErrorType } from '../dto/error';

export const ApiDelItemFromFavorites = (
  tags: string[],
  singleTypeNameString: string,
) => {
  return applyDecorators(
    ApiOperation({
      summary: `Delete ${singleTypeNameString} from favorites`,
      description: `Delete ${singleTypeNameString} from favorites`,
      tags,
    }),
    ApiExtraModels(ErrorType),
    ApiResponse({
      status: HttpStatus.NO_CONTENT,
      description: `${
        singleTypeNameString.charAt(0).toUpperCase() +
        singleTypeNameString.slice(1)
      } was successfully deleted from favorites`,
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
      status: HttpStatus.NOT_FOUND,
      description: `${
        singleTypeNameString.charAt(0).toUpperCase() +
        singleTypeNameString.slice(1)
      } not found. Error message: "Instance not found: ${singleTypeNameString} with id = [${singleTypeNameString}Id]"`,
      schema: {
        $ref: getSchemaPath(ErrorType),
      },
    }),
  );
};
