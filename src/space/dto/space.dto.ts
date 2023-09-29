import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSpaceDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Space Name', example: 'Lancemeup Space' })
  space_name: string;

  @ApiPropertyOptional({
    description: 'Days to check the creator last activity.',
    example: '15',
  })
  @IsNumber()
  @IsOptional()
  share_access_on: number;

  @ApiPropertyOptional({
    description: 'Hours to check the unrespond reminder.',
    example: '15',
  })
  @IsNumber()
  @IsOptional()
  checkUnrespondHoursTime: number;
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

export class UpdateHoursToCheckDTO {
  @ApiProperty({
    description: 'Hours to check the un respond reminder.',
    example: '42',
  })
  hours: number;
}
