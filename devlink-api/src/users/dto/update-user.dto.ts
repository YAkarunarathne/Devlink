import { IsEmail, IsOptional, IsString, MinLength, Matches } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @Matches(/^[a-zA-Z\s]+$/, { message: 'Name can only contain letters and spaces' })
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
