import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateSiteDto {
  @IsInt()
  cityId: number;

  @IsNotEmpty()
  address: string;

  @IsOptional()
  @IsString()
  mapLink?: string;

  @IsNumber()
  @IsPositive()
  sizeSqm: number;

  @IsOptional()
  @IsString()
  accessNotes?: string;
}
