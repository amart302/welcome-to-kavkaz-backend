import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

import { normalizeNumber } from '@/common/transformers/normalize-number.transformer';
import { normalizeString } from '@/common/transformers/normalize-string.transformer';

import { CreateTourDayDto } from './create-tour-day.dto';
import { CreateTourImageDto } from './create-tour-image.dto';

export class CreateTourDto {
  @ApiProperty({
    example: 'В сердце горной Ингушетии',
    description: 'Название тура',
    maxLength: 255,
  })
  @Transform(normalizeString)
  @IsDefined({ message: 'Название тура обязательно' })
  @IsString({ message: 'Название тура должно быть строкой' })
  @IsNotEmpty({
    message: 'Название тура не должно быть пустым',
  })
  @MaxLength(255, {
    message: 'Название тура не должно превышать 255 символов',
  })
  title!: string;

  @ApiProperty({
    example: 'v-serdtse-gornoy-ingushetii',
    description: 'Часть адреса страницы тура',
    maxLength: 255,
    pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
  })
  @Transform(normalizeString)
  @IsDefined({ message: 'Slug обязателен' })
  @IsString({
    message: 'Slug должен быть строкой',
  })
  @IsNotEmpty({
    message: 'Slug не должен быть пустым',
  })
  @MaxLength(255, {
    message: 'Slug не должен превышать 255 символов',
  })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'Slug должен содержать строчные латинские буквы, цифры и дефисы между словами',
  })
  slug!: string;

  @ApiProperty({
    example: 'Горные панорамы и древние башни за один день.',
    description: 'Краткое описание',
  })
  @Transform(normalizeString)
  @IsDefined({ message: 'Краткое описание обязательно' })
  @IsString({ message: 'Краткое описание должно быть строкой' })
  @IsNotEmpty({
    message: 'Краткое описание не должно быть пустым',
  })
  shortDescription!: string;

  @ApiProperty({
    example: 'Познакомимся с историей и природой горной Ингушетии.',
    description: 'Описание тура',
  })
  @Transform(normalizeString)
  @IsDefined({ message: 'Описание тура обязательно' })
  @IsString({ message: 'Описание тура должно быть строкой' })
  @IsNotEmpty({
    message: 'Описание тура не должно быть пустым',
  })
  description!: string;

  @ApiProperty({
    example: 7000,
    description: 'Цена за человека в рублях',
    minimum: 0,
    maximum: 500_000,
  })
  @Transform(normalizeNumber)
  @IsDefined({ message: 'Цена обязательна' })
  @IsInt({
    message: 'Цена должна быть целым числом',
  })
  @Min(0, {
    message: 'Цена не может быть отрицательной',
  })
  @Max(500_000, {
    message: 'Цена не должна превышать 500 000 рублей',
  })
  price!: number;

  @ApiProperty({
    example: 1,
    description: 'Длительность в днях',
    minimum: 1,
    maximum: 30,
  })
  @Transform(normalizeNumber)
  @IsDefined({ message: 'Длительность тура в днях обязательна' })
  @IsInt({ message: 'Длительность тура в днях должна быть целым числом' })
  @Min(1, { message: 'Тур должен длиться не меньше 1 дня' })
  @Max(30, {
    message: 'Тур не должен длиться больше 30 дней',
  })
  durationDays!: number;

  @ApiPropertyOptional({
    example: 9,
    description: 'Длительность в часах',
    type: Number,
    nullable: true,
    minimum: 1,
    maximum: 24,
  })
  @Transform(normalizeNumber)
  @IsOptional()
  @IsInt({ message: 'Длительность экскурсии в часах должна быть целым числом' })
  @Min(1, { message: 'Экскурсия должна длиться не меньше 1 часа' })
  @Max(24, {
    message: 'Длительность экскурсии не должна превышать 24 часа',
  })
  durationHours?: number | null;

  @ApiProperty({
    example: 'Горная Ингушетия',
    description: 'Направление тура',
    maxLength: 255,
  })
  @Transform(normalizeString)
  @IsDefined({ message: 'Направление тура обязательно' })
  @IsString({ message: 'Направление тура должно быть строкой' })
  @IsNotEmpty({
    message: 'Направление тура не должно быть пустым',
  })
  @MaxLength(255, {
    message: 'Направление тура не должно превышать 255 символов',
  })
  location!: string;

  @ApiProperty({
    example: 'Заберём вас от отеля во Владикавказе.',
    description: 'Место встречи',
  })
  @Transform(normalizeString)
  @IsDefined({ message: 'Место встречи обязательно' })
  @IsString({ message: 'Место встречи должно быть строкой' })
  @IsNotEmpty({
    message: 'Место встречи не должно быть пустым',
  })
  meetingPoint!: string;

  @ApiPropertyOptional({
    example: 6,
    description: 'Максимальное число участников',
    type: Number,
    nullable: true,
    minimum: 1,
    maximum: 50,
  })
  @Transform(normalizeNumber)
  @IsOptional()
  @IsInt({
    message: 'Максимальное число участников должно быть целым числом',
  })
  @Min(1, {
    message: 'Максимальное число участников должно быть не меньше 1',
  })
  @Max(50, {
    message: 'В группе может быть не больше 50 человек',
  })
  maxParticipants?: number | null;

  @ApiPropertyOptional({
    example: ['Транспорт', 'Сопровождение гида'],
    description: 'Что входит в стоимость',
    type: [String],
  })
  @Transform(({ value }: { value: unknown }) =>
    Array.isArray(value)
      ? value.map((item: unknown) => normalizeString({ value: item }))
      : value,
  )
  @ValidateIf((_object, value: unknown) => value !== undefined)
  @IsArray({
    message: 'Список включённых услуг должен быть массивом',
  })
  @IsString({
    each: true,
    message: 'Каждый пункт в списке включённых услуг должен быть строкой',
  })
  @IsNotEmpty({
    each: true,
    message: 'Пункты в списке включённых услуг не должны быть пустыми',
  })
  included?: string[];

  @ApiPropertyOptional({
    example: ['Обед'],
    description: 'Что оплачивается отдельно',
    type: [String],
  })
  @Transform(({ value }: { value: unknown }) =>
    Array.isArray(value)
      ? value.map((item: unknown) => normalizeString({ value: item }))
      : value,
  )
  @ValidateIf((_object, value: unknown) => value !== undefined)
  @IsArray({ message: 'Список дополнительных расходов должен быть массивом' })
  @IsString({
    each: true,
    message:
      'Каждый пункт в списке дополнительных расходов должен быть строкой',
  })
  @IsNotEmpty({
    each: true,
    message: 'Пункты в списке дополнительных расходов не должны быть пустыми',
  })
  notIncluded?: string[];

  @ApiPropertyOptional({
    example: ['Удобную обувь', 'Воду'],
    description: 'Что взять с собой',
    type: [String],
  })
  @Transform(({ value }: { value: unknown }) =>
    Array.isArray(value)
      ? value.map((item: unknown) => normalizeString({ value: item }))
      : value,
  )
  @ValidateIf((_object, value: unknown) => value !== undefined)
  @IsArray({ message: 'Список вещей должен быть массивом' })
  @IsString({
    each: true,
    message: 'Каждый пункт в списке вещей должен быть строкой',
  })
  @IsNotEmpty({
    each: true,
    message: 'Пункты в списке вещей не должны быть пустыми',
  })
  whatToBring?: string[];

  @ApiPropertyOptional({
    example: 'Маршрут может меняться из-за погоды.',
    description: 'Важная информация',
    type: String,
    nullable: true,
  })
  @Transform(normalizeString)
  @IsOptional()
  @IsString({ message: 'Важная информация должна быть строкой' })
  @IsNotEmpty({
    message: 'Важная информация не должна быть пустой',
  })
  importantInfo?: string | null;

  @ApiPropertyOptional({
    description: 'Программа по дням',
    type: () => [CreateTourDayDto],
  })
  @ValidateIf((_object, value: unknown) => value !== undefined)
  @IsArray({ message: 'Программа по дням должна быть массивом' })
  @ArrayUnique((day: CreateTourDayDto | null) => day?.dayNumber ?? Symbol(), {
    message: 'Номера дней программы не должны повторяться',
  })
  @IsObject({
    each: true,
    message: 'Каждый день программы должен быть объектом',
  })
  @ValidateNested({ each: true })
  @Type(() => CreateTourDayDto)
  days?: CreateTourDayDto[];

  @ApiPropertyOptional({
    description: 'Загруженные изображения для галереи тура',
    type: () => [CreateTourImageDto],
    maxItems: 30,
  })
  @ValidateIf((_object, value: unknown) => value !== undefined)
  @IsArray({ message: 'Изображения должны быть массивом' })
  @ArrayMaxSize(30, { message: 'У тура может быть не больше 30 изображений' })
  @ArrayUnique(
    (image: CreateTourImageDto | null) =>
      typeof image?.id === 'string' ? image.id.toLowerCase() : Symbol(),
    { message: 'ID изображений не должны повторяться' },
  )
  @ArrayUnique(
    (image: CreateTourImageDto | null) => image?.position ?? Symbol(),
    { message: 'Позиции изображений в галерее не должны повторяться' },
  )
  @IsObject({ each: true, message: 'Каждое изображение должно быть объектом' })
  @ValidateNested({ each: true })
  @Type(() => CreateTourImageDto)
  images?: CreateTourImageDto[];

  @ApiPropertyOptional({
    example: true,
    description: 'Показывать тур в каталоге',
  })
  @ValidateIf((_object, value: unknown) => value !== undefined)
  @IsBoolean({
    message: 'Признак публикации должен быть логическим значением',
  })
  isActive?: boolean;
}
