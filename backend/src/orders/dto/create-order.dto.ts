import { Type } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

class OrderSiteDto {
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

export class CreateOrderDto {
  @IsInt()
  customerId: number;

  @ValidateNested()
  @Type(() => OrderSiteDto)
  site: OrderSiteDto;

  @IsDateString()
  requestedDate: string;
}
