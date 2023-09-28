import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateSpaceDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Space Name', example: 'Lancemeup Space' })
  space_name: string;
}
export class ShareSpaceDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'Member Email', example: 'johndoe@gmail.com' })
  email: string;
}

export class UpdateSpaceDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'New Space Name', example: 'Lancemeup NewSpace' })
  space_name: string;
}

export class UpdateDaysToCheckDTO {
  @ApiProperty({
    description: 'Days to check the creator last activity',
    example: '10',
  })
  days: number;
}
