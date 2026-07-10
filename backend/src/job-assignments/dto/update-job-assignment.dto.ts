import { IsEnum, IsOptional } from 'class-validator';
import { JobAssignmentStatus } from '@prisma/client';

export class UpdateJobAssignmentDto {
  @IsOptional()
  @IsEnum(JobAssignmentStatus)
  status?: JobAssignmentStatus;
}
