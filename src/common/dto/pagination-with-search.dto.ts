import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

import { normalizeString } from '../transformers/normalize-string.transformer';
import { PaginationDto } from './pagination.dto';

export class PaginationWithSearchDto extends PaginationDto {
  @ApiPropertyOptional({
    example: 'nestjs',
    description: 'Поисковая строка',
    minLength: 2,
    maxLength: 100,
  })
  @Transform(normalizeString)
  @IsOptional()
  @IsString({ message: 'Поисковый запрос должен быть строкой' })
  @MinLength(2, {
    message: 'Поисковый запрос должен содержать не менее 2 символов',
  })
  @MaxLength(100, {
    message: 'Поисковый запрос не должен превышать 100 символов',
  })
  search?: string;
}
