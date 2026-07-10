import { IsEnum, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { WorkerRole } from '@prisma/client';

export class CreateWorkerDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  phone: string;

  @IsInt()
  teamId: number;

  @IsEnum(WorkerRole)
  role: WorkerRole;

  @IsOptional()
  @IsInt()
  userAccountId?: number;
}
