import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';

const includeRelations = {
  team: { include: { city: true } },
} as const;

@Injectable()
export class WorkersService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateWorkerDto) {
    return this.prisma.worker.create({
      data: dto,
      include: includeRelations,
    });
  }

  findAll() {
    return this.prisma.worker.findMany({
      include: includeRelations,
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number) {
    const worker = await this.prisma.worker.findUnique({
      where: { id },
      include: includeRelations,
    });
    if (!worker) {
      throw new NotFoundException(`Worker ${id} not found`);
    }
    return worker;
  }

  async update(id: number, dto: UpdateWorkerDto) {
    await this.findOne(id);
    return this.prisma.worker.update({
      where: { id },
      data: dto,
      include: includeRelations,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.worker.delete({ where: { id } });
  }
}
