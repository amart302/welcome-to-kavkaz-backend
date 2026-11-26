import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';

import { ServiceDataResponse } from '@/common/types/service-response.types';
import { Prisma } from '@/generated/prisma/client';
import { PrismaService } from '@/prisma/prisma.service';

import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { tourDetailsSelect } from './selects/tour.selects';
import { TourDetailsResponse } from './types/tour.types';

@Injectable()
export class ToursService {
  private readonly logger = new Logger(ToursService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async create(
    dto: CreateTourDto,
  ): Promise<ServiceDataResponse<TourDetailsResponse>> {
    const { days, images, ...data } = dto;
    const { slug, durationDays } = data;

    this.logger.log(`Tour creation started (slug=${slug})`);

    const invalidDay = days?.find(({ dayNumber }) => dayNumber > durationDays);

    if (invalidDay) {
      this.logger.warn(
        `Tour creation failed: day exceeds tour duration (slug=${slug}, dayNumber=${invalidDay.dayNumber}, durationDays=${durationDays})`,
      );

      throw new BadRequestException(
        'Номер дня программы не может превышать длительность тура',
      );
    }

    const tour = await this.prismaService.$transaction(async (tx) => {
      const createdTour = await tx.tour
        .create({ data })
        .catch((error: unknown) => {
          if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002'
          ) {
            this.logger.warn(
              `Tour creation failed: slug already exists (slug=${slug})`,
            );

            throw new ConflictException('Тур с таким slug уже существует');
          }

          throw error;
        });

      if (days?.length) {
        await tx.tourDay.createMany({
          data: days.map((item) => ({ ...item, tourId: createdTour.id })),
        });
      }

      for (const image of images ?? []) {
        const { count } = await tx.image.updateMany({
          where: { id: image.id, tourId: null },
          data: {
            tourId: createdTour.id,
            position: image.position,
          },
        });

        if (count === 0) {
          this.logger.warn(
            `Tour creation failed: image unavailable (slug=${slug}, imageId=${image.id})`,
          );

          throw new BadRequestException(
            'Изображение не найдено или уже привязано к туру',
          );
        }
      }

      return tx.tour.findUniqueOrThrow({
        where: { id: createdTour.id },
        select: tourDetailsSelect,
      });
    });

    this.logger.log(`Tour creation completed successfully (tourId=${tour.id})`);

    return {
      message: 'Тур успешно создан',
      data: tour,
    };
  }

  findAll() {
    return `This action returns all tours`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tour`;
  }

  update(id: number, dto: UpdateTourDto) {
    void dto;
    return `This action updates a #${id} tour`;
  }

  remove(id: number) {
    return `This action removes a #${id} tour`;
  }
}
