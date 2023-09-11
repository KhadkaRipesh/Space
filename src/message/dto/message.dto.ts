import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Hii Ripesh!' })
  content: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '4c433902-4ac8-436d-b24b-33ed62803888' })
  space_id: string;
}
export class DeleteMessageDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: '5677a512-bc32-4aeb-b359-3e3f8c2bce6b' })
  space_id: string;

  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: '7fc3d721-fa9a-4cca-97b0-6ab55a4a612e' })
  message_id: string;
}
