import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDefined, IsInt, IsUUID, Max, Min } from 'class-validator';

import { normalizeNumber } from '@/common/transformers/normalize-number.transformer';

export class CreateTourImageDto {
  @ApiProperty({
    example: '848d5341-08b2-4d60-8877-efcb31d71ea9',
    description: 'ID загруженного изображения',
    format: 'uuid',
  })
  @IsDefined({ message: 'ID изображения обязателен' })
  @IsUUID(undefined, { message: 'ID изображения должен быть UUID' })
  id!: string;

  @ApiProperty({
    example: 1,
    description: 'Позиция в галерее',
    minimum: 1,
    maximum: 30,
  })
  @Transform(normalizeNumber)
  @IsDefined({ message: 'Позиция в галерее обязательна' })
  @IsInt({ message: 'Позиция в галерее должна быть целым числом' })
  @Min(1, { message: 'Позиция в галерее должна быть не меньше 1' })
  @Max(30, {
    message: 'Позиция в галерее не должна превышать 30',
  })
  position!: number;
}
