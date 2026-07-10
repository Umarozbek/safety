import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { CityStatus } from '@prisma/client';

export class CreateCityDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsEnum(CityStatus)
  status?: CityStatus;
}
