import { Type, applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiExtraModels, ApiOperation, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { Error as ErrorType } from '../dto/error';

export const ApiGetCertainItemResponse = <TModel extends Type<any>>(
  model: TModel, tags: string[], singleTypeNameString: string
) => {
  return applyDecorators(
    ApiOperation({
      summary: `Get single ${singleTypeNameString} by id`,
      description: `Gets single ${singleTypeNameString} by id`,
      tags,
    }),
    ApiExtraModels(model),
    ApiExtraModels(ErrorType),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Successful operation',
      schema: {
        '$ref': getSchemaPath(model)
      },
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description:
        'Bad request. Parameter id is invalid (not uuid). ' +
        `Error message: "Bad request params: ${singleTypeNameString} id is not valid"`,
      schema: {
        '$ref': getSchemaPath(ErrorType)
      },
    }),
    ApiResponse({
      status: HttpStatus.NOT_FOUND,
      description:
        `${singleTypeNameString.charAt(0).toUpperCase() + singleTypeNameString.slice(1)} not found. ` +
        `Error message: "Instance not found: ${singleTypeNameString} with id = [id]"`,
      schema: {
        '$ref': getSchemaPath(ErrorType)
      },
    })
  );
};
