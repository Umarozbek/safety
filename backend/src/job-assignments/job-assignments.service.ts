import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JobAssignmentStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJobAssignmentDto } from './dto/create-job-assignment.dto';
import { UpdateJobAssignmentDto } from './dto/update-job-assignment.dto';
import { FinishJobAssignmentDto } from './dto/finish-job-assignment.dto';

const includeRelations = {
  team: { include: { city: true, workers: true } },
  order: { include: { customer: true, site: { include: { city: true } } } },
} as const;

@Injectable()
export class JobAssignmentsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateJobAssignmentDto) {
    return this.prisma.jobAssignment.create({
      data: {
        orderId: dto.orderId,
        teamId: dto.teamId,
        assignedDate: new Date(dto.assignedDate),
      },
      include: includeRelations,
    });
  }

  findAll() {
    return this.prisma.jobAssignment.findMany({
      include: includeRelations,
      orderBy: { assignedDate: 'desc' },
    });
  }

  async findOne(id: number) {
    const assignment = await this.prisma.jobAssignment.findUnique({
      where: { id },
      include: includeRelations,
    });
    if (!assignment) {
      throw new NotFoundException(`Job assignment ${id} not found`);
    }
    return assignment;
  }

  async update(id: number, dto: UpdateJobAssignmentDto) {
    await this.findOne(id);
    return this.prisma.jobAssignment.update({
      where: { id },
      data: dto,
      include: includeRelations,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.jobAssignment.delete({ where: { id } });
  }

  /** Jobs assigned to the team of the given worker's user account. */
  async findForWorkerUser(userId: number) {
    const worker = await this.prisma.worker.findUnique({
      where: { userAccountId: userId },
    });
    if (!worker) {
      throw new NotFoundException('No worker profile linked to this user');
    }

    return this.prisma.jobAssignment.findMany({
      where: { teamId: worker.teamId },
      include: includeRelations,
      orderBy: { assignedDate: 'desc' },
    });
  }

  /** Worker marks their team's job as finished; verifies team ownership. */
  async finishForWorkerUser(
    userId: number,
    jobAssignmentId: number,
    dto: FinishJobAssignmentDto,
  ) {
    const worker = await this.prisma.worker.findUnique({
      where: { userAccountId: userId },
    });
    if (!worker) {
      throw new NotFoundException('No worker profile linked to this user');
    }

    const assignment = await this.prisma.jobAssignment.findUnique({
      where: { id: jobAssignmentId },
    });
    if (!assignment) {
      throw new NotFoundException(
        `Job assignment ${jobAssignmentId} not found`,
      );
    }
    if (assignment.teamId !== worker.teamId) {
      throw new ForbiddenException('This job is not assigned to your team');
    }

    return this.prisma.jobAssignment.update({
      where: { id: jobAssignmentId },
      data: {
        status: JobAssignmentStatus.FINISHED,
        finishedAt: new Date(),
        completionPhotoUrl: dto.completionPhotoUrl,
      },
      include: includeRelations,
    });
  }
}
