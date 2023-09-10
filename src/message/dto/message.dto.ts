import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Hii Ripesh!' })
  content: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({example: '4c433902-4ac8-436d-b24b-33ed62803888'})
  space_id:string;
}
