import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';

const includeRelations = {
  city: true,
  order: true,
} as const;

@Injectable()
export class SitesService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateSiteDto) {
    return this.prisma.site.create({ data: dto, include: includeRelations });
  }

  findAll() {
    return this.prisma.site.findMany({
      include: includeRelations,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const site = await this.prisma.site.findUnique({
      where: { id },
      include: includeRelations,
    });
    if (!site) {
      throw new NotFoundException(`Site ${id} not found`);
    }
    return site;
  }

  async update(id: number, dto: UpdateSiteDto) {
    await this.findOne(id);
    return this.prisma.site.update({
      where: { id },
      data: dto,
      include: includeRelations,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.site.delete({ where: { id } });
  }
}
