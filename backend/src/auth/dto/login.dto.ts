import { IsNotEmpty, IsNumberString, Length } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  username: string;

  @IsNumberString()
  @Length(4, 6)
  password: string;
}
