import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty()
  companyName: string;

  @IsNotEmpty()
  contactPhone: string;

  @IsOptional()
  contactPerson?: string;
}
