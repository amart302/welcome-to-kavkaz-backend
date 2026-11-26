import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { Auth } from '@/common/decorators/auth.decorator';
import { ServiceDataResponse } from '@/common/types/service-response.types';

import { tourDetailsExample } from './docs/tours.examples';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { ToursService } from './tours.service';
import { TourDetailsResponse } from './types/tour.types';

@Controller('tours')
@ApiTags('Tours')
export class ToursController {
  constructor(private readonly toursService: ToursService) {}

  @Post()
  @Auth({ adminOnly: true })
  @ApiOperation({ summary: 'Создание тура' })
  @ApiCreatedResponse({
    description: 'Тур успешно создан',
    schema: {
      example: {
        success: true,
        message: 'Тур успешно создан',
        data: tourDetailsExample,
      },
    },
  })
  @ApiBadRequestResponse({
    description:
      'Ошибка валидации, номер дня превышает длительность тура или изображение недоступно для привязки',
    examples: {
      validation: {
        summary: 'Ошибка валидации входных данных',
        value: {
          success: false,
          statusCode: 400,
          message: ['Название тура обязательно'],
        },
      },
      dayBeyondDuration: {
        summary: 'Номер дня превышает длительность тура',
        value: {
          success: false,
          statusCode: 400,
          message: 'Номер дня программы не может превышать длительность тура',
        },
      },
      imageUnavailable: {
        summary: 'Изображение недоступно для привязки',
        value: {
          success: false,
          statusCode: 400,
          message: 'Изображение не найдено или уже привязано к туру',
        },
      },
    },
  })
  @ApiConflictResponse({
    description: 'Тур с таким slug уже существует',
    schema: {
      example: {
        success: false,
        statusCode: 409,
        message: 'Тур с таким slug уже существует',
      },
    },
  })
  create(
    @Body() dto: CreateTourDto,
  ): Promise<ServiceDataResponse<TourDetailsResponse>> {
    return this.toursService.create(dto);
  }

  @Get()
  findAll() {
    return this.toursService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.toursService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTourDto) {
    return this.toursService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.toursService.remove(+id);
  }
}
