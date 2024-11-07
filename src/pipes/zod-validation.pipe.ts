import { /*ArgumentMetadata,*/ PipeTransform } from '@nestjs/common';
import { ZodSchema } from 'zod';
import { BadRequestParamsException } from '../exceptions/bad-request-params.exception';

class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown /*, metadata: ArgumentMetadata*/) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      const errMessage = !error
        ? null
        : error.issues
            ?.map(
              (issue) =>
                `${issue?.path?.length ? '"' + issue.path[0] + '": ' : ''}${
                  issue.message
                }`,
            )
            .join('; ');
      throw new BadRequestParamsException(errMessage);
    }
  }
}

export default ZodValidationPipe;
