import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

import { normalizeNumber } from '@/common/transformers/normalize-number.transformer';
import { normalizeString } from '@/common/transformers/normalize-string.transformer';

export class CreateTourDayDto {
  @ApiProperty({
    example: 1,
    description: 'Номер дня',
    minimum: 1,
    maximum: 30,
  })
  @Transform(normalizeNumber)
  @IsDefined({ message: 'Номер дня обязателен' })
  @IsInt({ message: 'Номер дня должен быть целым числом' })
  @Min(1, { message: 'Номер дня должен быть не меньше 1' })
  @Max(30, {
    message: 'Номер дня не должен превышать 30',
  })
  dayNumber!: number;

  @ApiProperty({
    example: 'Водопад и башни Эрзи',
    description: 'Название дня',
    maxLength: 255,
  })
  @Transform(normalizeString)
  @IsDefined({ message: 'Название дня обязательно' })
  @IsString({ message: 'Название дня должно быть строкой' })
  @IsNotEmpty({
    message: 'Название дня не должно быть пустым',
  })
  @MaxLength(255, {
    message: 'Название дня не должно превышать 255 символов',
  })
  title!: string;

  @ApiProperty({
    example: 'Посетим Ляжгинский водопад и башенный комплекс Эрзи.',
    description: 'Программа дня',
  })
  @Transform(normalizeString)
  @IsDefined({ message: 'Программа дня обязательна' })
  @IsString({ message: 'Программа дня должна быть строкой' })
  @IsNotEmpty({
    message: 'Программа дня не должна быть пустой',
  })
  description!: string;

  @ApiPropertyOptional({
    example: 'Гостевой дом в Джейрахском районе',
    description: 'Место ночёвки',
    type: String,
    nullable: true,
    maxLength: 255,
  })
  @Transform(normalizeString)
  @IsOptional()
  @IsString({ message: 'Место ночёвки должно быть строкой' })
  @IsNotEmpty({
    message: 'Место ночёвки не должно быть пустым',
  })
  @MaxLength(255, {
    message: 'Место ночёвки не должно превышать 255 символов',
  })
  overnight?: string | null;
}
