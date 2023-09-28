import { IsEnum, IsIn } from 'class-validator';
import { SpaceType } from '../entities/space.entity';
import { ApiProperty } from '@nestjs/swagger';

export class SpaceFilterDto {
  @ApiProperty({
    description: 'Space Types[private/shared]',
    example: SpaceType.PRIVATE,
  })
  @IsEnum(SpaceType)
  @IsIn([SpaceType.PRIVATE, SpaceType.SHARED])
  type: SpaceType;
}
