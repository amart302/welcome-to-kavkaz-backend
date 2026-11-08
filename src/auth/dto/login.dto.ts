import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

import { normalizeString } from '@/common/transformers/normalize-string.transformer';

export class LoginDto {
  @ApiProperty({
    example: 'admin@example.com',
    description: 'Email администратора',
    format: 'email',
    maxLength: 255,
  })
  @Transform(normalizeString)
  @IsDefined({ message: 'Email обязателен' })
  @IsString({ message: 'Email должен быть строкой' })
  @IsEmail({}, { message: 'Укажите корректный email' })
  @MaxLength(255, { message: 'Email не должен превышать 255 символов' })
  email!: string;

  @ApiProperty({
    description: 'Пароль администратора',
    format: 'password',
    minLength: 1,
    writeOnly: true,
  })
  @IsDefined({ message: 'Пароль обязателен' })
  @IsString({ message: 'Пароль должен быть строкой' })
  @IsNotEmpty({ message: 'Пароль не должен быть пустым' })
  password!: string;
}
