import { Type, applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';

export const ApiGetAllDataResponse = <TModel extends Type<any>>(
  model: TModel,
  tags: string[],
  pluralTypeNameString: string,
  additionalDescriptionInfo: string | null = null,
) => {
  return applyDecorators(
    ApiOperation({
      summary: `Get all ${pluralTypeNameString}`,
      description:
        `Gets all ${pluralTypeNameString}` + additionalDescriptionInfo ?? '',
      tags,
    }),
    ApiExtraModels(model),
    ApiResponse({
      status: HttpStatus.OK,
      description: 'Successful operation',
      schema: {
        type: 'array',
        items: { $ref: getSchemaPath(model) },
      },
    }),
  );
};
