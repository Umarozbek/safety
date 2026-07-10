import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { QueryOrdersDto } from './dto/query-orders.dto';

const includeRelations = {
  customer: true,
  site: { include: { city: true } },
  jobAssignments: { include: { team: true } },
} as const;

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOrderDto) {
    const city = await this.prisma.city.findUnique({
      where: { id: dto.site.cityId },
    });
    if (!city) {
      throw new NotFoundException(`City ${dto.site.cityId} not found`);
    }

    const orderNumber = await this.generateOrderNumber(city.name);

    return this.prisma.order.create({
      data: {
        orderNumber,
        requestedDate: new Date(dto.requestedDate),
        customer: { connect: { id: dto.customerId } },
        site: {
          create: {
            cityId: dto.site.cityId,
            address: dto.site.address,
            mapLink: dto.site.mapLink,
            sizeSqm: dto.site.sizeSqm,
            accessNotes: dto.site.accessNotes,
          },
        },
      },
      include: includeRelations,
    });
  }

  private async generateOrderNumber(cityName: string): Promise<string> {
    const prefix = cityName.replace(/\s+/g, '');
    const count = await this.prisma.order.count({
      where: { orderNumber: { startsWith: `${prefix}_` } },
    });
    const next = count + 1;
    return `${prefix}_${String(next).padStart(2, '0')}`;
  }

  findAll(query: QueryOrdersDto) {
    return this.prisma.order.findMany({
      where: {
        status: query.status,
        site: query.cityId ? { cityId: query.cityId } : undefined,
      },
      include: includeRelations,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: includeRelations,
    });
    if (!order) {
      throw new NotFoundException(`Order ${id} not found`);
    }
    return order;
  }

  async update(id: number, dto: UpdateOrderDto) {
    await this.findOne(id);
    return this.prisma.order.update({
      where: { id },
      data: dto,
      include: includeRelations,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.order.delete({ where: { id } });
  }
}
