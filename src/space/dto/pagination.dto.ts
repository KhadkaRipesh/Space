import {  ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  page: number;

  @ApiPropertyOptional({ example: 2 })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  limit: number;
}
