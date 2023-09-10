import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class RegisterUserDto {
  @IsString()
  @ApiProperty({ description: 'User Name', example: 'John Doe' })
  username: string;

  @MinLength(3)
  @IsEmail()
  @Transform(({ value }) => value.trim())
  @ApiProperty({ example: 'johndoe@gmail.com' })
  email: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  @ApiProperty({ minLength: 8, example: 'Password@1234' })
  password: string;
}
export class LoginUserDto {
  @MinLength(3)
  @IsEmail()
  @Transform(({ value }) => value.trim())
  @ApiProperty({ example: 'johndoe@gmai.com' })
  email: string;


  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  @ApiProperty({ minLength: 8, example: 'password@123' })
  password: string;
}
