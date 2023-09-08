import { Transform } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class RegisterUserDto {
  @IsString()
  username: string;

  @MinLength(3)
  @IsEmail()
  @Transform(({ value }) => value.trim())
  email: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password: string;
}
export class LoginUserDto {
  @MinLength(3)
  @IsEmail()
  @Transform(({ value }) => value.trim())
  email: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  password: string;
}
