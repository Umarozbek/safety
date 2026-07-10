import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { JobAssignmentsService } from './job-assignments.service';
import { CreateJobAssignmentDto } from './dto/create-job-assignment.dto';
import { UpdateJobAssignmentDto } from './dto/update-job-assignment.dto';
import { FinishJobAssignmentDto } from './dto/finish-job-assignment.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/strategies/jwt.strategy';

@Controller('job-assignments')
export class JobAssignmentsController {
  constructor(private readonly jobAssignmentsService: JobAssignmentsService) {}

  @Roles(UserRole.ADMIN)
  @Post()
  create(@Body() dto: CreateJobAssignmentDto) {
    return this.jobAssignmentsService.create(dto);
  }

  @Roles(UserRole.ADMIN, UserRole.BOSS)
  @Get()
  findAll() {
    return this.jobAssignmentsService.findAll();
  }

  @Roles(UserRole.WORKER)
  @Get('mine')
  findMine(@CurrentUser() user: AuthenticatedUser) {
    return this.jobAssignmentsService.findForWorkerUser(user.id);
  }

  @Roles(UserRole.ADMIN, UserRole.BOSS)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.jobAssignmentsService.findOne(id);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateJobAssignmentDto,
  ) {
    return this.jobAssignmentsService.update(id, dto);
  }

  @Roles(UserRole.WORKER)
  @Patch(':id/finish')
  finish(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: FinishJobAssignmentDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.jobAssignmentsService.finishForWorkerUser(user.id, id, dto);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.jobAssignmentsService.remove(id);
  }
}
