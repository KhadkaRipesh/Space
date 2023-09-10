import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class EditProfileDto {
  @IsString()
  @ApiProperty({description:'User Name',example: 'John Doe' })
  username: string;

  @MinLength(5)
  @Transform(({ value }) => value.trim())
  @ApiProperty({description: 'User Email', example: 'johndoe@gmail.com'})
  @IsEmail()
  email: string;
}
