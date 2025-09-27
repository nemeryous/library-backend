import { ApiProperty } from '@nestjs/swagger';

export function ApiEnumProperty<TEnum>(
  getEnum: () => TEnum,
  options: { description?: string } = {},
): PropertyDecorator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-assignment
  const enumValue = getEnum() as any;

  return ApiProperty({
    enum: enumValue,
    description: options.description,
  });
}
