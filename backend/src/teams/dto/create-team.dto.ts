import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateTeamDto {
  @IsNotEmpty()
  name: string;

  @IsInt()
  cityId: number;
}
