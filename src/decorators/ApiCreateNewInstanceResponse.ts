import { Type, applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiExtraModels, ApiOperation, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { Error as ErrorType } from '../dto/error';

export const ApiCreateNewInstanceResponse = <TModel extends Type<any>>(
  model: TModel, tags: string[], singleTypeNameString: string
) => {
  return applyDecorators(
    ApiOperation({
      summary: `Create ${singleTypeNameString}`,
      description: `Creates a new ${singleTypeNameString}`,
      tags,
    }),
    ApiExtraModels(ErrorType),
    ApiResponse({
      status: HttpStatus.CREATED,
      description: `The ${singleTypeNameString} has been created`,
      schema: {
        '$ref': getSchemaPath(model)
      },
    }),
    ApiResponse({
      status: HttpStatus.BAD_REQUEST,
      description: 'Bad request. Body does not contain required field(-s) or field value(-s) is(are) incorrect',
      schema: {
        '$ref': getSchemaPath(ErrorType)
      },
    })
  );
};
