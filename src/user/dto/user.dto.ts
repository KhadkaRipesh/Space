import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class EditProfileDto {
  @IsString()
  username: string;

  @MinLength(5)
  @Transform(({ value }) => value.trim())
  @IsEmail()
  email: string;
}
