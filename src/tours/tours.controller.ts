import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Auth } from '@/common/decorators/auth.decorator';
import { ServiceDataResponse } from '@/common/types/service-response.types';

import {
  ApiCreateTour,
  ApiFindTourById,
  ApiFindTourByIdForAdmin,
} from './docs/tours.swagger';
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
  @ApiCreateTour()
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
  @ApiFindTourById()
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.toursService.findById(id);
  }

  @Get('admin/:id')
  @Auth({ adminOnly: true })
  @ApiFindTourByIdForAdmin()
  findByIdForAdmin(@Param('id', ParseUUIDPipe) id: string) {
    return this.toursService.findByIdForAdmin(id);
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
