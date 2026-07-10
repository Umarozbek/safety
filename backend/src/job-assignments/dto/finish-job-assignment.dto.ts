import { IsOptional, IsString } from 'class-validator';

export class FinishJobAssignmentDto {
  @IsOptional()
  @IsString()
  completionPhotoUrl?: string;
}
