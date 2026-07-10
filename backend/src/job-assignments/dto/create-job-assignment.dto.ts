import { IsDateString, IsInt } from 'class-validator';

export class CreateJobAssignmentDto {
  @IsInt()
  orderId: number;

  @IsInt()
  teamId: number;

  @IsDateString()
  assignedDate: string;
}
