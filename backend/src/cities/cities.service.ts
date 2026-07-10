import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';

@Injectable()
export class CitiesService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateCityDto) {
    return this.prisma.city.create({ data: dto });
  }

  findAll() {
    return this.prisma.city.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: number) {
    const city = await this.prisma.city.findUnique({ where: { id } });
    if (!city) {
      throw new NotFoundException(`City ${id} not found`);
    }
    return city;
  }

  async update(id: number, dto: UpdateCityDto) {
    await this.findOne(id);
    return this.prisma.city.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.city.delete({ where: { id } });
  }

  async overview() {
    const cities = await this.prisma.city.findMany({
      include: {
        sites: {
          include: {
            order: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return cities.map((city) => {
      const completedSqm = city.sites
        .filter((s) => s.order?.status === 'COMPLETED')
        .reduce((sum, s) => sum + Number(s.sizeSqm), 0);
      const pendingSqm = city.sites
        .filter((s) => s.order && s.order.status !== 'COMPLETED')
        .reduce((sum, s) => sum + Number(s.sizeSqm), 0);

      return {
        id: city.id,
        name: city.name,
        status: city.status,
        completedSqm,
        pendingSqm,
        siteCount: city.sites.length,
      };
    });
  }
}
