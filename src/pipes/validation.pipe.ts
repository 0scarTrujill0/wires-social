import { BadRequestException, PipeTransform } from '@nestjs/common';

export class ValidatorPipe<T> implements PipeTransform<T> {
  schema: any;
  constructor(schema: any) {
    this.schema = schema;
  }
  public transform(value: T): T {
    const result = this.schema.validate(value);
    if (result.error) {
      const errorMessages = result.error.details.map((d) => d.message).join();
      throw new BadRequestException(errorMessages);
    }
    return value;
  }
}
